'use client';
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  selectAllChats,
  selectChatsLoading,
  setCurrentChatId,
  selectCurrentChatId,
  setChatUnread,
} from "@/store/slices/chatsSlice";
import Image from "next/image";
import { markAllMessagesReadLocal } from "@/store/slices/messagesSlice";
import InitialsAvatar from "../../../../common/InitialsAvatar";

const ContactList = () => {
  const dispatch = useDispatch();
  const didFetch = useRef(false);

  const chats = useSelector(selectAllChats) || [];
  const loading = useSelector(selectChatsLoading);
  const currentChatId = useSelector(selectCurrentChatId);

  // local messages cache so preview updates immediately after send
  const messagesByChat = useSelector((state) => state.messages?.byChatId || {});

  // Guarded initial fetch — prevents any accidental loop
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    dispatch(fetchChats());
  }, [dispatch]);

  /**
   * Determines if a message is from the 'employer' or 'cleaner' for a given chat.
   * @param {object} message - The message object.
   * @param {object} chat - The chat context.
   * @returns {'employer' | 'cleaner' | 'unknown'}
   */
  const resolveSenderSide = (message, chat) => {
    if (!message || !chat?.employer || !chat?.cleaner) return 'unknown';

    // Handle compact sender flags like 'e'/'c' included by backend
    const senderFlag = (message.sender || message.nxSenderCode || "").toString().toLowerCase();
    if (senderFlag === 'e' || senderFlag === 'employer') return 'employer';
    if (senderFlag === 'c' || senderFlag === 'cleaner' || senderFlag === 'worker') return 'cleaner';

    const senderId = message.nxSenderId ?? message.sender_user_id ?? message.sender_id ?? message.sender?.user?.id ?? message.sender?.id ?? null;
    if (senderId === null) return 'unknown';

    const employerUserIds = [chat.employer.user?.id, chat.employer.id].filter(Boolean).map(String);
    const cleanerUserIds = [chat.cleaner.user?.id, chat.cleaner.id].filter(Boolean).map(String);

    if (employerUserIds.includes(String(senderId))) return 'employer';
    if (cleanerUserIds.includes(String(senderId))) return 'cleaner';

    const senderRole = (message.nxSenderRole || message.sender_role || "").toLowerCase();
    if (senderRole === 'employer') return 'employer';
    if (senderRole === 'cleaner' || senderRole === 'worker') return 'cleaner';

    return 'unknown';
  };

  const getParticipant = (chat) => {
    // For employer view we want the other person: cleaner
    return chat?.cleaner || null;
  };

  const getLastMessage = (chat) => {
    const local = messagesByChat?.[chat.id]?.items;
    const lastLocal = local?.length ? local[local.length - 1] : null;
    const serverLast = chat.last_message || null;

    const getTs = (msg) => {
      const ts = msg?.nxSentAt || msg?.sent_at || msg?.created_at || null;
      if (!ts) return 0;
      try { return new Date(ts).getTime(); } catch { return 0; }
    };

    // Pick whichever is newer so ordering/preview don't get stuck on stale local cache
    const localTs = getTs(lastLocal);
    const serverTs = getTs(serverLast);
    return localTs >= serverTs ? lastLocal : serverLast;
  };

  const getLastMessagePreview = (chat) => {
    const last = getLastMessage(chat);
    if (!last?.content) return "No messages yet.";
    const senderSide = resolveSenderSide(last, chat);
    const isMine = senderSide === 'employer';
    return `${isMine ? "You: " : ""}${last.content}`;
  };

  const getLastMessageTime = (chat) => {
    const last = getLastMessage(chat);
    const ts = last?.nxSentAt || last?.sent_at || last?.created_at || chat?.updated_at || chat?.created_at;
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Derive unread count with multiple fallbacks
    const deriveUnreadForChat = (chat) => {
      // Current open chat: don't show unread in UI
      if (chat?.id === currentChatId) return 0;

      const local = messagesByChat?.[chat.id]?.items || [];
      const hasIsReadField = local.some((m) => typeof m?.is_read === 'boolean');
      if (hasIsReadField) {
        // Prefer local truth if available
        let count = 0;
        for (const m of local) {
          if (m?.is_read === true) continue;
          const side = resolveSenderSide(m, chat);
          if (side === 'cleaner') count += 1;
        }
        return count;
      }

      // Otherwise fall back to server fields
      const candidates = [
        chat?.unread_messages_count,
        chat?.unread_count,
        chat?.unread,
        chat?.unread_for_employer,
        chat?.unread_for_cleaner,
      ];
      const firstNumber = candidates.find((v) => typeof v === "number" && !Number.isNaN(v));
      return typeof firstNumber === "number" ? firstNumber : 0;
    };

  const list = useMemo(() => {
    const getTs = (msg, chat) => {
      const ts = msg?.nxSentAt || msg?.sent_at || msg?.created_at || chat?.updated_at || chat?.created_at;
      if (!ts) return 0;
      try { return new Date(ts).getTime(); } catch { return 0; }
    };

    const withTimes = (chats || []).map((chat) => {
      const local = messagesByChat?.[chat.id]?.items;
      const lastLocal = local?.length ? local[local.length - 1] : null;
      const serverLast = chat.last_message || null;
      const time = Math.max(getTs(lastLocal, chat), getTs(serverLast, chat));
      return { chat, time };
    });
    withTimes.sort((a, b) => b.time - a.time);
    return withTimes.map(x => x.chat);
  }, [chats, messagesByChat]);

  if (loading && !list.length) {
    return (
      <div className="contacts-loading">
        <div className="spinner-border text-primary" role="status" />
        <style jsx>{`
          .contacts-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 0;
            height: calc(100vh - 260px);
            background: #fff;
            border-radius: 12px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="contacts-container">
        <div className="contacts-list">
          {list.length === 0 ? (
            <div className="empty-state">
              <i className="fa fa-comments fa-3x mb-3 text-muted" />
              <p className="text-muted">No conversations yet</p>
            </div>
          ) : (
            list.map((chat) => {
              const participant = getParticipant(chat);
              const isActive = chat.id === currentChatId;

              const name = participant?.user?.name || "Find Cleaner User";
              const avatar = participant?.user?.profile_picture || null;
              const preview = getLastMessagePreview(chat);
              const time = getLastMessageTime(chat);
              const unread = deriveUnreadForChat(chat);

              return (
                <div
                  key={chat.id}
                  className={`contact-item ${isActive ? "active" : ""} ${!isActive && unread > 0 ? "unread" : ""}`}
                  onClick={() => {
                       dispatch(setCurrentChatId(chat.id));
                       // Optimistically clear unread for snappy UI; ContentField will call server
                       dispatch(setChatUnread({ chatId: chat.id, unread: 0 }));
                       dispatch(markAllMessagesReadLocal(chat.id));
                  }}
                >
                  <div className="contact-avatar">
                    <InitialsAvatar
                      name={name}
                      src={avatar}
                      size={50}
                    />
                  </div>

                  <div className="contact-info">
                    <div className="row-1">
                      <h6 className="name">{name}</h6>
                      {time && <span className="time">{time}</span>}
                    </div>
                    <div className="row-2">
                      <p className={`preview ${unread ? "bold" : ""}`}>{preview}</p>
                      {unread > 0 && <span className="badge">{unread}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .contacts-container {
          height: calc(100vh - 260px); /* keeps left pane tall and scrollable */
          background: #fff;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
        }
        .contacts-list {
          flex: 1;
          overflow-y: auto;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 40px 20px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          cursor: pointer;
          transition: background 0.15s ease;
          border-bottom: 1px solid #f5f5f5;
        }
        .contact-item:hover {
          background: #f8f9fb;
        }
        .contact-item.active {
          background: linear-gradient(90deg, #e9f3ff 0%, #f6faff 100%);
          border-left: 3px solid #1967d2;
          padding-left: 11px;
        }
        .contact-item.unread:not(.active) {
          background: #f7fbff;
        }
        .contact-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          margin-right: 12px;
          flex-shrink: 0;
          border: 2px solid #fff;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
        }
        .contact-info {
          flex: 1;
          min-width: 0;
        }
        .row-1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .name {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .time {
          font-size: 11px;
          color: #9aa0a6;
          margin-left: 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .row-2 {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview {
          margin: 0;
          font-size: 13px;
          color: #5f6368;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .preview.bold {
          color: #1a73e8;
          font-weight: 600;
        }
        .badge {
          background: #1967d2;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .contacts-list::-webkit-scrollbar {
          width: 6px;
        }
        .contacts-list::-webkit-scrollbar-thumb {
          background: #d0d4d9;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default ContactList;