"use client";

import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Find Cleaner AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-popup for new visitors after 30 seconds
  useEffect(() => {
    // Check if user has visited before
    const hasVisitedBefore = localStorage.getItem("chatbot_visited");
    
    if (!hasVisitedBefore && !hasAutoOpened) {
      // Set timer for 30 seconds (30000ms) for first-time visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
        
        // Mark that user has visited (set after popup)
        localStorage.setItem("chatbot_visited", "true");
      }, 30000); // 30 seconds (change to 5000 for testing)

      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    const currentInput = inputValue;
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call the Next.js API route that connects to OpenAI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botResponse = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to simple responses if API fails
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(currentInput),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Temporary response logic - replace with actual AI API call
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("clean") || input.includes("service")) {
      return "We offer various cleaning services including house cleaning, deep cleaning, commercial cleaning, and end-of-tenancy cleaning. What type of cleaning are you interested in?";
    } else if (input.includes("price") || input.includes("cost")) {
      return "Pricing varies based on the type of service, property size, and location. Would you like to browse our cleaners to see their rates?";
    } else if (input.includes("book") || input.includes("hire")) {
      return "Great! You can browse verified cleaners on our platform, check their reviews, and book directly. Would you like me to guide you through the booking process?";
    } else if (input.includes("course") || input.includes("training")) {
      return "We offer professional cleaning courses ranging from £11.99 to £14.99. Topics include house cleaning basics, commercial cleaning, and building your cleaning business. Interested in learning more?";
    } else if (input.includes("hello") || input.includes("hi")) {
      return "Hello! How can I assist you with your cleaning needs today?";
    } else {
      return "I'm here to help with information about our cleaning services, booking cleaners, training courses, and more. What would you like to know?";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { text: "Find a cleaner", icon: "la-search" },
    { text: "Book service", icon: "la-calendar" },
    { text: "View courses", icon: "la-graduation-cap" },
    { text: "Pricing info", icon: "la-tag" }
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="header-content">
              <div className="bot-avatar">
                <i className="la la-robot"></i>
              </div>
              <div className="header-text">
                <h4>Find Cleaner AI</h4>
                <span className="status">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <button className="minimize-btn" onClick={() => setIsOpen(false)}>
              <i className="la la-minus"></i>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.sender === 'bot' && (
                  <div className="message-avatar">
                    <i className="la la-robot"></i>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <i className="la la-robot"></i>
                </div>
                <div className="message-content">
                  <div className="message-bubble typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.text)}
                >
                  <i className={`la ${action.icon}`}></i>
                  {action.text}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" disabled={!inputValue.trim()}>
              <i className="la la-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* Chat Toggle Button - placed AFTER chat window in DOM */}
      <div 
        className={`chat-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          // Close icon has its own handler and stops propagation to avoid double-toggle
          <i
            className="la la-times"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          ></i>
        ) : (
          <>
            <i className="la la-comments"></i>
            <span className="pulse-ring"></span>
          </>
        )}
      </div>

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2aa389 0%, #1e8c73 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          /* ensure the toggle is clickable even if other elements overlap */
          pointer-events: auto;
          box-shadow: 0 4px 20px rgba(42, 163, 137, 0.4);
          z-index: 10000;
          transition: all 0.3s ease;
        }

        .chat-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(42, 163, 137, 0.5);
        }

        .chat-toggle i {
          font-size: 28px;
          color: white;
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid #2aa389;
          animation: pulse 2s infinite;
          /* ring shouldn't intercept clicks on the icon */
          pointer-events: none;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 9998;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .chat-header {
          background: linear-gradient(135deg, #2aa389 0%, #1e8c73 100%);
          padding: 20px;
          border-radius: 16px 16px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bot-avatar i {
          font-size: 24px;
          color: white;
        }

        .header-text h4 {
          margin: 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .minimize-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .minimize-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .minimize-btn i {
          color: white;
          font-size: 18px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #d1d7dc;
          border-radius: 3px;
        }

        .message {
          display: flex;
          margin-bottom: 16px;
          gap: 10px;
        }

        .user-message {
          justify-content: flex-end;
        }

        .message-avatar {
          width: 35px;
          height: 35px;
          background: #e8ecec;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-avatar i {
          font-size: 18px;
          color: #2aa389;
        }

        .message-content {
          max-width: 70%;
        }

        .user-message .message-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        .bot-message .message-bubble {
          background: white;
          color: #1c1d1f;
          border-bottom-left-radius: 4px;
        }

        .user-message .message-bubble {
          background: #2aa389;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-time {
          font-size: 11px;
          color: #6a6f73;
          margin-top: 4px;
          display: block;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #6a6f73;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 15px 20px;
          background: white;
          border-top: 1px solid #e8ecec;
        }

        .quick-action-btn {
          padding: 10px;
          background: #f8f9fa;
          border: 1px solid #e8ecec;
          border-radius: 8px;
          font-size: 13px;
          color: #1c1d1f;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .quick-action-btn:hover {
          background: #2aa389;
          color: white;
          border-color: #2aa389;
        }

        .quick-action-btn i {
          font-size: 16px;
        }

        .chat-input {
          display: flex;
          padding: 15px 20px;
          background: white;
          border-top: 1px solid #e8ecec;
          border-radius: 0 0 16px 16px;
        }

        .chat-input input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e8ecec;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .chat-input input:focus {
          border-color: #2aa389;
        }

        .chat-input button {
          width: 45px;
          height: 45px;
          background: #2aa389;
          border: none;
          border-radius: 50%;
          margin-left: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .chat-input button:hover:not(:disabled) {
          background: #1e8c73;
          transform: scale(1.05);
        }

        .chat-input button:disabled {
          background: #d1d7dc;
          cursor: not-allowed;
        }

        .chat-input button i {
          font-size: 18px;
          color: white;
        }

        @media (max-width: 767px) {
          .chat-window {
            width: calc(100% - 40px);
            height: calc(100vh - 140px);
            right: 20px;
            bottom: 90px;
          }

          .chat-toggle {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
