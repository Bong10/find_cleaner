'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatMessages,
  sendMessage,
  selectMessagesForChat,
  selectMessagesLoading,
  markChatAllRead,
  fetchUnreadCount,
} from "@/store/slices/messagesSlice";
import { selectCurrentChat, fetchChats, setChatUnread } from "@/store/slices/chatsSlice";
import { markAllMessagesReadLocal } from "@/store/slices/messagesSlice";

const PRIMARY = "#4C9A99"; // brand color

const ContentField = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector(selectCurrentChat);
  const chatId = selectedChat?.id;

  const [text, setText] = useState("");
  const messages = useSelector(selectMessagesForChat(chatId));
  const loading = useSelector(selectMessagesLoading(chatId));
  const endRef = useRef(null);

  const cleaner = selectedChat?.cleaner;
  const employer = selectedChat?.employer;

  const cleanerAvatar = cleaner?.user?.profile_picture || "/images/resource/candidate-1.png";
  const employerAvatar = employer?.user?.profile_picture || "/images/resource/employer-1.png";
  // For employer dashboard, the header shows the cleaner's name
  const headerName = cleaner?.user?.name || "Conversation";

  /**
   * Determines if a message is from the 'employer' (self) or 'cleaner' (other).
   * This is the robust version that works on the cleaner dashboard.
   * @param {object} message - The message object.
   * @returns {'employer' | 'cleaner' | 'unknown'}
   */
  const resolveSenderSide = (message) => {
    if (!message || !employer || !cleaner) return 'unknown';

    // Handle compact sender flags from backend like 'e' (employer) / 'c' (cleaner)
    const senderFlag = (message.sender || message.nxSenderCode || "").toString().toLowerCase();
    if (senderFlag === 'e' || senderFlag === 'employer') return 'employer';
    if (senderFlag === 'c' || senderFlag === 'cleaner' || senderFlag === 'worker') return 'cleaner';

    // Get all possible IDs for the sender from the message object
    const senderId = message.nxSenderId ?? message.sender_user_id ?? message.sender_id ?? message.sender?.user?.id ?? message.sender?.id ?? null;
    if (senderId === null) return 'unknown';

    // Get all possible IDs for the employer and cleaner participants from the chat object
    const employerUserIds = [employer.user?.id, employer.id].filter(Boolean).map(String);
    const cleanerUserIds = [cleaner.user?.id, cleaner.id].filter(Boolean).map(String);

    if (employerUserIds.includes(String(senderId))) return 'employer';
    if (cleanerUserIds.includes(String(senderId))) return 'cleaner';

    // Fallback for role-based check if ID matching fails
    const senderRole = (message.nxSenderRole || message.sender_role || "").toLowerCase();
    if (senderRole === 'employer') return 'employer';
    if (senderRole === 'cleaner' || senderRole === 'worker') return 'cleaner';
    
    return 'unknown';
  };

  // Load messages for the selected chat
  useEffect(() => {
    if (!chatId) return;
    dispatch(fetchChatMessages({ chatId }));
  }, [dispatch, chatId]);

  // Mark all messages as read when a chat is opened (always run on chat change)
  useEffect(() => {
    if (!chatId) return;
    // Optimistically clear unread in UI immediately
    dispatch(setChatUnread({ chatId, unread: 0 }));
    // Optimistically mark local messages as read so badges don't bounce
    dispatch(markAllMessagesReadLocal(chatId));
    // Call server to persist the read-state; then refresh global unread count
    dispatch(markChatAllRead(chatId))
      .finally(() => {
        dispatch(fetchUnreadCount());
      })
      .catch(() => {});
  }, [dispatch, chatId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || !chatId) return;
    try {
      await dispatch(sendMessage({ chat: chatId, content })).unwrap();
      setText("");
      dispatch(fetchChats()); // Refresh contact list preview
    } catch (error) {
      // Handle error silently in UI
    }
  };

  const isArchived = selectedChat ? selectedChat.is_active === false : false;
  const canSendMessage = text.trim().length > 0;

  if (!selectedChat) {
    return (
      <div className="empty-wrap">
        <div className="empty-state">
          <i className="fa fa-comments fa-3x mb-3" style={{ color: "#9aa0a6" }} />
          <p className="text-muted m-0">No conversation selected</p>
          <small className="text-muted">Pick a contact on the left to start chatting</small>
        </div>
        <style jsx>{`
          .empty-wrap {
            height: calc(100vh - 260px);
            background: #fff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="chat-card">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <div className="header-avatar">
              <Image
                fill
                src={cleanerAvatar} // Show cleaner avatar in header
                alt={headerName}
                style={{ objectFit: "cover" }}
                sizes="46px"
              />
            </div>
            <div>
              <h6 className="title">{headerName}</h6>
              <small className="subtitle">
                {messages.length} {messages.length === 1 ? "Message" : "Messages"}
              </small>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-body">
          {loading && messages.length === 0 ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-3">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-thread">
              <i className="fa fa-comment-dots fa-2x mb-2" style={{ color: "#9aa0a6" }} />
              <p className="text-muted">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((m) => {
              const senderSide = resolveSenderSide(m);
              const isMine = senderSide === 'employer';

              // Use participant avatars to avoid inconsistent message-level sender avatars
              const avatar = isMine ? employerAvatar : cleanerAvatar;

              let timeText = "";
              try {
                const ts = m?.nxSentAt || m?.sent_at;
                timeText = ts ? new Date(ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) : "";
              } catch {
                timeText = "";
              }

              return (
                <div key={m.id} className={`row ${isMine ? "sent" : "received"}`}>
                  <div className="avatar">
                    <Image
                      fill
                      src={avatar}
                      alt="sender"
                      style={{ objectFit: "cover" }}
                      sizes="34px"
                    />
                  </div>
                  <div className="bubble">
                    <div className="content">{m.content}</div>
                    <div className="time">{timeText}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        {/* Footer */}
        <div className="chat-footer">
          {isArchived ? (
            <div className="archived">
              <i className="fa fa-archive me-2" />
              This chat is archived. You cannot send new messages.
            </div>
          ) : (
            <form className="input-row" onSubmit={handleSendMessage}>
              <textarea
                className="msg-input"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                className={`send ${canSendMessage ? "active" : ""}`}
                disabled={!canSendMessage}
                aria-label="Send"
                title="Send"
              >
                <i className="fa fa-paper-plane" />
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-card {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 260px); /* equal panel height with internal scroll */
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }
        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          background: #fff;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          border: 2px solid #f1f1f1;
          flex-shrink: 0;
        }
        .title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .subtitle {
          color: #8a8f94;
        }
        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 22px;
          background: #f5f7fa;
        }
        .loading,
        .empty-thread {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 28px 0;
          color: #9aa0a6;
        }
        .row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          margin-bottom: 14px;
        }
        .row.sent {
          flex-direction: row-reverse;
        }
        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          border: 2px solid #fff;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }
        .bubble {
          max-width: 66%;
          background: #fff;
          border: 1px solid #ebedf0;
          padding: 10px 14px;
          border-radius: 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }
        .row.sent .bubble {
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-bottom-right-radius: 6px;
        }
        .row.received .bubble {
          border-bottom-left-radius: 6px;
        }
        .content {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 4px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .time {
          font-size: 11px;
          opacity: 0.8;
          text-align: right;
        }
        .chat-footer {
          padding: 14px 18px;
          border-top: 1px solid #eee;
          background: #fff;
        }
        .archived {
          text-align: center;
          color: #8a8f94;
        }
        .input-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .msg-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 24px;
          font-size: 14px;
          resize: none;
          max-height: 120px;
          overflow-y: auto;
          background: #fff;
          transition: all 0.2s;
          font-family: inherit;
        }
        .msg-input:focus {
          outline: none;
          border-color: ${PRIMARY};
          box-shadow: 0 0 0 3px ${PRIMARY}20;
        }
        .send {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: #cfd5db;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: not-allowed;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .send.active {
          background: ${PRIMARY};
          cursor: pointer;
          box-shadow: 0 4px 12px ${PRIMARY}44;
        }
        .send.active:hover {
          transform: scale(1.06);
        }
      `}</style>
    </>
  );
};

export default ContentField;