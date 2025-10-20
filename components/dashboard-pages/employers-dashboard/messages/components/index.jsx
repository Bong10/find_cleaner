'use client';

import SearchBox from "./SearchBox";
import ContactList from "./ContactList";
import ContentField from "./ContentField";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchChats,
  selectAllChats,
  selectCurrentChatId,
  setCurrentChatId,
} from "@/store/slices/chatsSlice";
import { selectUnreadCount, fetchUnreadCount, fetchChatMessages } from "@/store/slices/messagesSlice";

const ChatBox = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const chats = useSelector(selectAllChats) || [];
  const currentChatId = useSelector(selectCurrentChatId);
  const unreadCount = useSelector(selectUnreadCount);
  const prefetchSetRef = useRef(new Set());
  const chatsRef = useRef([]);

  // Keep a live ref of chats for use inside intervals
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // Initial load: fetch my chats and unread count
  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Apply chat query param if present
  useEffect(() => {
    const chatParam = searchParams?.get("chat");
    if (!chatParam) return;
    const found = chats.find((c) => String(c.id) === String(chatParam));
    if (found && String(currentChatId) !== String(found.id)) {
      dispatch(setCurrentChatId(found.id));
    }
  }, [searchParams, chats, currentChatId, dispatch]);

  // Lightweight polling every 5s to keep list fresh and reorder by recency
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(fetchChats());
      dispatch(fetchUnreadCount());
      if (currentChatId) {
        dispatch(fetchChatMessages({ chatId: currentChatId }));
      }

      // For any chat with unread messages, fetch its messages so previews/timestamps update
      const snapshot = chatsRef.current || [];
      snapshot.forEach((c) => {
        if (c?.unread_messages_count > 0) {
          dispatch(fetchChatMessages({ chatId: c.id }));
        }
      });
    }, 5000);
    return () => clearInterval(id);
  }, [dispatch, currentChatId]);

  // Auto-select the first chat if none is selected
  useEffect(() => {
    const hasChatParam = !!searchParams?.get("chat");
    if (!hasChatParam && !currentChatId && chats.length > 0) {
      // eslint-disable-next-line no-console
      console.log("[ChatBox] Auto-selecting first chat", chats[0]?.id);
      dispatch(setCurrentChatId(chats[0].id));
    }
  }, [chats, currentChatId, searchParams, dispatch]);

  // Light diagnostics for page wrapper
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[ChatBox] chats:", chats.map(c => ({ id: c.id, cleaner: c.cleaner?.user?.name, employer: c.employer?.user?.name })));
    // eslint-disable-next-line no-console
    console.log("[ChatBox] currentChatId:", currentChatId, "unreadCount:", unreadCount);
  }, [chats, currentChatId, unreadCount]);

  // Background prefetch messages for chats missing last_message so previews show without clicking
  useEffect(() => {
    const prefetched = prefetchSetRef.current;
    chats.forEach((c) => {
      if (!c?.last_message && !prefetched.has(c.id)) {
        dispatch(fetchChatMessages({ chatId: c.id }));
        prefetched.add(c.id);
      }
    });
  }, [chats, dispatch]);

  const chatToggle = () => {
    // If you have a sidebar toggle, keep it; no-op here to avoid noise
  };

  return (
    <>
      <div className="row message-layout">
        {/* Left column */}
        <div className="contacts_column col-xl-4 col-lg-5 col-md-12 col-sm-12 chat" id="chat_contacts">
          <div className="card contacts_card">
            <div className="card-header">
              <div className="fix-icon position-absolute top-0 end-0 show-1023" onClick={chatToggle}>
                <span className="flaticon-close"></span>
              </div>
              <div className="search-box-one">
                <SearchBox />
              </div>
            </div>

            <div className="card-body contacts_body">
              {/* ContactList now uses Redux selection internally; no props needed */}
              <ContactList />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-xl-8 col-lg-7 col-md-12 col-sm-12 chat">
          {/* ContentField uses Redux for the selected chat and messages */}
          <ContentField />
        </div>
      </div>

      <style jsx>{`
        /* Ensure both columns are the same height with internal scrolling areas */
        .message-layout {
          align-items: stretch;
        }

        /* Left card fills the viewport height minus header/footer chrome */
        .contacts_card {
          height: calc(100vh - 260px);
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .contacts_card .card-header {
          flex-shrink: 0;
          background: #fff;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px !important;
        }
        .contacts_card .contacts_body {
          flex: 1;
          overflow: hidden;    /* let ContactList manage scroll */
          padding: 10px 0 0;   /* small top spacing below search */
          background: #fff;
        }

        /* Right column: ContentField has its own height and internal scroll set */
        @media (max-width: 991px) {
          .contacts_card {
            height: calc(100vh - 220px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBox;
