"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const ContactList = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getConversations();
      // setConversations(response.data);
      
      // Simulate API delay
      setTimeout(() => {
        setConversations([]); // Empty for now
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px 20px', textAlign: 'center' }}>
        <i className="la la-spinner la-spin" style={{ fontSize: '30px', color: '#1967d2' }}></i>
        <p style={{ marginTop: '10px', color: '#696969', fontSize: '14px' }}>
          Loading conversations...
        </p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        background: '#f8fafb',
        borderRadius: '8px',
        margin: '0 10px'
      }}>
        <i className="la la-comments" style={{ 
          fontSize: '48px', 
          color: '#d4d4d4',
          marginBottom: '15px'
        }}></i>
        <h5 style={{ 
          fontSize: '16px',
          fontWeight: '600',
          color: '#202124',
          marginBottom: '8px'
        }}>
          No Conversations Yet
        </h5>
        <p style={{ 
          fontSize: '13px', 
          color: '#696969',
          lineHeight: '1.6'
        }}>
          Your messages with employers will appear here
        </p>
      </div>
    );
  }

  return (
    <ul className="contacts" style={{ 
      listStyle: 'none', 
      padding: 0,
      margin: 0,
      maxHeight: '500px',
      overflowY: 'auto'
    }}>
      {conversations.map((conversation) => (
        <li 
          key={conversation.id}
          onClick={() => setSelectedConversation(conversation.id)}
          style={{
            padding: '15px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            background: selectedConversation === conversation.id ? '#f0f5ff' : 'transparent',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => {
            if (selectedConversation !== conversation.id) {
              e.currentTarget.style.background = '#f8f8f8';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedConversation !== conversation.id) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Image
                src={conversation.avatar || "/images/resource/company-logo/1-1.png"}
                alt={conversation.name}
                width={45}
                height={45}
                style={{ borderRadius: '50%' }}
              />
              {conversation.online && (
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  background: '#52c41a',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}></span>
              )}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h6 style={{ 
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#202124'
                }}>
                  {conversation.name}
                </h6>
                <span style={{ 
                  fontSize: '11px', 
                  color: '#969696'
                }}>
                  {conversation.time}
                </span>
              </div>
              
              <p style={{ 
                margin: 0,
                fontSize: '13px',
                color: '#696969',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {conversation.lastMessage}
              </p>
              
              {conversation.unread > 0 && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '2px 6px',
                  background: '#1967d2',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {conversation.unread} new
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
