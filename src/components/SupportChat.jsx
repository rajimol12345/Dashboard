import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaUserCircle, FaPaperPlane, FaSearch, FaHeadset } from 'react-icons/fa';
import './SupportChat.css';

const socket = io('http://localhost:5000');

const SupportChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Admin ID - can be hardcoded or from Auth
  const adminId = "admin_master";

  useEffect(() => {
    // Join admin room
    socket.emit('join_admin');

    // Fetch initial conversations
    fetchConversations();

    // Listen for new messages (discovery)
    socket.on('new_admin_message', (data) => {
      // Refresh list to get new user details
      fetchConversations();
    });

    // Listen for incoming messages in selected chat
    socket.on('receive_message', (data) => {
      if (selectedUser?.userId === data.senderId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('new_admin_message');
      socket.off('receive_message');
    };
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchChatHistory(selectedUser.userId);
      socket.emit('join_chat', selectedUser.userId); // Admin joins the user's private room to reply
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/messages/conversations');
      setConversations(res.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchChatHistory = async (userId) => {
    try {
      const res = await axios.get(`/api/messages/history/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;

    const msgData = {
      senderId: adminId,
      receiverId: selectedUser.userId,
      message: input,
      role: 'admin'
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, { ...msgData, timestamp: new Date().toISOString() }]);
    setInput('');
  };

  const filteredConversations = conversations.filter(conv => 
    (conv.fullname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.userId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="support-chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3><FaHeadset /> Support</h3>
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="conversation-list">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div 
                key={conv.userId} 
                className={`conversation-item ${selectedUser?.userId === conv.userId ? 'active' : ''}`}
                onClick={() => setSelectedUser(conv)}
              >
                <div className="user-avatar">
                  {conv.profilePic ? (
                    <img src={conv.profilePic} alt={conv.fullname} className="avatar-img" />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>
                <div className="user-info">
                  <span className="username">{conv.fullname}</span>
                  <span className="last-msg">Click to view chat</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-conv">No conversations found</div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="active-user-info">
                <div className="user-icon">
                  {selectedUser.profilePic ? (
                    <img src={selectedUser.profilePic} alt={selectedUser.fullname} className="avatar-img-header" />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>
                <div>
                  <h4>{selectedUser.fullname}</h4>
                  <span className="status">Active Chat</span>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message-wrapper ${msg.role}`}>
                  <div className="message-content">
                    <p>{msg.message}</p>
                    <span className="msg-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type a reply..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={!input.trim()}>
                <FaPaperPlane />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <FaHeadset className="large-icon" />
            <h3>Customer Support Dashboard</h3>
            <p>Select a user from the left to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;
