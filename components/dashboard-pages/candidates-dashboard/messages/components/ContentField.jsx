"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const ContentField = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      // TODO: Implement send message API
      // await sendMessage({ conversation_id: selectedConversation, message: newMessage });
      
      // For now, just show a toast
      toast.info("Messaging feature coming soon!");
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Handle file upload
      toast.info("File attachments coming soon!");
    }
  };

  // Empty state - no conversation selected
  if (!selectedConversation) {
    return (
      <div className="message-content" style={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)',
        borderRadius: '12px',
        textAlign: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, #1967d2 0%, #4a90e2 100%)',
          borderRadius: '50%',
          opacity: '0.05'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
          borderRadius: '50%',
          opacity: '0.05'
        }}></div>

        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #1967d2 0%, #4a90e2 100%)',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(25, 103, 210, 0.2)',
          transform: 'rotate(-5deg)',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <i className="la la-comments" style={{ 
            fontSize: '50px', 
            color: 'white',
            transform: 'rotate(5deg)'
          }}></i>
        </div>
        
        <h3 style={{ 
          fontSize: '28px',
          fontWeight: '700',
          color: '#202124',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #1967d2 0%, #4a90e2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to Messages
        </h3>
        
        <p style={{ 
          fontSize: '16px',
          color: '#696969',
          maxWidth: '450px',
          lineHeight: '1.6',
          marginBottom: '35px'
        }}>
          Connect with employers directly through our secure messaging system. 
          Start applying to jobs to begin conversations with potential employers.
        </p>

        <div style={{
          padding: '25px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          maxWidth: '500px',
          width: '100%',
          marginBottom: '30px'
        }}>
          <h5 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#202124',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="la la-lightbulb" style={{ color: 'white', fontSize: '16px' }}></i>
            </span>
            Quick Tips:
          </h5>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ 
              padding: '12px 0',
              fontSize: '14px',
              color: '#555',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <i className="la la-check-circle" style={{ 
                color: '#52c41a', 
                fontSize: '18px',
                marginTop: '1px' 
              }}></i>
              <span>
                <strong style={{ color: '#202124' }}>Respond quickly</strong> - 
                Reply to messages within 24 hours for best results
              </span>
            </li>
            <li style={{ 
              padding: '12px 0',
              fontSize: '14px',
              color: '#555',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <i className="la la-check-circle" style={{ 
                color: '#52c41a', 
                fontSize: '18px',
                marginTop: '1px' 
              }}></i>
              <span>
                <strong style={{ color: '#202124' }}>Stay professional</strong> - 
                Keep your messages clear, concise and courteous
              </span>
            </li>
            <li style={{ 
              padding: '12px 0',
              fontSize: '14px',
              color: '#555',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <i className="la la-check-circle" style={{ 
                color: '#52c41a', 
                fontSize: '18px',
                marginTop: '1px' 
              }}></i>
              <span>
                <strong style={{ color: '#202124' }}>Share documents</strong> - 
                Attach your CV or portfolio when requested
              </span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            className="theme-btn btn-style-one"
            onClick={() => window.location.href = '/job-list-v1'}
            style={{
              padding: '14px 30px',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(25, 103, 210, 0.25)'
            }}
          >
            <i className="la la-briefcase"></i> 
            Browse Jobs
          </button>
          
          <button 
            style={{
              padding: '14px 30px',
              background: 'white',
              border: '2px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              color: '#696969',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1967d2';
              e.currentTarget.style.color = '#1967d2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e8e8e8';
              e.currentTarget.style.color = '#696969';
            }}
            onClick={() => window.location.href = '/candidates-dashboard/cv-manager'}
          >
            <i className="la la-file-text"></i> 
            Update CV
          </button>
        </div>

        {/* Add animation keyframes */}
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(-5deg); }
            100% { transform: translateY(0px) rotate(-5deg); }
          }
        `}</style>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="message-content" style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 20px',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              border: '3px solid #f0f0f0',
              borderTop: '3px solid #1967d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
          <p style={{ color: '#696969', fontSize: '15px' }}>Loading messages...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="message-content" style={{
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}>
      {/* Message Header */}
      <div style={{
        padding: '20px 25px',
        borderBottom: '1px solid #e8e8e8',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <Image
                src="/images/resource/company-logo/1-1.png"
                alt="Company"
                width={45}
                height={45}
                style={{ 
                  borderRadius: '50%',
                  border: '2px solid #e8e8e8'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '12px',
                height: '12px',
                background: '#52c41a',
                borderRadius: '50%',
                border: '2px solid white'
              }}></span>
            </div>
            <div>
              <h5 style={{ 
                margin: 0, 
                fontSize: '17px', 
                fontWeight: '600',
                color: '#202124'
              }}>
                Company Name
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#52c41a',
                  fontWeight: '500'
                }}>
                  Active now
                </p>
                {typing && (
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#696969',
                    fontStyle: 'italic'
                  }}>
                    • typing...
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              title="Voice Call"
              style={{
                width: '36px',
                height: '36px',
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f5ff';
                e.currentTarget.style.borderColor = '#1967d2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
            >
              <i className="la la-phone" style={{ fontSize: '18px', color: '#696969' }}></i>
            </button>
            <button 
              title="Video Call"
              style={{
                width: '36px',
                height: '36px',
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f5ff';
                e.currentTarget.style.borderColor = '#1967d2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
            >
              <i className="la la-video" style={{ fontSize: '18px', color: '#696969' }}></i>
            </button>
            <button 
              title="More Options"
              style={{
                width: '36px',
                height: '36px',
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f5ff';
                e.currentTarget.style.borderColor = '#1967d2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
            >
              <i className="la la-ellipsis-v" style={{ fontSize: '18px', color: '#696969' }}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '25px',
        background: '#fafbfc'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="la la-comments-o" style={{ 
                fontSize: '40px', 
                color: '#c4c4c4'
              }}></i>
            </div>
            <p style={{
              fontSize: '15px',
              color: '#696969'
            }}>
              No messages yet. Start the conversation!
            </p>
            <p style={{
              fontSize: '13px',
              color: '#969696',
              marginTop: '8px'
            }}>
              Send a message to begin chatting
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  animation: 'messageSlide 0.3s ease-out'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '14px 18px',
                  background: message.sender === 'me' 
                    ? 'linear-gradient(135deg, #1967d2 0%, #4a90e2 100%)' 
                    : 'white',
                  color: message.sender === 'me' ? 'white' : '#202124',
                  borderRadius: '18px',
                  borderTopLeftRadius: message.sender === 'me' ? '18px' : '4px',
                  borderTopRightRadius: message.sender === 'me' ? '4px' : '18px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {message.text}
                  </p>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: '8px'
                  }}>
                    <span style={{ 
                      fontSize: '11px', 
                      opacity: message.sender === 'me' ? 0.9 : 0.6
                    }}>
                      {message.time}
                    </span>
                    {message.sender === 'me' && (
                      <i className="la la-check-double" style={{ 
                        fontSize: '14px',
                        color: message.read ? '#4ade80' : 'rgba(255,255,255,0.7)'
                      }}></i>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '20px 25px',
        borderTop: '1px solid #e8e8e8',
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleFileAttachment}
              title="Attach File"
              style={{
                width: '40px',
                height: '40px',
                background: '#f8fafb',
                border: '1px solid #e8e8e8',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f5ff';
                e.currentTarget.style.borderColor = '#1967d2';
                e.currentTarget.querySelector('i').style.color = '#1967d2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafb';
                e.currentTarget.style.borderColor = '#e8e8e8';
                e.currentTarget.querySelector('i').style.color = '#696969';
              }}
            >
              <i className="la la-paperclip" style={{ 
                fontSize: '20px', 
                color: '#696969',
                transition: 'color 0.3s'
              }}></i>
            </button>

            <button
              type="button"
              title="Add Emoji"
              style={{
                width: '40px',
                height: '40px',
                background: '#f8fafb',
                border: '1px solid #e8e8e8',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff8e1';
                e.currentTarget.style.borderColor = '#ffc107';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafb';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
              onClick={() => toast.info("Emoji picker coming soon!")}
            >
              <i className="la la-smile" style={{ 
                fontSize: '20px', 
                color: '#696969'
              }}></i>
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          />
          
          <div style={{ 
            flex: 1,
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                paddingRight: '120px',
                border: '2px solid #e8e8e8',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                background: '#f8fafb',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1967d2';
                e.target.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e8e8e8';
                e.target.style.background = '#f8fafb';
              }}
            />
            
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 20px',
                background: newMessage.trim() 
                  ? 'linear-gradient(135deg, #1967d2 0%, #4a90e2 100%)'
                  : '#e8e8e8',
                color: newMessage.trim() ? 'white' : '#969696',
                border: 'none',
                borderRadius: '20px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s',
                boxShadow: newMessage.trim() ? '0 2px 8px rgba(25, 103, 210, 0.25)' : 'none'
              }}
            >
              {sending ? (
                <i className="la la-spinner la-spin" style={{ fontSize: '16px' }}></i>
              ) : (
                <i className="la la-send" style={{ fontSize: '16px' }}></i>
              )}
              Send
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ContentField;
