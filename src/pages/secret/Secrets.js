import '../../App.css';
import React, {useEffect, useState} from 'react';
import {getSecretsforUser, deleteSecret, updateSecret} from "../../comunication/FetchSecrets";

/**
 * Secrets
 * @author Peter Rutschmann
 */

const KIND_META = {
    credential: {label: 'Credential', icon: '🔑', color: '#eef4ff', border: '#4a7fd4'},
    creditcard: {label: 'Kreditkarte', icon: '💳', color: '#fff8ee', border: '#d4924a'},
    note:       {label: 'Notiz',       icon: '📝', color: '#efffee', border: '#4aad4a'},
};

const getKind = (content) => {
    try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        return parsed?.kind || 'unknown';
    } catch { return 'unknown'; }
};

const parseContent = (content) => {
    try {
        return typeof content === 'string' ? JSON.parse(content) : content;
    } catch { return null; }
};

const CredentialCard = ({data}) => (
    <div style={styles.fields}>
        <Row label="Benutzername" value={data.userName} />
        <Row label="Passwort" value={data.password} secret />
        <Row label="URL" value={data.url} link />
    </div>
);

const CreditCardCard = ({data}) => (
    <div style={styles.fields}>
        <Row label="Kartentyp" value={data.cardtype} />
        <Row label="Kartennummer" value={data.cardnumber} secret />
        <Row label="Ablaufdatum" value={data.expiration} />
        <Row label="CVV" value={data.cvv} secret />
    </div>
);

const NoteCard = ({data}) => (
    <div style={styles.fields}>
        <Row label="Titel" value={data.title} />
        <div style={{...styles.row, alignItems: 'flex-start'}}>
            <span style={styles.label}>Inhalt</span>
            <span style={styles.noteText}>{data.content}</span>
        </div>
    </div>
);

const Row = ({label, value, secret, link}) => (
    <div style={styles.row}>
        <span style={styles.label}>{label}</span>
        {link
            ? <a href={value?.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" style={styles.link}>{value}</a>
            : <span style={secret ? styles.secretVal : styles.value}>{value}</span>
        }
    </div>
);

const EditCredential = ({data, onChange}) => (
    <div style={styles.fields}>
        <EditRow label="Benutzername" value={data.userName} onChange={v => onChange({...data, userName: v})} />
        <EditRow label="Passwort" value={data.password} onChange={v => onChange({...data, password: v})} />
        <EditRow label="URL" value={data.url} onChange={v => onChange({...data, url: v})} />
    </div>
);

const EditCreditCard = ({data, onChange}) => (
    <div style={styles.fields}>
        <div style={styles.row}>
            <span style={styles.label}>Kartentyp</span>
            <select style={styles.input} value={data.cardtype} onChange={e => onChange({...data, cardtype: e.target.value})}>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
            </select>
        </div>
        <EditRow label="Kartennummer" value={data.cardnumber} onChange={v => onChange({...data, cardnumber: v})} />
        <EditRow label="Ablaufdatum" value={data.expiration} onChange={v => onChange({...data, expiration: v})} />
        <EditRow label="CVV" value={data.cvv} onChange={v => onChange({...data, cvv: v})} />
    </div>
);

const EditNote = ({data, onChange}) => (
    <div style={styles.fields}>
        <EditRow label="Titel" value={data.title} onChange={v => onChange({...data, title: v})} />
        <div style={{...styles.row, alignItems: 'flex-start'}}>
            <span style={styles.label}>Inhalt</span>
            <textarea style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                      value={data.content} onChange={e => onChange({...data, content: e.target.value})} />
        </div>
    </div>
);

const EditRow = ({label, value, onChange}) => (
    <div style={styles.row}>
        <span style={styles.label}>{label}</span>
        <input style={styles.input} value={value} onChange={e => onChange(e.target.value)} />
    </div>
);

const Secrets = ({loginValues}) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);

    const fetchSecrets = async () => {
        setErrorMessage('');
        if (!loginValues.email) { setErrorMessage('Bitte zuerst einloggen.'); return; }
        try {
            const data = await getSecretsforUser(loginValues);
            setSecrets(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => { fetchSecrets(); }, [loginValues]);

    const handleDelete = async (secretId) => {
        if (!window.confirm('Secret wirklich loschen?')) return;
        try {
            await deleteSecret(secretId);
            setSecrets(prev => prev.filter(s => s.id !== secretId));
        } catch (error) { setErrorMessage(error.message); }
    };

    const handleEditStart = (secret) => {
        setEditingId(secret.id);
        setEditData(parseContent(secret.content));
    };

    const handleEditSave = async (secret) => {
        try {
            await updateSecret({secretId: secret.id, loginValues, content: editData});
            setEditingId(null);
            setEditData(null);
            await fetchSecrets();
        } catch (error) { setErrorMessage(error.message); }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>🔐 Meine Secrets</h1>
                <span style={styles.count}>{secrets.length} Secret{secrets.length !== 1 ? 's' : ''}</span>
            </div>

            {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

            {secrets.length === 0 && !errorMessage ? (
                <div style={styles.emptyBox}>
                    <p style={styles.emptyText}>🔒 Noch keine Secrets vorhanden.</p>
                    <p style={styles.emptyHint}>Erstellen Sie ein neues Secret uber das Menu oben.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {secrets.map(secret => {
                        const kind = getKind(secret.content);
                        const meta = KIND_META[kind] || {label: kind, icon: '❓', color: '#f5f5f5', border: '#aaa'};
                        const parsed = parseContent(secret.content);
                        const isEditing = editingId === secret.id;

                        return (
                            <div key={secret.id} style={{
                                ...styles.card,
                                background: meta.color,
                                borderTop: `3px solid ${meta.border}`,
                            }}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.kindBadge}>
                                        <span style={{...styles.kindDot, background: meta.border}}></span>
                                        <span style={styles.kindIcon}>{meta.icon}</span>
                                        <span style={styles.kindLabel}>{meta.label}</span>
                                    </div>
                                    <span style={styles.secretId}>#{secret.id}</span>
                                </div>

                                <div style={styles.divider}></div>

                                {isEditing ? (
                                    <>
                                        {kind === 'credential' && <EditCredential data={editData} onChange={setEditData} />}
                                        {kind === 'creditcard' && <EditCreditCard data={editData} onChange={setEditData} />}
                                        {kind === 'note' && <EditNote data={editData} onChange={setEditData} />}
                                        <div style={styles.actions}>
                                            <button style={styles.btnSave} onClick={() => handleEditSave(secret)}>💾 Speichern</button>
                                            <button style={styles.btnCancel} onClick={() => { setEditingId(null); setEditData(null); }}>✕ Abbrechen</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {kind === 'credential' && parsed && <CredentialCard data={parsed} />}
                                        {kind === 'creditcard' && parsed && <CreditCardCard data={parsed} />}
                                        {kind === 'note' && parsed && <NoteCard data={parsed} />}
                                        {!parsed && <p style={{color: '#888', fontSize: '0.85rem'}}>{secret.content}</p>}
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

const styles = {
    page: {padding: '1.5rem 2rem', maxWidth: '1100px', margin: '0 auto'},
    header: {display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'},
    title: {margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e'},
    count: {background: '#e8eeff', color: '#4a7fd4', borderRadius: '20px', padding: '3px 12px', fontSize: '0.85rem', fontWeight: '600'},
    grid: {display: 'flex', flexWrap: 'wrap', gap: '1.2rem'},
    card: {borderRadius: '12px', padding: '1.2rem', minWidth: '280px', maxWidth: '340px', flex: '1 1 280px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)'},
    cardHeader: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem'},
    kindBadge: {display: 'flex', alignItems: 'center', gap: '6px'},
    kindDot: {width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block'},
    kindIcon: {fontSize: '1rem'},
    kindLabel: {fontWeight: '700', fontSize: '0.95rem', color: '#1a1a2e'},
    secretId: {fontSize: '0.75rem', color: '#aaa', fontWeight: '500'},
    divider: {height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0.6rem 0'},
    fields: {display: 'flex', flexDirection: 'column', gap: '0.4rem'},
    row: {display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'},
    label: {minWidth: '110px', fontWeight: '600', color: '#666', fontSize: '0.85rem'},
    value: {color: '#1a1a2e'},
    secretVal: {fontFamily: 'monospace', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', padding: '1px 8px', fontSize: '0.85rem'},
    noteText: {whiteSpace: 'pre-wrap', color: '#333', lineHeight: '1.5'},
    link: {color: '#4a7fd4', fontWeight: '500', fontSize: '0.9rem'},
    actions: {display: 'flex', gap: '0.5rem', marginTop: '1rem'},
    btnEdit: {padding: '5px 14px', cursor: 'pointer', borderRadius: '7px', border: '1.5px solid #4a7fd4', background: '#eef4ff', color: '#4a7fd4', fontWeight: '600', fontSize: '0.85rem'},
    btnDelete: {padding: '5px 14px', cursor: 'pointer', borderRadius: '7px', border: '1.5px solid #d94a4a', background: '#fdeaea', color: '#d94a4a', fontWeight: '600', fontSize: '0.85rem'},
    btnSave: {padding: '5px 14px', cursor: 'pointer', borderRadius: '7px', border: '1.5px solid #4aad4a', background: '#efffee', color: '#2a7d2a', fontWeight: '600', fontSize: '0.85rem'},
    btnCancel: {padding: '5px 14px', cursor: 'pointer', borderRadius: '7px', border: '1.5px solid #aaa', background: '#f5f5f5', color: '#555', fontSize: '0.85rem'},
    input: {flex: 1, padding: '5px 8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem'},
    errorBox: {background: '#fdeaea', border: '1px solid #f5a0a0', borderRadius: '8px', padding: '0.8rem 1rem', color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem'},
    emptyBox: {background: '#f8f9ff', border: '1px dashed #c0c8e0', borderRadius: '12px', padding: '3rem', textAlign: 'center'},
    emptyText: {fontSize: '1.1rem', color: '#555', margin: '0 0 0.5rem'},
    emptyHint: {fontSize: '0.9rem', color: '#888', margin: 0},
};

export default Secrets;