import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../../../services/messageService';

export const ChatArea = ({ token, channel }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (token && channel) {
            loadMessages();
        } else {
            setMessages([]);
        }
    }, [token, channel]);

    // Scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadMessages = async () => {
        try {
            const response = await getMessages(token, channel._id);
            if (response.ok) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            const response = await sendMessage(token, channel._id, newMessage);
            if (response.ok) {
                setNewMessage('');
                loadMessages();
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!channel) {
        return (
            <div className="chat-area" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--slack-text-secondary)' }}>
                <h2>Selecciona un canal para empezar a chatear</h2>
            </div>
        );
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                #{channel.nombre}
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className="message">
                        <div className="message-avatar">
                            {msg.autor_id?.nombre ? msg.autor_id.nombre.substring(0, 1).toUpperCase() : '?'}
                        </div>
                        <div className="message-content">
                            <div className="message-header">
                                <span className="message-author">{msg.autor_id?.nombre || 'Usuario Desconocido'}</span>
                                <span className="message-time">{formatTime(msg.fecha_creacion)}</span>
                            </div>
                            <div className="message-text">
                                {msg.contenido}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <div className="chat-input-box">
                    <textarea 
                        placeholder={`Enviar mensaje a #${channel.nombre}`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="chat-input-toolbar">
                        <span></span>
                        <button className="send-btn" onClick={handleSend} disabled={!newMessage.trim()}>
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
