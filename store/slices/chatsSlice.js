import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listChats,
  createChat as apiCreateChat,
  archiveChat as apiArchiveChat,
} from "@/services/chatService";

export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await listChats(params);
      // The API returns an object with a 'results' array or just an array
      return Array.isArray(data) ? data : data?.results || [];
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to fetch chats");
    }
  }
);

export const createChat = createAsyncThunk(
  "chats/createChat",
  async ({ employer, cleaner }, { rejectWithValue }) => {
    try {
      const { data } = await apiCreateChat({ employer, cleaner });
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to create chat");
    }
  }
);

export const archiveChat = createAsyncThunk(
  "chats/archiveChat",
  async ({ chatId, reason = "" }, { rejectWithValue }) => {
    try {
      await apiArchiveChat(chatId, reason);
      // Return the chatId to identify which chat was archived
      return { chatId };
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to archive chat");
    }
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentChatId: null,
  },
  reducers: {
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setChatUnread: (state, action) => {
      const { chatId, unread } = action.payload || {};
      const chat = (state.items || []).find((c) => String(c.id) === String(chatId));
      if (chat) {
        chat.unread_messages_count = typeof unread === 'number' ? unread : 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const newChat = action.payload;
        // Avoid duplicates if the chat already exists in the state
        if (!state.items.find((chat) => chat.id === newChat.id)) {
          state.items.unshift(newChat);
        }
        // Automatically select the newly created chat
        state.currentChatId = newChat.id;
      })
      .addCase(archiveChat.fulfilled, (state, action) => {
        const { chatId } = action.payload;
        // Find the chat and update its status instead of removing it
        const chat = state.items.find((c) => String(c.id) === String(chatId));
        if (chat) {
          chat.is_active = false;
          chat.archived = true; // Assuming a field to indicate this
        }
      });
  },
});

export const { setCurrentChatId, setChatUnread } = chatsSlice.actions;

export const selectAllChats = (state) => state.chats.items;
export const selectChatsLoading = (state) => state.chats.loading;
export const selectCurrentChatId = (state) => state.chats.currentChatId;
export const selectChatById = (state, id) =>
  (state.chats.items || []).find((c) => String(c.id) === String(id));
export const selectCurrentChat = (state) => {
  const currentId = selectCurrentChatId(state);
  if (!currentId) return null;
  return selectChatById(state, currentId);
};

export default chatsSlice.reducer;