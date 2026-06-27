import React, { useState, useEffect } from 'react';
import { getWorkspaceMembers, inviteToWorkspace } from '../../../services/workspaceService';

export const MembersModal = ({ token, workspace, onClose }) => {
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [formLoading, setFormLoading] = useState(false);
    const [formFeedback, setFormFeedback] = useState('');

    useEffect(() => {
        if (token && workspace) {
            loadMembers();
        }
    }, [token, workspace]);

    const loadMembers = async () => {
        setLoadingMembers(true);
        try {
            const response = await getWorkspaceMembers(token, workspace._id);
            if (response.ok) {
                setMembers(response.data.workspace_members_info || []);
            }
        } catch (error) {
            console.error('Error al cargar miembros:', error);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim() || formLoading) return;
        setFormLoading(true);
        setFormFeedback('');
        try {
            const response = await inviteToWorkspace(token, workspace._id, inviteEmail, inviteRole);
            if (response.ok) {
                setFormFeedback('✅ Invitación enviada exitosamente.');
                setInviteEmail('');
                // Reload members to see the status if updated (or just let the page refresh)
                loadMembers();
            }
        } catch (error) {
            setFormFeedback(`❌ ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
            <div className="modal-content" style={{ width: '500px', maxWidth: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Miembros de {workspace.nombre}</h2>
                    <button 
                        onClick={onClose} 
                        style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>

                {/* ─── List of current members ─── */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                    <h4 style={{ color: '#9B9B9B', marginBottom: '10px' }}>Miembros actuales</h4>
                    {loadingMembers ? (
                        <p style={{ color: '#9B9B9B', fontSize: '13px' }}>Cargando miembros...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {members.map((member) => (
                                <div 
                                    key={member.user_id} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        padding: '8px 12px',
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>
                                            {member.user_nombre}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#9B9B9B' }}>
                                            {member.user_email}
                                        </div>
                                    </div>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        padding: '3px 8px', 
                                        borderRadius: '10px', 
                                        background: member.member_rol === 'owner' ? '#E01E5A' : '#1164A3',
                                        color: '#fff',
                                        textTransform: 'capitalize'
                                    }}>
                                        {member.member_rol}
                                    </span>
                                </div>
                            ))}
                            {members.length === 0 && (
                                <p style={{ color: '#9B9B9B', fontSize: '13px' }}>No hay miembros activos.</p>
                            )}
                        </div>
                    )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '0 0 20px 0' }} />

                {/* ─── Form to invite ─── */}
                <div>
                    <h4 style={{ color: '#9B9B9B', marginBottom: '12px' }}>Invitar a un nuevo miembro</h4>
                    <form onSubmit={handleInvite}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: '9px 12px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    borderRadius: 6,
                                    fontSize: 14,
                                    outline: 'none',
                                }}
                            />
                            <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                                style={{
                                    width: '110px',
                                    padding: '9px 12px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    borderRadius: 6,
                                    fontSize: 14,
                                    outline: 'none',
                                }}
                            >
                                <option value="member">Miembro</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {formFeedback && (
                            <p style={{ 
                                fontSize: 13, 
                                margin: '0 0 12px 0', 
                                color: formFeedback.startsWith('✅') ? '#2EB67D' : '#E01E5A' 
                            }}>
                                {formFeedback}
                            </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button 
                                type="button" 
                                onClick={onClose} 
                                style={{
                                    padding: '8px 16px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cerrar
                            </button>
                            <button 
                                type="submit" 
                                className="send-btn" 
                                disabled={formLoading}
                                style={{
                                    padding: '8px 16px',
                                    background: '#1164A3',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {formLoading ? 'Enviando...' : 'Invitar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
