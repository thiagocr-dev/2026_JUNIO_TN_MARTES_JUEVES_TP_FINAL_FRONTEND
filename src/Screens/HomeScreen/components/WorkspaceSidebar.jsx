import React, { useState, useEffect, useRef } from 'react';
import { getWorkspaces, createWorkspace, deleteWorkspace, updateWorkspace, inviteToWorkspace } from '../../../services/workspaceService';
import { createChannel } from '../../../services/channelService';
import './WorkspaceSidebar.css';

export const WorkspaceSidebar = ({
    token,
    onSelectWorkspace,
    activeWorkspaceId,
    activeWorkspace,
    onChannelCreated,
    userData,
    onLogout,
}) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeNav, setActiveNav] = useState('inicio');

    // "+" dropdown
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const menuRef = useRef(null);

    // Modals
    const [modal, setModal] = useState(null); // 'workspace' | 'channel' | 'invite' | 'edit_workspace'

    // Form state
    const [newWsName, setNewWsName] = useState('');
    const [newChannelName, setNewChannelName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [formLoading, setFormLoading] = useState(false);
    const [formFeedback, setFormFeedback] = useState('');

    // Edit workspace form state
    const [editWsId, setEditWsId] = useState('');
    const [editWsName, setEditWsName] = useState('');
    const [editWsDesc, setEditWsDesc] = useState('');

    useEffect(() => {
        if (token) loadWorkspaces();
    }, [token]);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowCreateMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const loadWorkspaces = async () => {
        try {
            const response = await getWorkspaces(token);
            if (response.ok) {
                const list = response.data.workspaces.map(w => ({
                    _id: w.workspace_id,
                    nombre: w.workspace_nombre,
                    descripcion: w.workspace_descripcion,
                }));
                setWorkspaces(list);
                if (list.length > 0 && !activeWorkspaceId) {
                    onSelectWorkspace(list[0]);
                }
            }
        } catch (err) {
            console.error('Error al cargar workspaces:', err);
        }
    };

    const openModal = (type) => {
        setModal(type);
        setShowCreateMenu(false);
        setFormFeedback('');
    };

    const closeModal = () => {
        setModal(null);
        setNewWsName('');
        setNewChannelName('');
        setInviteEmail('');
        setInviteRole('member');
        setFormFeedback('');
        setEditWsId('');
        setEditWsName('');
        setEditWsDesc('');
    };

    const handleEditClick = (e, ws) => {
        e.stopPropagation();
        setEditWsId(ws._id);
        setEditWsName(ws.nombre);
        setEditWsDesc(ws.descripcion || '');
        setModal('edit_workspace');
        setFormFeedback('');
    };

    const handleUpdateWorkspace = async () => {
        if (!editWsName.trim() || formLoading) return;
        setFormLoading(true);
        try {
            const res = await updateWorkspace(token, editWsId, editWsName, editWsDesc);
            if (res.ok) {
                closeModal();
                await loadWorkspaces();
                if (activeWorkspaceId === editWsId) {
                    onSelectWorkspace({
                        _id: editWsId,
                        nombre: editWsName,
                        descripcion: editWsDesc
                    });
                }
            }
        } catch (err) {
            setFormFeedback(err.message || 'Error al actualizar el workspace.');
        } finally {
            setFormLoading(false);
        }
    };

    /* ── Create Workspace ── */
    const handleCreateWorkspace = async () => {
        if (!newWsName.trim() || formLoading) return;
        setFormLoading(true);
        try {
            const res = await createWorkspace(token, newWsName);
            if (res.ok) {
                closeModal();
                await loadWorkspaces();
                onSelectWorkspace(res.data.workspace);
            }
        } catch (err) {
            setFormFeedback('Error al crear el workspace.');
        } finally {
            setFormLoading(false);
        }
    };

    /* ── Create Channel ── */
    const handleCreateChannel = async () => {
        if (!newChannelName.trim() || formLoading) return;
        if (!activeWorkspace) {
            setFormFeedback('Primero selecciona un workspace.');
            return;
        }
        setFormLoading(true);
        try {
            const res = await createChannel(token, activeWorkspace._id, newChannelName);
            if (res.ok) {
                closeModal();
                onChannelCreated(res.data);
            }
        } catch (err) {
            setFormFeedback('Error al crear el canal.');
        } finally {
            setFormLoading(false);
        }
    };

    /* ── Invite User ── */
    const handleInvite = async () => {
        if (!inviteEmail.trim() || formLoading) return;
        if (!activeWorkspace) {
            setFormFeedback('Primero selecciona un workspace.');
            return;
        }
        setFormLoading(true);
        try {
            const res = await inviteToWorkspace(token, activeWorkspace._id, inviteEmail, inviteRole);
            if (res.ok) {
                setFormFeedback('✅ Invitación enviada correctamente.');
                setInviteEmail('');
                setTimeout(closeModal, 1500);
            }
        } catch (err) {
            setFormFeedback(`❌ ${err.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    /* ── Delete Workspace ── */
    const handleDelete = async (e, ws_id) => {
        e.stopPropagation();
        if (!window.confirm('¿Seguro que deseas eliminar este workspace?')) return;
        try {
            const res = await deleteWorkspace(token, ws_id);
            if (res.ok) {
                if (activeWorkspaceId === ws_id) onSelectWorkspace(null);
                loadWorkspaces();
            }
        } catch (err) {
            alert('No tienes permiso para eliminar este workspace.');
        }
    };

    const initials = userData?.nombre?.substring(0, 2).toUpperCase() ?? 'U';

    const navItems = [
        { id: 'inicio',   icon: '⌂',   label: 'Inicio', disabled: false },
        { id: 'dm',       icon: '💬',   label: 'DMs', disabled: true },
        { id: 'activity', icon: '🔔',   label: 'Actividad', disabled: true },
        { id: 'files',    icon: '📁',   label: 'Archivos', disabled: true },
        { id: 'more',     icon: '···',  label: 'Más', disabled: true },
    ];

    /* ── Create Menu Items ── */
    const createItems = [
        {
            id: 'workspace',
            icon: '🏢',
            color: '#4A154B',
            title: 'Espacio de trabajo',
            desc: 'Crear un nuevo espacio de trabajo',
            badge: null,
            disabled: false,
            action: () => openModal('workspace'),
        },
        {
            id: 'message',
            icon: '✏️',
            color: '#E01E5A',
            title: 'Mensaje',
            desc: 'Iniciar una conversación en un mensaje directo...',
            badge: null,
            disabled: true,
        },
        {
            id: 'channel',
            icon: '#',
            color: '#1164A3',
            title: 'Canal',
            desc: 'Iniciar una conversación grupal por tema',
            badge: null,
            disabled: false,
            action: () => openModal('channel'),
        },
        {
            id: 'junta',
            icon: '🎧',
            color: '#2EB67D',
            title: 'Junta',
            desc: 'Iniciar una conversación de video o de audio',
            badge: null,
            disabled: true,
        },
        {
            id: 'canvas',
            icon: '🖼',
            color: '#ECB22E',
            title: 'Canvas',
            desc: 'Crear y compartir contenido',
            badge: 'PRO',
            disabled: true,
        },
        {
            id: 'lista',
            icon: '📋',
            color: '#E07E2E',
            title: 'Lista',
            desc: 'Controlar y administrar proyectos',
            badge: 'PRO',
            disabled: true,
        },
        {
            id: 'invite',
            icon: '👤',
            color: '#5865F2',
            title: 'Invitar a personas',
            desc: null,
            badge: null,
            disabled: false,
            action: () => openModal('invite'),
        },
    ];

    return (
        <>
            <div className="global-nav">
                {/* Workspace icons */}
                {workspaces.map((ws) => (
                    <div
                        key={ws._id}
                        className="ws-item-container"
                        onClick={() => onSelectWorkspace(ws)}
                        title={ws.nombre}
                    >
                        <div
                            className={activeWorkspaceId === ws._id ? "global-nav-workspace-btn ws-btn-active" : "global-nav-workspace-btn"}
                        >
                            {ws.nombre.substring(0, 2).toUpperCase()}
                        </div>
                        {activeWorkspaceId === ws._id && (
                            <>
                                <button
                                    onClick={(e) => handleEditClick(e, ws)}
                                    className="ws-edit-btn"
                                    title="Editar workspace"
                                >✎</button>
                                <button
                                    onClick={(e) => handleDelete(e, ws._id)}
                                    className="ws-delete-btn"
                                    title="Eliminar workspace"
                                >×</button>
                            </>
                        )}
                    </div>
                ))}

                {/* Nav items */}
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`global-nav-item ${activeNav === item.id ? 'active' : ''} ${item.disabled ? 'ws-nav-disabled' : ''}`}
                        onClick={item.disabled ? undefined : () => setActiveNav(item.id)}
                        title={item.disabled ? `${item.label} (Próximamente)` : item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="global-nav-spacer" />

                {/* "+" Button with dropdown */}
                <div ref={menuRef} className="ws-menu-container">
                    <div
                        className="global-nav-add"
                        onClick={() => setShowCreateMenu(v => !v)}
                        title="Crear"
                    >+</div>

                    {showCreateMenu && (
                        <div className="ws-dropdown-menu">
                            <div className="ws-dropdown-header">
                                Crear
                            </div>
                            {createItems.map(item => (
                                <div
                                    key={item.id}
                                    title={item.disabled ? 'Próximamente' : undefined}
                                    onClick={!item.disabled && item.action ? item.action : undefined}
                                    className={`ws-dropdown-item ${item.disabled ? 'ws-dropdown-item-disabled' : ''}`}
                                >
                                    <div className={`ws-dropdown-icon ${item.id === 'channel' ? 'ws-dropdown-icon-channel' : 'ws-dropdown-icon-default'}`}
                                         style={{ background: item.color }}>
                                        {item.icon}
                                    </div>
                                    <div className="ws-dropdown-text-container">
                                        <div className="ws-dropdown-title">
                                            {item.title}
                                        </div>
                                        {item.desc && (
                                            <div className="ws-dropdown-desc">
                                                {item.desc}
                                            </div>
                                        )}
                                    </div>
                                    {item.badge && (
                                        <span className="ws-dropdown-badge">{item.badge}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User avatar */}
                <div
                    className="global-nav-avatar ws-avatar"
                    title={`${userData?.nombre} — Cerrar sesión`}
                    onClick={onLogout}
                >
                    {initials}
                    <span className="status-dot" />
                </div>
            </div>

            {/* ══ MODALS ══ */}

            {/* Create Workspace */}
            {modal === 'workspace' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear Workspace</h2>
                        <input
                            type="text" placeholder="Nombre del Workspace"
                            value={newWsName} onChange={e => setNewWsName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateWorkspace()}
                            autoFocus
                        />
                        {formFeedback && <p className="ws-feedback-error">{formFeedback}</p>}
                        <div className="modal-actions">
                            <button onClick={closeModal} disabled={formLoading}>Cancelar</button>
                            <button className="send-btn" onClick={handleCreateWorkspace} disabled={formLoading}>
                                {formLoading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Channel */}
            {modal === 'channel' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear Canal</h2>
                        {!activeWorkspace && (
                            <p className="ws-feedback-warn">
                                ⚠ Selecciona un workspace primero.
                            </p>
                        )}
                        <input
                            type="text" placeholder="nombre-del-canal"
                            value={newChannelName} onChange={e => setNewChannelName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateChannel()}
                            disabled={!activeWorkspace}
                            autoFocus
                        />
                        {formFeedback && <p className="ws-feedback-error">{formFeedback}</p>}
                        <div className="modal-actions">
                            <button onClick={closeModal} disabled={formLoading}>Cancelar</button>
                            <button className="send-btn" onClick={handleCreateChannel} disabled={formLoading || !activeWorkspace}>
                                {formLoading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite */}
            {modal === 'invite' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Invitar a personas</h2>
                        {!activeWorkspace && (
                            <p className="ws-feedback-warn">
                                ⚠ Selecciona un workspace primero.
                            </p>
                        )}
                        {activeWorkspace && (
                            <p className="ws-invite-text">
                                Invitando al workspace: <strong className="ws-invite-text-bold">{activeWorkspace.nombre}</strong>
                            </p>
                        )}
                        <input
                            type="email" placeholder="correo@ejemplo.com"
                            value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleInvite()}
                            disabled={!activeWorkspace}
                            autoFocus
                        />
                        <select
                            value={inviteRole}
                            onChange={e => setInviteRole(e.target.value)}
                            disabled={!activeWorkspace}
                            className="ws-select"
                        >
                            <option value="member">Miembro</option>
                            <option value="admin">Admin</option>
                        </select>
                        {formFeedback && (
                            <p className={formFeedback.startsWith('✅') ? "ws-feedback-success" : "ws-feedback-error"}>
                                {formFeedback}
                            </p>
                        )}
                        <div className="modal-actions">
                            <button onClick={closeModal} disabled={formLoading}>Cancelar</button>
                            <button className="send-btn" onClick={handleInvite} disabled={formLoading || !activeWorkspace}>
                                {formLoading ? 'Enviando...' : 'Invitar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Workspace */}
            {modal === 'edit_workspace' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Workspace</h2>
                        <input
                            type="text" placeholder="Nuevo nombre del Workspace"
                            value={editWsName} onChange={e => setEditWsName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleUpdateWorkspace()}
                            className="ws-input"
                            autoFocus
                        />
                        <input
                            type="text" placeholder="Nueva descripción"
                            value={editWsDesc} onChange={e => setEditWsDesc(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleUpdateWorkspace()}
                            className="ws-input ws-input-last"
                        />
                        {formFeedback && <p className="ws-feedback-error">{formFeedback}</p>}
                        <div className="modal-actions">
                            <button onClick={closeModal} disabled={formLoading}>Cancelar</button>
                            <button className="send-btn" onClick={handleUpdateWorkspace} disabled={formLoading}>
                                {formLoading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
