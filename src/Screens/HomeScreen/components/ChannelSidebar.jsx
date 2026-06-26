import React, { useState, useEffect } from 'react';
import { getChannels, createChannel } from '../../../services/channelService';

export const ChannelSidebar = ({ token, workspace, onSelectChannel, activeChannelId }) => {
    const [channels, setChannels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');

    useEffect(() => {
        if (token && workspace) {
            loadChannels();
        } else {
            setChannels([]);
        }
    }, [token, workspace]);

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
            console.error("Error al cargar canales:", error);
        }
    };

    const handleCreate = async () => {
        if (!newChannelName.trim()) return;
        try {
            const response = await createChannel(token, workspace._id, newChannelName);
            if (response.ok) {
                setNewChannelName('');
                setIsModalOpen(false);
                loadChannels();
                onSelectChannel(response.data);
            }
        } catch (error) {
            console.error("Error al crear canal", error);
        }
    };

    if (!workspace) {
        return (
            <div className="channel-sidebar">
                <div className="channel-sidebar-header">Sin Workspace</div>
            </div>
        );
    }

    return (
        <div className="channel-sidebar">
            <div className="channel-sidebar-header">
                {workspace.nombre}
            </div>
            
            <div className="channel-list-section">
                <div className="channel-list-title">
                    <span>Canales</span>
                    <button className="add-channel-btn" onClick={() => setIsModalOpen(true)} title="Añadir canal">
                        +
                    </button>
                </div>
                
                {channels.map((channel) => (
                    <div 
                        key={channel._id} 
                        className={`channel-item ${activeChannelId === channel._id ? 'active' : ''}`}
                        onClick={() => onSelectChannel(channel)}
                    >
                        <span className="hash">#</span>
                        {channel.nombre}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear Canal</h2>
                        <input 
                            type="text" 
                            placeholder="Nombre del canal" 
                            value={newChannelName} 
                            onChange={(e) => setNewChannelName(e.target.value)} 
                        />
                        <div className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button onClick={handleCreate} className="send-btn">Crear</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
