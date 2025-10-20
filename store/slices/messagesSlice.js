// store/slices/messagesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listChatMessages,
  sendMessage as apiSendMessage,
  getUnreadCount as apiGetUnreadCount,
  markMessageRead as apiMarkMessageRead,
  markAllRead as apiMarkAllRead,
} from "@/services/messagesService";

export const fetchUnreadCount = createAsyncThunk(
  "messages/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiGetUnreadCount();
      return Number(data?.unread_count) || 0;
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to fetch unread count");
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  "messages/fetchChatMessages",
  async ({ chatId, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await listChatMessages(chatId, params);
      const items = Array.isArray(data) ? data : data?.results || [];
      return { chatId, items };
    } catch (e) {
      return rejectWithValue({
        chatId,
        error: e?.response?.data || "Failed to fetch messages",
      });
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ chat, content }, { rejectWithValue }) => {
    try {
      const { data } = await apiSendMessage({ chat, content });
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to send message");
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  "messages/markMessageAsRead",
  async (messageId, { rejectWithValue }) => {
    try {
      await apiMarkMessageRead(messageId);
      return { messageId };
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to mark as read");
    }
  }
);

export const markChatAllRead = createAsyncThunk(
  "messages/markChatAllRead",
  async (chatId, { rejectWithValue }) => {
    try {
      await apiMarkAllRead(chatId);
      return { chatId };
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to mark all read");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    unreadCount: 0,
    byChatId: {}, // { [chatId]: { items: [], loading: false, error: null } }
  },
  reducers: {
    // Reducer for real-time updates (e.g., via WebSockets)
    addMessage: (state, action) => {
        const message = action.payload;
        const chatId = message.chat;
        if (state.byChatId[chatId]) {
            // Avoid adding duplicates
            if (!state.byChatId[chatId].items.find(m => m.id === message.id)) {
                state.byChatId[chatId].items.push(message);
            }
        }
    },
    // Optimistically mark all messages in a chat as read locally
    markAllMessagesReadLocal: (state, action) => {
      const chatId = action.payload;
      if (state.byChatId[chatId]?.items) {
        state.byChatId[chatId].items = state.byChatId[chatId].items.map((m) => ({
          ...m,
          is_read: true,
        }));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchChatMessages.pending, (state, action) => {
        const { chatId } = action.meta.arg;
        state.byChatId[chatId] = { ...state.byChatId[chatId], loading: true, error: null };
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        const { chatId, items } = action.payload;
        state.byChatId[chatId] = { items, loading: false, error: null };
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        const { chatId, error } = action.payload;
        state.byChatId[chatId] = { ...state.byChatId[chatId], loading: false, error };
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const chatId = message.chat;
        if (state.byChatId[chatId]) {
          state.byChatId[chatId].items.push(message);
        }
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        // Optionally update the message's `is_read` status in the state
        // For now, we just decrement the global unread count
        if (state.unreadCount > 0) {
            state.unreadCount -= 1;
        }
      })
      .addCase(markChatAllRead.fulfilled, (state, action) => {
        // After marking all as read, also mark local messages as read for this chat
        state.unreadCount = 0;
        const { chatId } = action.payload || {};
        if (chatId && state.byChatId[chatId]?.items) {
          state.byChatId[chatId].items = state.byChatId[chatId].items.map((m) => ({
            ...m,
            is_read: true,
          }));
        }
      });
  },
});

export const { addMessage, markAllMessagesReadLocal } = messagesSlice.actions;

export const selectUnreadCount = (state) => state.messages.unreadCount;
export const selectMessagesForChat = (chatId) => (state) =>
  state.messages.byChatId[chatId]?.items || [];
export const selectMessagesLoading = (chatId) => (state) =>
  state.messages.byChatId[chatId]?.loading || false;

export default messagesSlice.reducer;