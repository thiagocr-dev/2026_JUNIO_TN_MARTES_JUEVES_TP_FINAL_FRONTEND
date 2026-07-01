import React, { useState, useEffect } from 'react';
import { getWorkspaceMembers, inviteToWorkspace } from '../../../services/workspaceService';
import './MembersModal.css';

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
        <div className="modal-overlay mm-modal-overlay">
            <div className="modal-content mm-modal-content">
                <div className="mm-modal-header">
                    <h2 className="mm-modal-title">Miembros de {workspace.nombre}</h2>
                    <button 
                        onClick={onClose} 
                        className="mm-close-btn"
                    >
                        &times;
                    </button>
                </div>

                {/* ─── List of current members ─── */}
                <div className="mm-members-list">
                    <h4 className="mm-section-label">Miembros actuales</h4>
                    {loadingMembers ? (
                        <p className="mm-loading-text">Cargando miembros...</p>
                    ) : (
                        <div className="mm-members-container">
                            {members.map((member) => (
                                <div 
                                    key={member.user_id} 
                                    className="mm-member-row"
                                >
                                    <div>
                                        <div className="mm-member-name">
                                            {member.user_nombre}
                                        </div>
                                        <div className="mm-member-email">
                                            {member.user_email}
                                        </div>
                                    </div>
                                    <span className={member.member_rol === 'owner' ? 'mm-role-badge-owner' : 'mm-role-badge-member'}>
                                        {member.member_rol}
                                    </span>
                                </div>
                            ))}
                            {members.length === 0 && (
                                <p className="mm-empty-text">No hay miembros activos.</p>
                            )}
                        </div>
                    )}
                </div>

                <hr className="mm-divider" />

                {/* ─── Form to invite ─── */}
                <div>
                    <h4 className="mm-invite-label">Invitar a un nuevo miembro</h4>
                    <form onSubmit={handleInvite}>
                        <div className="mm-invite-row">
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                                className="mm-invite-input"
                            />
                            <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                                className="mm-invite-select"
                            >
                                <option value="member">Miembro</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {formFeedback && (
                            <p className={formFeedback.startsWith('✅') ? 'mm-feedback-success' : 'mm-feedback-error'}>
                                {formFeedback}
                            </p>
                        )}
                        <div className="mm-actions-row">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="mm-cancel-btn"
                            >
                                Cerrar
                            </button>
                            <button 
                                type="submit" 
                                className="send-btn mm-submit-btn" 
                                disabled={formLoading}
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
