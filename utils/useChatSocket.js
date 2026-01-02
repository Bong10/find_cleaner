// utils/useChatSocket.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addMessage, markMessagesReadUpTo } from "@/store/slices/messagesSlice";
import { buildWsUrl } from "@/utils/wsBase";

const safeJsonParse = (raw) => {
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const normalizeIncomingMessage = ({ chatId, payload }) => {
    const msg = payload?.message && typeof payload.message === "object" ? payload.message : payload;
    if (!msg || typeof msg !== "object") return null;

    const id = msg?.id ?? msg?.pk ?? msg?.message_id ?? null;
    const content = msg?.content ?? msg?.message ?? msg?.text ?? "";
    const sent_at = msg?.sent_at ?? msg?.created_at ?? msg?.timestamp ?? msg?.time ?? null;
    const sender_id = msg?.sender_id ?? msg?.sender_user_id ?? msg?.sender?.id ?? msg?.sender?.user?.id ?? null;
    const sender_role = msg?.sender_role ?? msg?.senderRole ?? msg?.role ?? null;
    const is_read = typeof msg?.is_read === "boolean" ? msg.is_read : false;

    // Skip messages with no content or no id (likely not a real message)
    const trimmedContent = String(content || "").trim();
    if (!trimmedContent) return null;
    if (!id) return null;

    return {
        id,
        chat: chatId,
        content: trimmedContent,
        sender_id,
        sender_role,
        sender: sender_role === "employer" ? "e" : sender_role === "cleaner" ? "c" : msg?.sender || null,
        sent_at,
        is_read,
        // keep a couple optional fields if backend sends them
        sender_name: msg?.sender_name ?? msg?.senderName ?? msg?.sender?.name ?? null,
    };
};

/**
 * Django Channels chat socket hook.
 * Outgoing payloads are sent with a `type` field: message/typing/read.
 */
export const useChatSocket = ({
    chatId,
    enabled = true,
    onTyping,
    onStatus,
    onConnected,
    onError,
} = {}) => {
    const dispatch = useDispatch();

    const socketRef = useRef(null);
    const closingRef = useRef(false);
    const reconnectTimerRef = useRef(null);
    const retriesRef = useRef(0);
    const chatIdRef = useRef(chatId);

    // Use refs for callbacks to avoid re-creating connect function
    const onTypingRef = useRef(onTyping);
    const onStatusRef = useRef(onStatus);
    const onConnectedRef = useRef(onConnected);
    const onErrorRef = useRef(onError);

    // Keep refs in sync
    useEffect(() => { onTypingRef.current = onTyping; }, [onTyping]);
    useEffect(() => { onStatusRef.current = onStatus; }, [onStatus]);
    useEffect(() => { onConnectedRef.current = onConnected; }, [onConnected]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);
    useEffect(() => { chatIdRef.current = chatId; }, [chatId]);

    const [isConnected, setIsConnected] = useState(false);

    const closeSocket = useCallback(() => {
        closingRef.current = true;
        setIsConnected(false);
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (socketRef.current) {
            try {
                socketRef.current.close(1000, "Client closing");
            } catch {}
            socketRef.current = null;
        }
    }, []);

    const connect = useCallback(() => {
        const currentChatId = chatIdRef.current;
        if (!enabled || !currentChatId) return;
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;
        if (socketRef.current && socketRef.current.readyState === WebSocket.CONNECTING) return;

        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
            onErrorRef.current?.({ message: "Authentication token not found" });
            return;
        }

        closingRef.current = false;

        const url = buildWsUrl(`/ws/chat/${currentChatId}/?token=${encodeURIComponent(token)}`);
        console.log(`[ChatSocket] Connecting to chat ${currentChatId}...`);
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`[ChatSocket] Connected to chat ${currentChatId}`);
            retriesRef.current = 0;
            setIsConnected(true);
            onConnectedRef.current?.();
        };

        socket.onmessage = (event) => {
            console.log('[ChatSocket] Raw WebSocket message received:', event.data);
            const data = safeJsonParse(event.data);
            console.log('[ChatSocket] Parsed WebSocket data:', data);
            if (!data) return;

            const type = String(data?.type || "").toLowerCase();
            console.log('[ChatSocket] Message type:', type);
            
            // Skip non-message events
            if (type === "connected" || type === "connection" || type === "pong" || type === "ping") return;
            if (type === "error") {
                console.log('[ChatSocket] Error received:', data);
                onErrorRef.current?.(data);
                return;
            }

            if (type === "typing") {
                console.log('[ChatSocket] Typing event:', data);
                onTypingRef.current?.(data);
                return;
            }

            if (type === "status") {
                console.log('[ChatSocket] Status event:', data);
                onStatusRef.current?.(data);
                return;
            }

            if (type === "read") {
                const lastReadId =
                    data?.last_read_message_id ?? data?.last_read_id ?? data?.message_id ?? data?.id ?? null;
                console.log('[ChatSocket] Read receipt, lastReadId:', lastReadId);
                if (lastReadId != null) {
                    dispatch(markMessagesReadUpTo({ chatId: currentChatId, lastReadMessageId: lastReadId }));
                }
                return;
            }

            // Only process actual message types
            if (type && type !== "message" && type !== "chat_message" && type !== "new_message") {
                console.log('[ChatSocket] Unknown type, skipping:', type);
                return;
            }

            // Default: treat as message
            console.log('[ChatSocket] Processing as message...');
            const formatted = normalizeIncomingMessage({ chatId: currentChatId, payload: data });
            console.log('[ChatSocket] Formatted message:', formatted);
            if (formatted) {
                console.log('[ChatSocket] Dispatching addMessage to Redux');
                dispatch(addMessage(formatted));
            } else {
                console.log('[ChatSocket] Message formatting returned null, skipping');
            }
        };

        socket.onerror = (e) => {
            onErrorRef.current?.(e);
        };

        socket.onclose = () => {
            console.log(`[ChatSocket] Disconnected from chat ${currentChatId}`);
            setIsConnected(false);
            socketRef.current = null;
            if (closingRef.current) return;

            // Exponential-ish backoff (max 10s)
            const retry = Math.min(30000, 1000 * Math.pow(2, retriesRef.current));
            retriesRef.current += 1;
            reconnectTimerRef.current = setTimeout(() => {
                connect();
            }, retry);
        };
    }, [enabled, dispatch]);

    // Track the last connected chatId to avoid unnecessary reconnects
    const lastChatIdRef = useRef(null);

    // Connect when enabled and chatId is set, close when chatId changes or component unmounts
    useEffect(() => {
        if (!enabled || !chatId) {
            if (socketRef.current) {
                closeSocket();
            }
            lastChatIdRef.current = null;
            return;
        }
        
        // Only reconnect if chatId actually changed
        if (lastChatIdRef.current === chatId) {
            // Same chat, don't reconnect
            return;
        }
        
        // Close existing connection if chatId changed
        if (socketRef.current) {
            closeSocket();
        }
        
        lastChatIdRef.current = chatId;
        
        // Small delay to ensure clean close before reconnect
        const timer = setTimeout(() => {
            connect();
        }, 100);
        
        return () => {
            clearTimeout(timer);
        };
    }, [enabled, chatId]); // Remove connect/closeSocket from deps - they're stable via useCallback

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            closeSocket();
        };
    }, [closeSocket]);

    const sendRaw = useCallback((obj) => {
        const s = socketRef.current;
        if (!s || s.readyState !== WebSocket.OPEN) return false;
        try {
            s.send(JSON.stringify(obj));
            return true;
        } catch {
            return false;
        }
    }, []);

    const sendMessage = useCallback(
        (content) => {
            const message = String(content || "").trim();
            if (!message) return false;
            return sendRaw({ type: "message", message });
        },
        [sendRaw]
    );

    const sendTyping = useCallback(
        (isTyping) => {
            return sendRaw({ type: "typing", is_typing: !!isTyping });
        },
        [sendRaw]
    );

    const sendRead = useCallback(
        (lastReadMessageId) => {
            const id = lastReadMessageId ?? null;
            // Backend guide commonly uses last_read_message_id; include it when available
            return sendRaw({ type: "read", last_read_message_id: id });
        },
        [sendRaw]
    );

    return {
        isConnected,
        sendMessage,
        sendTyping,
        sendRead,
        closeSocket,
    };
};
