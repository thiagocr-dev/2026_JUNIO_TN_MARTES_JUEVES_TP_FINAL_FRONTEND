import React, { useState, useEffect } from 'react';
import { getChannels, createChannel } from '../../../services/channelService';
import { getWorkspaceMembers } from '../../../services/workspaceService';
import './ChannelSidebar.css';

export const ChannelSidebar = ({ token, workspace, onSelectChannel, activeChannelId, refreshKey, onOpenMembers }) => {
    const [channels, setChannels] = useState([]);
    const [members, setMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (token && workspace) {
            loadChannels();
            loadMembers();
        } else {
            setChannels([]);
            setMembers([]);
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

    const loadMembers = async () => {
        try {
            const response = await getWorkspaceMembers(token, workspace._id);
            if (response.ok) {
                setMembers(response.data.workspace_members_info || []);
            }
        } catch (error) {
            console.error('Error al cargar miembros:', error);
        }
    };

    const handleCreate = async () => {
        if (!newChannelName.trim() || isCreating) return;
        setIsCreating(true);
        setErrorMsg('');
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
            setErrorMsg(error.message || 'Error al crear canal.');
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
                        <button className="cs-icon-btn cs-disabled" title="Configuración (Próximamente)">⚙</button>
                        <button className="cs-icon-btn cs-disabled" title="Redactar (Próximamente)">✏</button>
                    </div>
                </div>
                {workspace && (
                    <button className="cs-plan-btn cs-disabled" title="Cambiar de plan (Próximamente)">
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
                <div className="cs-nav-item cs-disabled" title="Juntas (Próximamente)">
                    <span className="cs-nav-icon">🎉</span>
                    Juntas
                </div>
                <div className="cs-nav-item cs-disabled" title="Directorios (Próximamente)">
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

                {/* Mensajes directos / Miembros (real data) */}
                {workspace && (
                    <div className="cs-section">
                        <div className="cs-section-header">
                            <span>👤 Miembros ({members.length})</span>
                        </div>
                        {members.map((member) => (
                            <div
                                key={member.user_id}
                                className="cs-channel-item cs-member-item"
                            >
                                <span className="cs-member-status" />
                                <span>
                                    {member.user_nombre} 
                                    <span className="cs-member-role">
                                        ({member.member_rol})
                                    </span>
                                </span>
                            </div>
                        ))}
                        {members.length === 0 && (
                            <div className="cs-section-note">
                                No hay miembros en este espacio.
                            </div>
                        )}
                    </div>
                )}

                {/* Mensajes directos (static) */}
                <div className="cs-section">
                    <div className="cs-section-header">
                        <span>💬 Mensajes directos</span>
                        <button className="cs-add-btn cs-disabled" title="Nuevo DM (Próximamente)">+</button>
                    </div>
                </div>

                {/* Aplicaciones (static) */}
                <div className="cs-section">
                    <div className="cs-section-header">
                        <span>⊞ Aplicaciones</span>
                    </div>
                    <div className="cs-channel-item cs-disabled" title="Slackbot (Próximamente)">
                        <span className="cs-app-icon">🤖</span> Slackbot
                    </div>
                    <div className="cs-channel-item cs-disabled" title="Slack (Próximamente)">
                        <span className="cs-app-icon">💼</span> Slack
                    </div>
                </div>
            </div>

            {/* ── Footer ─── */}
            <div className="cs-footer">
                <div className="cs-footer-note">
                    <strong>Slack</strong> funciona mejor cuando lo usas en conjunto.
                </div>
                <button className="cs-invite-btn" onClick={onOpenMembers}>
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
                        {errorMsg && <p className="cs-error-msg">{errorMsg}</p>}
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
