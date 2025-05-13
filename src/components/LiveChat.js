import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiUser } from 'react-icons/fi';
import { sendChatMessage } from '../services/chatService';
import '../styles/LiveChat.css';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const toggleChat = () => {
        setIsOpen(!isOpen);
        
        // When opening chat for the first time, add welcome message
        if (!isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: 'Welcome to HealthNet LiveChat! How can we assist you today?',
                    sender: 'bot',
                    timestamp: new Date()
                }
            ]);
        }
    };
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!currentMessage.trim()) return;
        
        // Add user message to chat
        const userMessage = {
            id: messages.length + 1,
            text: currentMessage,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setCurrentMessage('');
        setIsTyping(true);
        
        try {
            // Get conversation history for context
            const conversationHistory = messages.map(msg => ({
                text: msg.text,
                sender: msg.sender,
                timestamp: msg.timestamp
            }));
            
            // Call the chat service
            const response = await sendChatMessage(
                currentMessage, 
                localStorage.getItem('userId') || null,
                conversationHistory
            );
            
            // Add bot response to chat
            const botResponse = {
                id: messages.length + 2,
                text: response.message,
                sender: 'bot',
                timestamp: new Date(response.timestamp)
            };
            
            setMessages(prevMessages => [...prevMessages, botResponse]);
            setIsTyping(false);
            
        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);
            
            // Add error message
            const errorMessage = {
                id: messages.length + 2,
                text: 'Sorry, there was an error processing your request. Please try again.',
                sender: 'bot',
                timestamp: new Date()
            };
            
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
    };
    
    // Format timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <>
            {/* Floating chat button */}
            <motion.button 
                className="live-chat-button"
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <FiX /> : <FiMessageSquare />}
            </motion.button>
            
            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="live-chat-container"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="live-chat-header">
                            <h3>HealthNet Support</h3>
                            <button className="close-button" onClick={toggleChat}>
                                <FiX />
                            </button>
                        </div>
                        
                        <div className="live-chat-messages">
                            {messages.map((message, index) => (
                                <div 
                                    key={message.id} 
                                    className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                                >
                                    {message.sender === 'bot' && (
                                        <div className="message-avatar">
                                            <img src="/chat-logo.svg" alt="HealthNet" />
                                        </div>
                                    )}
                                    <div className={`message ${message.sender}`}>
                                        <div className="message-text">{message.text}</div>
                                        <div className="message-time">{formatTime(message.timestamp)}</div>
                                    </div>
                                    {message.sender === 'user' && (
                                        <div className="message-avatar user">
                                            <FiUser />
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div className="message-container bot-message">
                                    <div className="message-avatar">
                                        <img src="/chat-logo.svg" alt="HealthNet" />
                                    </div>
                                    <div className="message bot typing">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <form className="live-chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type your message here..."
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                            />
                            <button 
                                type="submit" 
                                disabled={!currentMessage.trim()}
                                className={!currentMessage.trim() ? 'disabled' : ''}
                            >
                                <FiSend />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LiveChat; 