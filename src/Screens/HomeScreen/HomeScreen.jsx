import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { WorkspaceSidebar } from './components/WorkspaceSidebar';
import { ChannelSidebar } from './components/ChannelSidebar';
import { ChatArea } from './components/ChatArea';
import '../../assets/slack-theme.css'; // Import the Slack Theme

export const HomeScreen = () => {
    const navigate = useNavigate();
    const { logout, userData } = useContext(AuthContext);
    const token = localStorage.getItem('auth_token');

    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    if (!userData) {
        return <h2>Cargando...</h2>;
    }

    const handleSelectWorkspace = (workspace) => {
        setActiveWorkspace(workspace);
        setActiveChannel(null); // Reset channel when workspace changes
    };

    const handleSelectChannel = (channel) => {
        setActiveChannel(channel);
    };

    return (
        <div className="slack-layout">
            {/* Top Navigation */}
            <div className="slack-header">
                <input type="text" className="slack-search" placeholder={`Buscar en ${activeWorkspace ? activeWorkspace.nombre : 'Slack Clone'}`} />
                <button 
                    onClick={handleLogout} 
                    style={{ position: 'absolute', right: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Salir
                </button>
            </div>

            {/* Main Body */}
            <div className="slack-body">
                {/* 1. Workspaces Sidebar */}
                <WorkspaceSidebar 
                    token={token} 
                    activeWorkspaceId={activeWorkspace?._id}
                    onSelectWorkspace={handleSelectWorkspace} 
                />

                {/* 2. Channels Sidebar */}
                <ChannelSidebar 
                    token={token}
                    workspace={activeWorkspace}
                    activeChannelId={activeChannel?._id}
                    onSelectChannel={handleSelectChannel}
                />

                {/* 3. Main Chat Area */}
                <ChatArea 
                    token={token}
                    channel={activeChannel}
                />
            </div>
        </div>
    );
};
