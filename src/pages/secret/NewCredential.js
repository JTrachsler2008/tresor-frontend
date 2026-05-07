import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";

/**
 * NewCredential
 * @author Peter Rutschmann
 */
function NewCredential({loginValues}) {
    const initialState = {kindid: 1, kind: "credential", userName: "", password: "", url: ""};
    const [values, setValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            await postSecret({loginValues, content: values});
            setValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.icon}>🔑</span>
                    <div>
                        <h2 style={styles.title}>Neues Credential</h2>
                        <p style={styles.subtitle}>Benutzername, Passwort und URL sicher speichern</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Benutzername</label>
                        <input style={styles.input} type="text" value={values.userName}
                               onChange={e => setValues(p => ({...p, userName: e.target.value}))}
                               required placeholder="max.mustermann" />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Passwort</label>
                        <input style={styles.input} type="text" value={values.password}
                               onChange={e => setValues(p => ({...p, password: e.target.value}))}
                               required placeholder="Passwort eingeben" />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>URL</label>
                        <input style={styles.input} type="text" value={values.url}
                               onChange={e => setValues(p => ({...p, url: e.target.value}))}
                               required placeholder="beispiel.ch" />
                    </div>

                    {errorMessage && <div style={styles.error}>{errorMessage}</div>}

                    <div style={styles.actions}>
                        <button type="submit" style={styles.btnPrimary}>💾 Speichern</button>
                        <button type="button" onClick={() => navigate('/secret/secrets')} style={styles.btnSecondary}>Abbrechen</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {display: 'flex', justifyContent: 'center', padding: '1rem'},
    card: {background: '#fff', border: '1px solid #e8eaf0', borderTop: '3px solid #4a7fd4', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)'},
    cardHeader: {display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.2rem', borderBottom: '1px solid #f0f2f8'},
    icon: {fontSize: '2.2rem'},
    title: {margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: '800', color: '#1a1a2e'},
    subtitle: {margin: 0, fontSize: '0.85rem', color: '#888'},
    field: {marginBottom: '1rem'},
    label: {display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#444', marginBottom: '0.4rem'},
    input: {width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1.5px solid #dde1f0', fontSize: '0.95rem', background: '#f8f9ff', boxSizing: 'border-box'},
    error: {background: '#fdeaea', border: '1px solid #f5a0a0', borderRadius: '8px', padding: '0.7rem 1rem', color: '#c0392b', fontSize: '0.88rem', marginBottom: '0.8rem'},
    actions: {display: 'flex', gap: '0.8rem', marginTop: '1.5rem'},
    btnPrimary: {padding: '0.7rem 1.5rem', background: '#4a7fd4', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'},
    btnSecondary: {padding: '0.7rem 1.2rem', background: 'none', border: '1.5px solid #dde1f0', borderRadius: '8px', color: '#555', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'},
};

export default NewCredential;