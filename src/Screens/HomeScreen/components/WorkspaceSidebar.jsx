import React, { useState, useEffect, useRef } from 'react';
import { getWorkspaces, createWorkspace, deleteWorkspace, updateWorkspace, inviteToWorkspace } from '../../../services/workspaceService';
import { createChannel } from '../../../services/channelService';

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
        { id: 'inicio',   icon: '⌂',   label: 'Inicio' },
        { id: 'dm',       icon: '💬',   label: 'DMs' },
        { id: 'activity', icon: '🔔',   label: 'Actividad' },
        { id: 'files',    icon: '📁',   label: 'Archivos' },
        { id: 'more',     icon: '···',  label: 'Más' },
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
                        style={{ position: 'relative', marginBottom: 8 }}
                        onClick={() => onSelectWorkspace(ws)}
                        title={ws.nombre}
                    >
                        <div
                            className="global-nav-workspace-btn"
                            style={{ outline: activeWorkspaceId === ws._id ? '2px solid #fff' : 'none', outlineOffset: 2 }}
                        >
                            {ws.nombre.substring(0, 2).toUpperCase()}
                        </div>
                        {activeWorkspaceId === ws._id && (
                            <>
                                <button
                                    onClick={(e) => handleEditClick(e, ws)}
                                    style={{
                                        position: 'absolute', top: -4, left: -4,
                                        background: '#1164A3', color: '#fff',
                                        border: 'none', borderRadius: '50%',
                                        width: 16, height: 16, fontSize: 9,
                                        cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', zIndex: 2,
                                    }}
                                    title="Editar workspace"
                                >✎</button>
                                <button
                                    onClick={(e) => handleDelete(e, ws._id)}
                                    style={{
                                        position: 'absolute', top: -4, right: -4,
                                        background: '#E01E5A', color: '#fff',
                                        border: 'none', borderRadius: '50%',
                                        width: 16, height: 16, fontSize: 9,
                                        cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', zIndex: 2,
                                    }}
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
                        className={`global-nav-item ${activeNav === item.id ? 'active' : ''}`}
                        onClick={() => setActiveNav(item.id)}
                        title={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="global-nav-spacer" />

                {/* "+" Button with dropdown */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                    <div
                        className="global-nav-add"
                        onClick={() => setShowCreateMenu(v => !v)}
                        title="Crear"
                    >+</div>

                    {showCreateMenu && (
                        <div style={{
                            position: 'absolute', bottom: '44px', left: '60px',
                            width: 300,
                            background: '#1E1D21',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 10,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}>
                            <div style={{ padding: '12px 16px 8px', fontSize: 13, fontWeight: 700, color: '#9B9B9B', letterSpacing: '0.04em' }}>
                                Crear
                            </div>
                            {createItems.map(item => (
                                <div
                                    key={item.id}
                                    onClick={!item.disabled && item.action ? item.action : undefined}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '10px 16px',
                                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                                        opacity: item.disabled ? 0.45 : 1,
                                        transition: 'background 0.12s',
                                    }}
                                    onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: item.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: item.id === 'channel' ? 18 : 16, fontWeight: 700,
                                        color: '#fff', flexShrink: 0,
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#D1D2D3' }}>
                                            {item.title}
                                        </div>
                                        {item.desc && (
                                            <div style={{ fontSize: 12, color: '#9B9B9B', marginTop: 1 }}>
                                                {item.desc}
                                            </div>
                                        )}
                                    </div>
                                    {item.badge && (
                                        <span style={{
                                            background: 'linear-gradient(90deg,#ECB22E,#E01E5A)',
                                            color: '#fff', fontSize: 10, fontWeight: 700,
                                            padding: '2px 7px', borderRadius: 10,
                                        }}>{item.badge}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User avatar */}
                <div
                    className="global-nav-avatar"
                    title={`${userData?.nombre} — Cerrar sesión`}
                    onClick={onLogout}
                    style={{ marginTop: 8 }}
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
                        {formFeedback && <p style={{ color: '#E01E5A', fontSize: 13, marginBottom: 8 }}>{formFeedback}</p>}
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
                            <p style={{ color: '#ECB22E', fontSize: 13, marginBottom: 10 }}>
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
                        {formFeedback && <p style={{ color: '#E01E5A', fontSize: 13, marginBottom: 8 }}>{formFeedback}</p>}
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
                            <p style={{ color: '#ECB22E', fontSize: 13, marginBottom: 10 }}>
                                ⚠ Selecciona un workspace primero.
                            </p>
                        )}
                        {activeWorkspace && (
                            <p style={{ color: '#9B9B9B', fontSize: 13, marginBottom: 12 }}>
                                Invitando al workspace: <strong style={{ color: '#fff' }}>{activeWorkspace.nombre}</strong>
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
                            style={{
                                width: '100%', padding: '9px 12px', marginBottom: 16,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', borderRadius: 6, fontSize: 14,
                                fontFamily: 'inherit', outline: 'none',
                            }}
                        >
                            <option value="member">Miembro</option>
                            <option value="admin">Admin</option>
                        </select>
                        {formFeedback && (
                            <p style={{ fontSize: 13, marginBottom: 8, color: formFeedback.startsWith('✅') ? '#2EB67D' : '#E01E5A' }}>
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
                            style={{
                                width: '100%', padding: '9px 12px', marginBottom: 12,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', borderRadius: 6, fontSize: 14,
                                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                            }}
                            autoFocus
                        />
                        <input
                            type="text" placeholder="Nueva descripción"
                            value={editWsDesc} onChange={e => setEditWsDesc(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleUpdateWorkspace()}
                            style={{
                                width: '100%', padding: '9px 12px', marginBottom: 16,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', borderRadius: 6, fontSize: 14,
                                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                            }}
                        />
                        {formFeedback && <p style={{ color: '#E01E5A', fontSize: 13, marginBottom: 8 }}>{formFeedback}</p>}
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
