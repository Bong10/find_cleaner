import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications as apiFetchNotifications,
  fetchUnreadNotificationCount as apiFetchUnreadCount,
  markNotificationAsRead as apiMarkNotificationAsRead,
  markAllNotificationsAsRead as apiMarkAllAsRead,
} from "@/services/notificationsService";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiFetchNotifications(params);
      const rawItems = Array.isArray(data) ? data : data?.results || [];

      // Normalize various backend field shapes to a consistent UI shape
      const normalize = (n) => {
        const id = n?.id ?? n?.pk ?? n?.uuid ?? n?.notification_id;
        const created_at = n?.created_at || n?.createdAt || n?.timestamp || n?.time || n?.date || null;
        const is_read =
          typeof n?.is_read !== "undefined"
            ? !!n.is_read
            : typeof n?.read !== "undefined"
            ? !!n.read
            : typeof n?.unread !== "undefined"
            ? !n.unread
            : false;

    const typeRaw = n?.category || n?.type || n?.kind || n?.verb || "Alert";
    const lower = String(typeRaw).toLowerCase();
    let categoryTitle = "Alert";
    if (/(message|chat)/i.test(lower)) categoryTitle = "Message";
    else if (/job/i.test(lower)) categoryTitle = "Job";
    else if (/book|booking|reservation/i.test(lower)) categoryTitle = "Booking";
    else if (/alert|notification/i.test(lower)) categoryTitle = "Alert";

        // Attempt to extract actor name
        let actorName =
          n?.actor_name ||
          n?.actor?.name ||
          n?.sender_name ||
          n?.sender?.full_name ||
          n?.sender?.name ||
          n?.user?.full_name ||
          n?.user?.name ||
          n?.from_user ||
          n?.source_name ||
          null;
        if (!actorName && typeof n?.verb === "string") {
          const m = n.verb.match(/^(.*?)\s+sent you a message/i);
          if (m && m[1]) actorName = m[1].trim();
        }

        // Target title for jobs, etc.
        const targetTitle =
          n?.target_title ||
          n?.job_title ||
          n?.job?.title ||
          n?.chat?.title ||
          n?.object_title ||
          null;

        // Build target info (booking/job/chat)
        const target =
          n?.target || {
            type:
              n?.target_type ||
              n?.resource_type ||
              (n?.booking_id ? "booking" : n?.job_id ? "job" : n?.chat_id ? "chat" : n?.target_type) ||
              null,
            id:
              n?.target_id ||
              n?.resource_id ||
              n?.booking_id ||
              n?.booking?.id ||
              n?.job_id ||
              n?.chat_id ||
              null,
          };

        // If backend mislabeled but target implies a clear type, override
        const targetTypeLower = (target?.type || "").toLowerCase();
        if (targetTypeLower === "booking" && categoryTitle !== "Booking") {
          categoryTitle = "Booking";
        } else if (targetTypeLower === "chat" && categoryTitle !== "Message") {
          categoryTitle = "Message";
        } else if (targetTypeLower === "job" && categoryTitle !== "Job") {
          categoryTitle = "Job";
        }

        // If message-specific, capture messageId for deep-linking
        const messageId = n?.message_id || n?.message?.id || n?.object_id || null;

        // Derive a friendly booking-focused title when needed
        const statusField = (
          n?.booking_status || n?.status || n?.status_code || n?.booking?.status || n?.extra?.status || ""
        )
          .toString()
          .toLowerCase();
        const eventField = (n?.event || n?.action || n?.verb || typeRaw || "")
          .toString()
          .toLowerCase();
        const paid = !!(
          n?.paid ||
          n?.payment_status === "paid" ||
          n?.booking?.paid_at ||
          /paid|payment (successful|received)/i.test(eventField)
        );
        const cleanerConfirmed = !!(
          n?.cleaner_confirmed || statusField === "cf" || /cleaner (confirmed|accepted)|accepted/i.test(eventField)
        );
        const completed = !!(statusField === "cp" || /completed|finished/i.test(eventField));
        const declined = !!(statusField === "rj" || /rejected|declined/i.test(eventField));
        const cancelled = !!(/cancelled|canceled|cancel/i.test(eventField) || statusField === "canceled");
        const created = !!(/created|booked|requested/i.test(eventField));
        const rescheduled = !!(/rescheduled|reschedule|time change|updated/i.test(eventField));

        // Consolidated text for heuristics
        const combinedText = [n?.title, n?.subject, n?.heading, n?.message, n?.body, n?.content, typeRaw]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        // Strengthen booking detection using text even if typeRaw was 'alert' or target was 'job'
        const looksBookingText = /\b(book|booking|reservation|confirmed|payment received|paid)\b/i.test(combinedText);
        if (looksBookingText && categoryTitle !== "Message") {
          categoryTitle = "Booking";
        }
        const typeFinal = categoryTitle;
        const categoryFinal = typeFinal.toLowerCase();

        let title = n?.title || n?.subject || n?.heading || n?.message_title || null;
        if (!title) {
          if (typeFinal === "Message") {
            title = "New message";
          } else if (typeFinal === "Job") {
            title = targetTitle ? `Job update: ${targetTitle}` : "Job update";
          } else if (typeFinal === "Booking") {
            if (paid) title = targetTitle ? `Payment received for ${targetTitle}` : "Payment received for booking";
            else if (cleanerConfirmed) title = targetTitle ? `Cleaner confirmed ${targetTitle}` : "Cleaner confirmed booking";
            else if (completed) title = targetTitle ? `${targetTitle} completed` : "Booking completed";
            else if (declined) title = targetTitle ? `Cleaner declined ${targetTitle}` : "Booking declined";
            else if (cancelled) title = targetTitle ? `${targetTitle} cancelled` : "Booking cancelled";
            else if (created) title = "Booking request";
            else if (rescheduled) title = targetTitle ? `Booking rescheduled: ${targetTitle}` : "Booking rescheduled";
            else title = targetTitle ? `Booking update: ${targetTitle}` : "Booking update";
          } else {
            title = "Notification";
          }
        }

        // Compose a consistent message field used by UI
        const rawMsg =
          n?.message ||
          n?.body ||
          n?.content ||
          n?.text ||
          n?.description ||
          n?.detail ||
          n?.extra?.message ||
          "";
        let message;

        if (typeFinal === "Message") {
          // Always show a consistent format for chat notifications regardless of backend text
          const snippet = (rawMsg || "").toString().trim().slice(0, 120);
          message = (actorName ? `${actorName} sent you a message` : "You have a new message") +
            (snippet ? `: ${snippet}` : "");
        } else if (typeFinal === "Booking") {
          // Prefer server message when available, otherwise craft a helpful one
          if (rawMsg) {
            message = rawMsg;
          } else if (paid) message = targetTitle ? `Payment received for "${targetTitle}".` : "Payment received for booking.";
          else if (cleanerConfirmed) message = targetTitle ? `Cleaner confirmed ${targetTitle}.` : "Cleaner confirmed your booking.";
          else if (created) message = targetTitle
            ? `${actorName || "A user"} requested to book you for '${targetTitle}'.`
            : "Booking request received.";
          else message = targetTitle ? `Update for ${targetTitle}.` : "Booking update available.";
        } else {
          message = rawMsg || "Tap to view details";
        }

        // Icon styling based on category/target
        let icon = n?.icon;
        let iconColor = n?.iconColor;
        let iconBg = n?.iconBg;
        const t = target?.type?.toLowerCase();
        if (!icon) {
          if (typeFinal.toLowerCase() === "job" || t === "job") icon = "la-briefcase";
          else if (typeFinal.toLowerCase() === "message" || t === "chat") icon = "la-comments";
          else if (typeFinal.toLowerCase() === "booking" || t === "booking") icon = "la-calendar-check";
          else icon = "la-bell";
        }
        if (!iconColor) {
          if (typeFinal.toLowerCase() === "job") iconColor = "#2e7d32";
          else if (typeFinal.toLowerCase() === "message") iconColor = "#ff9800";
          else if (typeFinal.toLowerCase() === "booking") iconColor = "#1967d2";
          else iconColor = "#1967d2";
        }
        if (!iconBg) {
          if (typeFinal.toLowerCase() === "job") iconBg = "#e8f5e9";
          else if (typeFinal.toLowerCase() === "message") iconBg = "#fff3e0";
          else if (typeFinal.toLowerCase() === "booking") iconBg = "#e8f0ff";
          else iconBg = "#f0f5ff";
        }

        return {
          id,
          title,
          message,
          category: categoryFinal, // lowercase for API-style category
          type: typeFinal,         // Title-case for UI
          typeRaw,
          created_at,
          is_read,
          target,
          actorName,
          targetTitle,
          icon,
          iconColor,
          iconBg,
          messageId,
          __raw: n,
        };
      };

      const items = rawItems.map(normalize);

      return {
        items,
        count: Number(data?.count) || (Array.isArray(data) ? data.length : rawItems.length),
        next: data?.next || null,
        previous: data?.previous || null,
      };
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to fetch notifications");
    }
  }
);

export const fetchNotificationsUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiFetchUnreadCount();
      return Number(data?.unread_count) || 0;
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to fetch unread notifications count");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await apiMarkNotificationAsRead(notificationId);
      return { notificationId };
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiMarkAllAsRead();
      return true;
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Failed to mark all notifications as read");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
    unreadCount: 0,
    next: null,
    previous: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log("[Notifications] Fetching notifications...");
        }
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.next = action.payload.next;
        state.previous = action.payload.previous;

        if (typeof window !== "undefined") {
          const items = Array.isArray(action.payload.items) ? action.payload.items : [];
          const table = items.map((n) => ({
            id: n.id,
            title: n.title,
            category: n.category,
            is_read: !!n.is_read,
            created_at: n.created_at,
            target: n?.target ? `${n.target.type || ""}:${n.target.id || ""}` : null,
          }));
          try {
            // eslint-disable-next-line no-console
            console.groupCollapsed(`[Notifications] fetched ${table.length} items`);
            // eslint-disable-next-line no-console
            console.table(table);
            // eslint-disable-next-line no-console
            console.groupEnd();
          } catch {
            // eslint-disable-next-line no-console
            console.log("[Notifications] items:", table);
          }
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.error("[Notifications] Fetch failed:", action.payload);
        }
      })
      .addCase(fetchNotificationsUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log(`[Notifications] Unread count: ${state.unreadCount}`);
        }
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload.notificationId;
        const item = state.items.find((n) => n.id === id);
        if (item) item.is_read = true;
        if (state.unreadCount > 0) state.unreadCount -= 1;
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log(`[Notifications] Marked as read: ${id}`);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, is_read: true }));
        state.unreadCount = 0;
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log('[Notifications] Marked all as read');
        }
      });
  },
});

export const selectNotifications = (state) => state.notifications.items;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsUnreadCount = (state) => state.notifications.unreadCount;

export default notificationsSlice.reducer;
