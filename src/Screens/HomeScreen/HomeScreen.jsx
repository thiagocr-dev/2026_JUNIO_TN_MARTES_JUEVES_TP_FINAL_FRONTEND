import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { WorkspaceSidebar } from './components/WorkspaceSidebar';
import { ChannelSidebar } from './components/ChannelSidebar';
import { ChatArea } from './components/ChatArea';
import '../../assets/slack-theme.css';

export const HomeScreen = () => {
    const navigate = useNavigate();
    const { logout, userData } = useContext(AuthContext);
    const token = localStorage.getItem('auth_token');

    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null);
    // Incrementing this key forces ChannelSidebar to reload its channel list
    const [channelRefreshKey, setChannelRefreshKey] = useState(0);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    if (!userData) {
        return <h2 style={{ color: '#fff', padding: 20 }}>Cargando...</h2>;
    }

    const handleSelectWorkspace = (workspace) => {
        setActiveWorkspace(workspace);
        setActiveChannel(null);
    };

    const handleSelectChannel = (channel) => {
        setActiveChannel(channel);
    };

    // Called when a channel is created from the "+" menu
    const handleChannelCreated = (newChannel) => {
        setChannelRefreshKey(k => k + 1);
        setActiveChannel(newChannel);
    };

    return (
        <div className="slack-layout">
            {/* ─── TOP HEADER ─── */}
            <div className="slack-header">
                <div className="slack-header-nav">
                    <button title="Atrás">&#8592;</button>
                    <button title="Adelante">&#8594;</button>
                    <button title="Historial">&#9719;</button>
                </div>
                <div className="slack-header-search">
                    <span className="search-icon">&#128269;</span>
                    <input
                        type="text"
                        placeholder={`Buscar en ${activeWorkspace?.nombre ?? 'Slack Clone'}`}
                    />
                </div>
                <div className="slack-header-right">
                    <button title="Ayuda">?</button>
                </div>
            </div>

            {/* ─── MAIN BODY ─── */}
            <div className="slack-body">
                <WorkspaceSidebar
                    token={token}
                    activeWorkspaceId={activeWorkspace?._id}
                    activeWorkspace={activeWorkspace}
                    onSelectWorkspace={handleSelectWorkspace}
                    onChannelCreated={handleChannelCreated}
                    userData={userData}
                    onLogout={handleLogout}
                />

                <ChannelSidebar
                    token={token}
                    workspace={activeWorkspace}
                    activeChannelId={activeChannel?._id}
                    onSelectChannel={handleSelectChannel}
                    refreshKey={channelRefreshKey}
                />

                <ChatArea
                    token={token}
                    channel={activeChannel}
                    userData={userData}
                />
            </div>
        </div>
    );
};
