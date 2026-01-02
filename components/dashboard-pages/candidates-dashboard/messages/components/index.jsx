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
import { fetchUnreadCount, fetchChatMessages, selectUnreadCount } from "@/store/slices/messagesSlice";
import { useNotificationsSocket } from "@/utils/useNotificationsSocket";

const ChatBox = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const isAuthenticated = useSelector((s) => !!s.auth?.isAuthenticated);

  const chats = useSelector(selectAllChats) || [];
  const currentChatId = useSelector(selectCurrentChatId);
  const unreadCount = useSelector(selectUnreadCount);
  const prefetchSetRef = useRef(new Set());

  useNotificationsSocket({
    enabled: isAuthenticated,
    onEvent: (evt) => {
      const type = String(evt?.type || "").toLowerCase();
      const chatIdFromEvt = evt?.chat_id ?? evt?.chatId ?? evt?.chat?.id ?? null;
      const looksChatRelated = !!chatIdFromEvt || /message|chat/.test(type);
      if (!looksChatRelated) return;

      dispatch(fetchChats());
      dispatch(fetchUnreadCount());
      if (chatIdFromEvt) {
        dispatch(fetchChatMessages({ chatId: chatIdFromEvt }));
      }
    },
  });

  // Initial load: fetch my chats and unread count
  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // When there's a chat param, set that as the current chat once chats are available
  useEffect(() => {
    const chatParam = searchParams?.get("chat");
    if (!chatParam) return;
    const found = chats.find((c) => String(c.id) === String(chatParam));
    if (found && String(currentChatId) !== String(found.id)) {
      dispatch(setCurrentChatId(found.id));
    }
  }, [searchParams, chats, currentChatId, dispatch]);

  // No polling: WS handles realtime updates. Keep REST fetch for initial load and on-demand prefetch.

  // Auto-select the first chat if none is selected
  useEffect(() => {
    const hasChatParam = !!searchParams?.get("chat");
    if (!hasChatParam && !currentChatId && chats.length > 0) {
      // eslint-disable-next-line no-console
      console.log("[Candidate ChatBox] Auto-selecting first chat", chats[0]?.id);
      dispatch(setCurrentChatId(chats[0].id));
    }
  }, [chats, currentChatId, searchParams, dispatch]);

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
    // This can be connected to a sidebar toggle if needed
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
              {/* ContactList will now use Redux data passed down implicitly */}
              <ContactList />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-xl-8 col-lg-7 col-md-12 col-sm-12 chat">
          {/* ContentField will also use Redux data */}
          <ContentField />
        </div>
      </div>

      <style jsx>{`
        .message-layout {
          align-items: stretch;
        }
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
          overflow: hidden;
          padding: 10px 0 0;
          background: #fff;
        }
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
