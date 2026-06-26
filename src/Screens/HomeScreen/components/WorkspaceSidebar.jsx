import React, { useState, useEffect } from 'react';
import { getWorkspaces, createWorkspace, deleteWorkspace } from '../../../services/workspaceService';

export const WorkspaceSidebar = ({ token, onSelectWorkspace, activeWorkspaceId }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWsName, setNewWsName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (token) {
            loadWorkspaces();
        }
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
                // Si no hay workspace activo pero hay workspaces, selecciona el primero
                if (workspacesList.length > 0 && !activeWorkspaceId) {
                    onSelectWorkspace(workspacesList[0]);
                }
            }
        } catch (error) {
            console.error("Error al cargar workspaces:", error);
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
                loadWorkspaces();
                onSelectWorkspace(response.data.workspace);
            }
        } catch (error) {
            console.error("Error al crear workspace", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, ws_id) => {
        e.stopPropagation();
        if (window.confirm("¿Seguro que deseas eliminar este workspace?")) {
            try {
                const response = await deleteWorkspace(token, ws_id);
                if (response.ok) {
                    if (activeWorkspaceId === ws_id) {
                        onSelectWorkspace(null);
                    }
                    loadWorkspaces();
                }
            } catch (error) {
                console.error("Error al eliminar workspace", error);
                alert("No tienes permiso para eliminar este workspace o ha ocurrido un error.");
            }
        }
    };

    return (
        <div className="workspace-sidebar">
            {workspaces.map((ws) => (
                <div
                    key={ws._id}
                    className={`workspace-icon ${activeWorkspaceId === ws._id ? 'active' : ''}`}
                    onClick={() => onSelectWorkspace(ws)}
                    title={ws.nombre}
                    style={{ position: 'relative' }}
                >
                    {ws.nombre.substring(0, 2).toUpperCase()}
                    {activeWorkspaceId === ws._id && (
                        <button 
                            onClick={(e) => handleDelete(e, ws._id)}
                            style={{
                                position: 'absolute', top: -5, right: -5, background: '#e01e5a', color: 'white',
                                border: 'none', borderRadius: '50%', width: '18px', height: '18px',
                                fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Eliminar Workspace"
                        >
                            x
                        </button>
                    )}
                </div>
            ))}

            <div
                className="workspace-icon add-new"
                onClick={() => setIsModalOpen(true)}
                title="Crear Workspace"
            >
                +
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear Workspace</h2>
                        <input
                            type="text"
                            placeholder="Nombre del Workspace"
                            value={newWsName}
                            onChange={(e) => setNewWsName(e.target.value)}
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
