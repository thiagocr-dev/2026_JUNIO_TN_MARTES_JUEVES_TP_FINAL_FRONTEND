import React, { useState, useEffect } from 'react';
import { getWorkspaces, createWorkspace, deleteWorkspace } from '../../../services/workspaceService';

export const WorkspaceSidebar = ({ token, onSelectWorkspace, activeWorkspaceId, userData, onLogout }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWsName, setNewWsName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeNav, setActiveNav] = useState('inicio');

    useEffect(() => {
        if (token) loadWorkspaces();
    }, [token]);

    const loadWorkspaces = async () => {
        try {
            const response = await getWorkspaces(token);
            if (response.ok) {
                const workspacesList = response.data.workspaces.map(w => ({
                    _id: w.workspace_id,
                    nombre: w.workspace_nombre,
                    descripcion: w.workspace_descripcion
                }));
                setWorkspaces(workspacesList);
                if (workspacesList.length > 0 && !activeWorkspaceId) {
                    onSelectWorkspace(workspacesList[0]);
                }
            }
        } catch (error) {
            console.error('Error al cargar workspaces:', error);
        }
    };

    const handleCreate = async () => {
        if (!newWsName.trim() || isLoading) return;
        setIsLoading(true);
        try {
            const response = await createWorkspace(token, newWsName);
            if (response.ok) {
                setNewWsName('');
                setIsModalOpen(false);
                await loadWorkspaces();
                onSelectWorkspace(response.data.workspace);
            }
        } catch (error) {
            console.error('Error al crear workspace', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, ws_id) => {
        e.stopPropagation();
        if (window.confirm('¿Seguro que deseas eliminar este workspace?')) {
            try {
                const response = await deleteWorkspace(token, ws_id);
                if (response.ok) {
                    if (activeWorkspaceId === ws_id) onSelectWorkspace(null);
                    loadWorkspaces();
                }
            } catch (error) {
                console.error('Error al eliminar workspace', error);
                alert('No tienes permiso para eliminar este workspace o ha ocurrido un error.');
            }
        }
    };

    const initials = userData?.nombre
        ? userData.nombre.substring(0, 2).toUpperCase()
        : 'U';

    const navItems = [
        { id: 'inicio',   icon: '⌂', label: 'Inicio' },
        { id: 'dm',       icon: '💬', label: 'DMs' },
        { id: 'activity', icon: '🔔', label: 'Actividad' },
        { id: 'files',    icon: '📁', label: 'Archivos' },
        { id: 'more',     icon: '···', label: 'Más' },
    ];

    return (
        <div className="global-nav">
            {/* Active workspace icon (top) */}
            {workspaces.map((ws) => (
                <div
                    key={ws._id}
                    style={{ position: 'relative', marginBottom: 8 }}
                    onClick={() => onSelectWorkspace(ws)}
                    title={ws.nombre}
                >
                    <div
                        className="global-nav-workspace-btn"
                        style={{
                            outline: activeWorkspaceId === ws._id ? '2px solid #fff' : 'none',
                            outlineOffset: 2,
                        }}
                    >
                        {ws.nombre.substring(0, 2).toUpperCase()}
                    </div>
                    {activeWorkspaceId === ws._id && (
                        <button
                            onClick={(e) => handleDelete(e, ws._id)}
                            style={{
                                position: 'absolute', top: -4, right: -4,
                                background: '#E01E5A', color: '#fff',
                                border: 'none', borderRadius: '50%',
                                width: 16, height: 16, fontSize: 9,
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                zIndex: 2,
                            }}
                            title="Eliminar workspace"
                        >×</button>
                    )}
                </div>
            ))}

            {/* Navigation icons */}
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

            {/* Add workspace */}
            <div
                className="global-nav-add"
                onClick={() => setIsModalOpen(true)}
                title="Crear Workspace"
            >+</div>

            {/* User avatar */}
            <div
                className="global-nav-avatar"
                title={`${userData?.nombre} — Cerrar sesión`}
                onClick={onLogout}
            >
                {initials}
                <span className="status-dot" />
            </div>

            {/* Create Workspace Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear Workspace</h2>
                        <input
                            type="text"
                            placeholder="Nombre del Workspace"
                            value={newWsName}
                            onChange={(e) => setNewWsName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)} disabled={isLoading}>Cancelar</button>
                            <button onClick={handleCreate} className="send-btn" disabled={isLoading}>
                                {isLoading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
