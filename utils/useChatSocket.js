// utils/useChatSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/messagesSlice';

export const useChatSocket = (chatId, currentUser) => {
    const socketRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!chatId || !currentUser) {
            return;
        }

        // 1. Establish WebSocket Connection
        // The user's auth token must be passed to authenticate the connection.
        // The backend will reject connections without a valid token.
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("Authentication token not found. WebSocket connection failed.");
            return;
        }
        
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${token}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`WebSocket connected for chat ${chatId}`);
        };

        // 2. Listen for Incoming Messages
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // The backend consumer broadcasts a message that looks slightly different
            // from our API response, so we format it for the Redux store.
            // The `addMessage` reducer expects a `chat` property to correctly place the message.
            const formattedMessage = {
                id: data.id || new Date().getTime(), // Use backend ID if available, else generate temporary ID
                chat: chatId,
                content: data.message,
                sender: data.sender_role === 'employer' ? 'e' : 'c',
                sender_id: data.sender_id,
                sender_name: data.sender_name,
                sent_at: data.sent_at,
                is_read: false, // Assume unread initially
            };

            // Dispatch the action to add the new message to the Redux store
            dispatch(addMessage(formattedMessage));
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            if (event.code !== 1000) { // 1000 is normal closure
                console.error(`WebSocket disconnected unexpectedly for chat ${chatId}. Code: ${event.code}`);
            } else {
                console.log(`WebSocket disconnected for chat ${chatId}`);
            }
        };

        // 3. Cleanup on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close(1000, "Component unmounting");
            }
        };
    }, [chatId, currentUser, dispatch]);

    // 4. Function to Send a Message
    const sendMessage = (messageContent) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const messagePayload = {
                message: messageContent,
                // The backend consumer will get the user from the authenticated connection,
                // so we only need to send the message content.
            };
            socketRef.current.send(JSON.stringify(messagePayload));
        } else {
            console.error('WebSocket is not connected or not in an open state.');
        }
    };

    return { sendMessage };
};
