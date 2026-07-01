import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../../../services/messageService';

export const ChatArea = ({ token, channel, userData, onOpenMembers }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatError, setChatError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (token && channel) {
            loadMessages();
            const interval = setInterval(loadMessages, 4000);
            return () => clearInterval(interval);
        } else {
            setMessages([]);
        }
    }, [token, channel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadMessages = async () => {
        try {
            const response = await getMessages(token, channel._id);
            if (response.ok) setMessages(response.data);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const text = newMessage;
        setNewMessage(''); // optimistic clear
        setChatError('');
        try {
            const response = await sendMessage(token, channel._id, text);
            if (response.ok) loadMessages();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setNewMessage(text); // restore on error
            setChatError('Error al enviar el mensaje. Intenta nuevamente.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const getAvatarColor = (name) => {
        const colors = [
            'linear-gradient(135deg,#E01E5A,#E07E2E)',
            'linear-gradient(135deg,#2EB67D,#36C5F0)',
            'linear-gradient(135deg,#ECB22E,#E01E5A)',
            'linear-gradient(135deg,#4A154B,#9B59B6)',
            'linear-gradient(135deg,#1164A3,#2EB67D)',
        ];
        const idx = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[idx];
    };

    /* ─── No channel selected ─── */
    if (!channel) {
        return (
            <div className="chat-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                    <h2 style={{ color: 'var(--text-heading)', marginBottom: 8 }}>Selecciona un canal</h2>
                    <p>Elige un canal de la barra lateral para empezar a chatear.</p>
                </div>
            </div>
        );
    }

    const hasMessages = messages.length > 0;

    return (
        <div className="chat-main">
            {/* ─── Chat Header ─── */}
            <div className="chat-header">
                <div className="chat-header-channel-name">
                    <span className="star">☆</span>
                    # {channel.nombre}
                </div>
                <div className="chat-header-spacer" />
                <div className="chat-header-actions">
                    <button className="ch-action-btn" onClick={onOpenMembers}>👤 Invitar a compañeros de equipo</button>
                    <button className="ch-icon-btn" title="Audio">🎧</button>
                    <button className="ch-icon-btn" title="Notificaciones">🔔</button>
                    <button className="ch-icon-btn" title="Buscar">🔍</button>
                    <button className="ch-icon-btn" title="Más opciones">⋮</button>
                </div>
            </div>

            {/* ─── Tabs ─── */}
            <div className="chat-tabs">
                <div className="chat-tab active">
                    <span>💬</span> Mensajes
                </div>
                <div className="chat-tab">
                    <span>🖼</span> Agregar canvas
                </div>
                <button className="chat-tab-add" title="Más">+</button>
            </div>

            {/* ─── Messages / Welcome ─── */}
            <div className="chat-messages">
                {/* Welcome banner always shown at top */}
                <div className="chat-welcome">
                    <div className="chat-welcome-inner">
                        <div className="chat-welcome-icon">📚</div>
                        <h1>Todos están aquí en # {channel.nombre}</h1>
                        <p>
                            Comparte anuncios y noticias acerca de la empresa, eventos próximos
                            o compañeros de trabajo que merecen un reconocimiento. ⭐
                        </p>
                        <div className="chat-welcome-card">
                            <span className="wc-icon">🎬</span>
                            <div className="chat-welcome-card-text">
                                <strong>Personaliza un mensaje de bienvenida</strong>
                                <span>Grabar un clip de video corto</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date separator if there are messages */}
                {hasMessages && (
                    <div className="date-separator">
                        <span>{formatDate(messages[0].fecha_creacion)} ▾</span>
                    </div>
                )}

                {/* Real messages */}
                {messages.map((msg) => (
                    <div key={msg._id} className="chat-message">
                        <div
                            className="msg-avatar"
                            style={{ background: getAvatarColor(msg.autor_id?.nombre) }}
                        >
                            {msg.autor_id?.nombre
                                ? msg.autor_id.nombre.substring(0, 1).toUpperCase()
                                : '?'}
                        </div>
                        <div className="msg-body">
                            <div className="msg-meta">
                                <span className="msg-author">{msg.autor_id?.nombre ?? 'Usuario'}</span>
                                <span className="msg-time">{formatTime(msg.fecha_creacion)}</span>
                            </div>
                            <div className="msg-text">{msg.contenido}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* ─── Input Box ─── */}
            <div className="chat-input-wrap">
                <div className="chat-input-box">
                    {/* Top formatting toolbar */}
                    <div className="input-toolbar-top">
                        <button className="input-tool-btn" title="Negrita"><b>B</b></button>
                        <button className="input-tool-btn" title="Cursiva"><i>I</i></button>
                        <button className="input-tool-btn" title="Tachado"><s>S</s></button>
                        <div className="input-tool-divider" />
                        <button className="input-tool-btn" title="Enlace">🔗</button>
                        <div className="input-tool-divider" />
                        <button className="input-tool-btn" title="Lista numerada">1.</button>
                        <button className="input-tool-btn" title="Lista">•</button>
                        <div className="input-tool-divider" />
                        <button className="input-tool-btn" title="Código">&lt;/&gt;</button>
                        <button className="input-tool-btn" title="Bloque">⬜</button>
                    </div>

                    {/* Text input */}
                    <textarea
                        className="chat-input-textarea"
                        placeholder={`Mensaje #${channel.nombre}`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    {/* Bottom toolbar */}
                    <div className="input-toolbar-bottom">
                        <button className="input-tool-bottom-btn" title="Adjuntar">+</button>
                        <button className="input-tool-bottom-btn" title="Formato de texto">Aa</button>
                        <button className="input-tool-bottom-btn" title="Emoji">😊</button>
                        <button className="input-tool-bottom-btn" title="Mencionar">@</button>
                        <button className="input-tool-bottom-btn" title="Video">🎬</button>
                        <button className="input-tool-bottom-btn" title="Más">◻</button>
                        <div className="input-bottom-spacer" />
                        <button
                            className="send-btn"
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            title="Enviar"
                        >
                            ➤
                        </button>
                    </div>
                </div>
                {chatError && <div style={{ color: '#E01E5A', fontSize: 13, marginTop: 8, paddingLeft: 8 }}>{chatError}</div>}
            </div>
        </div>
    );
};
