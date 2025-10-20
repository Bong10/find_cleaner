# Messaging System Implementation TODO

## ✅ Already Implemented
- [x] Basic chat and message services (chatService.js, messagesService.js)
- [x] Redux slices for state management (chatsSlice.js, messagesSlice.js)
- [x] Basic UI components (ContactList, ContentField)
- [x] JWT authentication with axios interceptors
- [x] 5-second polling for messages
- [x] Mark all read when opening chat

## 📋 Phase 1: Core Booking Integration (Priority 1)

### 1.1 Booking-Chat Integration
- [ ] Add chat creation/reactivation to booking flow
- [ ] Update booking service to handle chat lifecycle
- [ ] Add chat ID to booking response
- [ ] Auto-navigate to chat after booking confirmation

### 1.2 Chat Lifecycle Management
- [ ] Handle chat archiving when job completes
- [ ] Show archived status clearly in UI
- [ ] Prevent message sending to archived chats (UI validation)
- [ ] Add reactivation logic for new bookings with same pair

## 📋 Phase 2: Enhanced Messaging Features (Priority 2)

### 2.1 Message Status & Delivery
- [ ] Add message status indicators (sending, sent, failed)
- [ ] Implement retry mechanism for failed messages
- [ ] Add optimistic UI updates for better UX
- [ ] Handle network errors gracefully

### 2.2 Real-time Updates
- [ ] Improve polling efficiency (smart polling based on activity)
- [ ] Add focus/blur event handlers to pause/resume polling
- [ ] Update unread counts in real-time
- [ ] Add browser notification support

### 2.3 UI/UX Improvements
- [ ] Add typing indicators (local state for now)
- [ ] Add message timestamps with proper formatting
- [ ] Add "New Message" divider for unread messages
- [ ] Add scroll-to-bottom button when new messages arrive
- [ ] Add empty state illustrations

## 📋 Phase 3: Moderation & Safety (Priority 3)

### 3.1 Flag Chat Feature
- [ ] Add "Report Chat" button in message header
- [ ] Create flag dialog with reason selection
- [ ] Integrate with flagChat API
- [ ] Show flagged status in UI

### 3.2 Admin Moderation Panel
- [ ] Create admin view for flagged chats
- [ ] Add resolution interface
- [ ] Add chat history viewer for moderation

## 📋 Phase 4: Advanced Features (Priority 4)

### 4.1 Search & Filter
- [ ] Add chat search by participant name
- [ ] Add filter for active/archived chats
- [ ] Add message search within chat

### 4.2 Rich Media Support
- [ ] Add image upload capability
- [ ] Add file attachment support
- [ ] Add image preview in messages
- [ ] Add download functionality

### 4.3 Notifications
- [ ] Add sound notifications (with user preference)
- [ ] Add desktop push notifications
- [ ] Add notification preferences settings

## 📋 Phase 5: Candidate Dashboard (Priority 5)

### 5.1 Shared Components
- [ ] Create shared message components
- [ ] Add role-based rendering logic
- [ ] Ensure consistent experience across dashboards

## 🔧 Technical Debt & Optimization

### Performance
- [ ] Implement message pagination
- [ ] Add virtual scrolling for long message lists
- [ ] Optimize re-renders with React.memo
- [ ] Add message caching

### Testing
- [ ] Add unit tests for services
- [ ] Add integration tests for Redux slices
- [ ] Add component tests
- [ ] Add E2E tests for critical flows

### Documentation
- [ ] Document API integration points
- [ ] Create component usage guide
- [ ] Add JSDoc comments
- [ ] Create troubleshooting guide

## 🚀 Future Enhancements (Post-MVP)

- [ ] WebSocket integration for real-time messaging
- [ ] Voice messages
- [ ] Video chat integration
- [ ] Message reactions/emojis
- [ ] Message editing/deletion
- [ ] Group chats for multi-cleaner bookings
- [ ] Chat export/download feature
- [ ] AI-powered inappropriate content detection
