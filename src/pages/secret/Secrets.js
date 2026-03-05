import '../../App.css';
import React, {useEffect, useState} from 'react';
import {getSecretsforUser, deleteSecret, updateSecret} from "../../comunication/FetchSecrets";

/**
 * Secrets
 * Zeigt Secrets typ-abhangig an, mit Loschen und Editieren.
 * @author Peter Rutschmann
 */

// --- Icons als einfache Emoji-Badges ---
const KIND_META = {
    credential: {label: 'Credential', icon: '🔑', color: '#e8f4fd', border: '#4a90d9'},
    creditcard: {label: 'Kreditkarte', icon: '💳', color: '#fdf3e8', border: '#d9924a'},
    note:       {label: 'Notiz',       icon: '📝', color: '#f0fde8', border: '4a9d4a'},
};

const getKind = (content) => {
    try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        return parsed?.kind || 'unknown';
    } catch {
        return 'unknown';
    }
};

const parseContent = (content) => {
    try {
        return typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
        return null;
    }
};

// --- Typ-spezifische Darstellung ---
const CredentialCard = ({data}) => (
    <div>
        <div style={styles.field}><span style={styles.label}>Benutzername</span><span>{data.userName}</span></div>
        <div style={styles.field}><span style={styles.label}>Passwort</span><span style={styles.secret}>{data.password}</span></div>
        <div style={styles.field}><span style={styles.label}>URL</span>
            <a href={data.url.startsWith('http') ? data.url : `https://${data.url}`} target="_blank" rel="noreferrer">{data.url}</a>
        </div>
    </div>
);

const CreditCardCard = ({data}) => (
    <div>
        <div style={styles.field}><span style={styles.label}>Kartentyp</span><span>{data.cardtype}</span></div>
        <div style={styles.field}><span style={styles.label}>Kartennummer</span><span style={styles.secret}>{data.cardnumber}</span></div>
        <div style={styles.field}><span style={styles.label}>Ablaufdatum</span><span>{data.expiration}</span></div>
        <div style={styles.field}><span style={styles.label}>CVV</span><span style={styles.secret}>{data.cvv}</span></div>
    </div>
);

const NoteCard = ({data}) => (
    <div>
        <div style={styles.field}><span style={styles.label}>Titel</span><span>{data.title}</span></div>
        <div style={{...styles.field, alignItems: 'flex-start'}}>
            <span style={styles.label}>Inhalt</span>
            <span style={styles.noteText}>{data.content}</span>
        </div>
    </div>
);

// --- Edit-Formulare pro Typ ---
const EditCredential = ({data, onChange}) => (
    <div>
        <div style={styles.field}>
            <span style={styles.label}>Benutzername</span>
            <input style={styles.input} value={data.userName} onChange={e => onChange({...data, userName: e.target.value})} />
        </div>
        <div style={styles.field}>
            <span style={styles.label}>Passwort</span>
            <input style={styles.input} value={data.password} onChange={e => onChange({...data, password: e.target.value})} />
        </div>
        <div style={styles.field}>
            <span style={styles.label}>URL</span>
            <input style={styles.input} value={data.url} onChange={e => onChange({...data, url: e.target.value})} />
        </div>
    </div>
);

const EditCreditCard = ({data, onChange}) => (
    <div>
        <div style={styles.field}>
            <span style={styles.label}>Kartentyp</span>
            <select style={styles.input} value={data.cardtype} onChange={e => onChange({...data, cardtype: e.target.value})}>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
            </select>
        </div>
        <div style={styles.field}>
            <span style={styles.label}>Kartennummer</span>
            <input style={styles.input} value={data.cardnumber} onChange={e => onChange({...data, cardnumber: e.target.value})} />
        </div>
        <div style={styles.field}>
            <span style={styles.label}>Ablaufdatum</span>
            <input style={styles.input} value={data.expiration} onChange={e => onChange({...data, expiration: e.target.value})} />
        </div>
        <div style={styles.field}>
            <span style={styles.label}>CVV</span>
            <input style={styles.input} value={data.cvv} onChange={e => onChange({...data, cvv: e.target.value})} />
        </div>
    </div>
);

const EditNote = ({data, onChange}) => (
    <div>
        <div style={styles.field}>
            <span style={styles.label}>Titel</span>
            <input style={styles.input} value={data.title} onChange={e => onChange({...data, title: e.target.value})} />
        </div>
        <div style={{...styles.field, alignItems: 'flex-start'}}>
            <span style={styles.label}>Inhalt</span>
            <textarea style={{...styles.input, minHeight: '80px', resize: 'vertical'}} value={data.content} onChange={e => onChange({...data, content: e.target.value})} />
        </div>
    </div>
);

// --- Haupt-Komponente ---
const Secrets = ({loginValues}) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);

    const fetchSecrets = async () => {
        setErrorMessage('');
        if (!loginValues.email) {
            setErrorMessage("Bitte zuerst einloggen.");
            return;
        }
        try {
            const data = await getSecretsforUser(loginValues);
            setSecrets(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchSecrets();
    }, [loginValues]);

    const handleDelete = async (secretId) => {
        if (!window.confirm('Secret wirklich loschen?')) return;
        try {
            await deleteSecret(secretId);
            setSecrets(prev => prev.filter(s => s.id !== secretId));
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleEditStart = (secret) => {
        setEditingId(secret.id);
        setEditData(parseContent(secret.content));
    };

    const handleEditSave = async (secret) => {
        try {
            await updateSecret({
                secretId: secret.id,
                loginValues,
                content: editData
            });
            setEditingId(null);
            setEditData(null);
            await fetchSecrets();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditData(null);
    };

    return (
        <div style={styles.page}>
            <h1>🔐 Meine Secrets</h1>
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}

            {secrets?.length === 0 ? (
                <p style={styles.empty}>Keine Secrets vorhanden.</p>
            ) : (
                <div style={styles.grid}>
                    {secrets.map(secret => {
                        const kind = getKind(secret.content);
                        const meta = KIND_META[kind] || {label: kind, icon: '❓', color: '#f5f5f5', border: '#aaa'};
                        const parsed = parseContent(secret.content);
                        const isEditing = editingId === secret.id;

                        return (
                            <div key={secret.id} style={{...styles.card, background: meta.color, borderLeft: `4px solid ${meta.border}`}}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.kindBadge}>{meta.icon} {meta.label}</span>
                                    <span style={styles.secretId}>#{secret.id}</span>
                                </div>

                                {isEditing ? (
                                    <>
                                        {kind === 'credential' && <EditCredential data={editData} onChange={setEditData} />}
                                        {kind === 'creditcard' && <EditCreditCard data={editData} onChange={setEditData} />}
                                        {kind === 'note' && <EditNote data={editData} onChange={setEditData} />}
                                        <div style={styles.actions}>
                                            <button style={styles.btnSave} onClick={() => handleEditSave(secret)}>💾 Speichern</button>
                                            <button style={styles.btnCancel} onClick={handleEditCancel}>✕ Abbrechen</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {kind === 'credential' && parsed && <CredentialCard data={parsed} />}
                                        {kind === 'creditcard' && parsed && <CreditCardCard data={parsed} />}
                                        {kind === 'note' && parsed && <NoteCard data={parsed} />}
                                        {!parsed && <pre style={styles.raw}>{secret.content}</pre>}
                                        <div style={styles.actions}>
                                            <button style={styles.btnEdit} onClick={() => handleEditStart(secret)}>✏️ Editieren</button>
                                            <button style={styles.btnDelete} onClick={() => handleDelete(secret.id)}>🗑️ Loschen</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const styles = {
    page: {padding: '1rem 2rem'},
    grid: {display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginTop: '1rem'},
    card: {
        borderRadius: '10px',
        padding: '1rem 1.2rem',
        minWidth: '280px',
        maxWidth: '360px',
        flex: '1 1 280px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardHeader: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem'},
    kindBadge: {fontWeight: 'bold', fontSize: '1rem'},
    secretId: {fontSize: '0.75rem', color: '#888'},
    field: {display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.9rem'},
    label: {minWidth: '100px', fontWeight: '600', color: '#555'},
    secret: {fontFamily: 'monospace', background: '#0001', borderRadius: '4px', padding: '1px 6px'},
    noteText: {whiteSpace: 'pre-wrap', color: '#333'},
    raw: {fontSize: '0.75rem', color: '#888'},
    actions: {display: 'flex', gap: '0.5rem', marginTop: '0.8rem'},
    btnEdit: {padding: '4px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #4a90d9', background: '#e8f4fd', color: '#4a90d9', fontWeight: 'bold'},
    btnDelete: {padding: '4px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #d94a4a', background: '#fde8e8', color: '#d94a4a', fontWeight: 'bold'},
    btnSave: {padding: '4px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #4a9d4a', background: '#e8fde8', color: '#2a7d2a', fontWeight: 'bold'},
    btnCancel: {padding: '4px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #aaa', background: '#f0f0f0', color: '#555'},
    error: {color: 'red'},
    empty: {color: '#888', marginTop: '1rem'},
    input: {flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem'},
};

export default Secrets;