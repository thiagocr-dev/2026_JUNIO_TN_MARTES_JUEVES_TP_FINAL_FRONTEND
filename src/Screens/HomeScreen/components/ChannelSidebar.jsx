import React, { useState, useEffect } from 'react';
import { getChannels, createChannel } from '../../../services/channelService';

export const ChannelSidebar = ({ token, workspace, onSelectChannel, activeChannelId, refreshKey }) => {
    const [channels, setChannels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (token && workspace) {
            loadChannels();
        } else {
            setChannels([]);
        }
    }, [token, workspace, refreshKey]);

    const loadChannels = async () => {
        try {
            const response = await getChannels(token, workspace._id);
            if (response.ok) {
                setChannels(response.data);
                if (response.data.length > 0 && !activeChannelId) {
                    onSelectChannel(response.data[0]);
                }
            }
        } catch (error) {
            console.error('Error al cargar canales:', error);
        }
    };

    const handleCreate = async () => {
        if (!newChannelName.trim() || isCreating) return;
        setIsCreating(true);
        try {
            const response = await createChannel(token, workspace._id, newChannelName);
            if (response.ok) {
                setNewChannelName('');
                setIsModalOpen(false);
                await loadChannels();
                onSelectChannel(response.data);
            }
        } catch (error) {
            console.error('Error al crear canal', error);
        } finally {
            setIsCreating(false);
        }
    };

    const workspaceName = workspace?.nombre ?? 'Sin workspace';

    return (
        <div className="channel-sidebar">
            {/* ── Header ─── */}
            <div className="cs-header">
                <div className="cs-header-top">
                    <div className="cs-workspace-name">
                        {workspaceName} <span>▾</span>
                    </div>
                    <div className="cs-header-icons">
                        <button className="cs-icon-btn" title="Configuración">⚙</button>
                        <button className="cs-icon-btn" title="Redactar">✏</button>
                    </div>
                </div>
                {workspace && (
                    <button className="cs-plan-btn">
                        <span>🚀</span> Cambiar de plan
                    </button>
                )}
            </div>

            {/* ── Search ─── */}
            <div className="cs-search-wrap">
                <input type="text" placeholder="Buscar una conversación..." />
            </div>

            {/* ── Static Nav Items ─── */}
            <div className="cs-nav-items">
                <div className="cs-nav-item">
                    <span className="cs-nav-icon">🎉</span>
                    Juntas
                </div>
                <div className="cs-nav-item">
                    <span className="cs-nav-icon">⊞</span>
                    Directorios
                </div>
            </div>

            {/* ── Scrollable content ─── */}
            <div className="cs-scrollable">
                {/* Favoritos */}
                <div className="cs-section">
                    <div className="cs-section-header">
                        <span>☆ Favoritos</span>
                    </div>
                    <div className="cs-section-note">
                        Arrastrar y soltar información importante aquí
                    </div>
                </div>

                {/* Canales (real data) */}
                {workspace && (
                    <div className="cs-section">
                        <div className="cs-section-header">
                            <span>⊞ Canales</span>
                            <button
                                className="cs-add-btn"
                                onClick={() => setIsModalOpen(true)}
                                title="Agregar canal"
                            >+</button>
                        </div>
                        {channels.map((channel) => (
                            <div
                                key={channel._id}
                                className={`cs-channel-item ${activeChannelId === channel._id ? 'active' : ''}`}
                                onClick={() => onSelectChannel(channel)}
                            >
                                <span className="hash">#</span>
                                {channel.nombre}
                            </div>
                        ))}
                        {channels.length === 0 && (
                            <div className="cs-section-note">
                                Aún no hay canales. Crea uno con +
                            </div>
                        )}
                    </div>
                )}

                {/* Mensajes directos (static) */}
                <div className="cs-section">
                    <div className="cs-section-header">
                        <span>💬 Mensajes directos</span>
                        <button className="cs-add-btn" title="Nuevo DM">+</button>
                    </div>
                </div>

                {/* Aplicaciones (static) */}
                <div className="cs-section">
                    <div className="cs-section-header">
                        <span>⊞ Aplicaciones</span>
                    </div>
                    <div className="cs-channel-item">
                        <span style={{ fontSize: 14 }}>🤖</span> Slackbot
                    </div>
                    <div className="cs-channel-item">
                        <span style={{ fontSize: 14 }}>💼</span> Slack
                    </div>
                </div>
            </div>

            {/* ── Footer ─── */}
            <div className="cs-footer">
                <div className="cs-footer-note">
                    <strong>Slack</strong> funciona mejor cuando lo usas en conjunto.
                </div>
                <button className="cs-invite-btn">
                    👤 Invitar a compañeros de equipo
                </button>
            </div>

            {/* ── Create Channel Modal ─── */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear Canal</h2>
                        <input
                            type="text"
                            placeholder="nombre-del-canal"
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)} disabled={isCreating}>Cancelar</button>
                            <button onClick={handleCreate} className="send-btn" disabled={isCreating}>
                                {isCreating ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
