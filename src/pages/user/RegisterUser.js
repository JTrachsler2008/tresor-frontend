import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const initialState = {firstName: "", lastName: "", email: "", password: "", passwordConfirmation: ""};
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (credentials.password !== credentials.passwordConfirmation) {
            setErrorMessage('Passwort und Bestätigung stimmen nicht überein.');
            return;
        }
        try {
            await postUser(credentials);
            setSuccessMessage('Registrierung erfolgreich! Weiterleitung zum Login...');
            setCredentials(initialState);
            setTimeout(() => navigate('/user/login'), 1500);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.icon}>👤</span>
                    <div>
                        <h2 style={styles.title}>Konto erstellen</h2>
                        <p style={styles.subtitle}>Registrieren Sie sich um Ihre Secrets zu verwalten</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        <div style={styles.section}>
                            <p style={styles.sectionLabel}>PERSÖNLICHE DATEN</p>
                            <Field label="Vorname" value={credentials.firstName} placeholder="Max"
                                   onChange={v => setCredentials(p => ({...p, firstName: v}))} />
                            <Field label="Nachname" value={credentials.lastName} placeholder="Mustermann"
                                   onChange={v => setCredentials(p => ({...p, lastName: v}))} />
                            <Field label="E-Mail" value={credentials.email} placeholder="max@beispiel.ch" type="email"
                                   onChange={v => setCredentials(p => ({...p, email: v}))} />
                        </div>
                        <div style={styles.section}>
                            <p style={styles.sectionLabel}>SICHERHEIT</p>
                            <Field label="Passwort" value={credentials.password} placeholder="••••••••" type="password"
                                   onChange={v => setCredentials(p => ({...p, password: v}))} />
                            <Field label="Passwort bestätigen" value={credentials.passwordConfirmation} placeholder="••••••••" type="password"
                                   onChange={v => setCredentials(p => ({...p, passwordConfirmation: v}))} />
                            <div style={styles.infoBox}>
                                <span style={styles.infoText}>🔒 Ihr Passwort wird mit BCrypt + Salt & Pepper gesichert gespeichert.</span>
                            </div>
                        </div>
                    </div>

                    {errorMessage && <div style={styles.error}>{errorMessage}</div>}
                    {successMessage && <div style={styles.success}>{successMessage}</div>}

                    <div style={styles.actions}>
                        <button type="submit" style={styles.btnPrimary}>✓ Registrieren</button>
                        <button type="button" onClick={() => navigate('/user/login')} style={styles.btnSecondary}>
                            Bereits registriert? Einloggen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Field = ({label, value, onChange, placeholder, type = "text"}) => (
    <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <input style={styles.input} type={type} value={value}
               onChange={e => onChange(e.target.value)} required placeholder={placeholder} />
    </div>
);

const styles = {
    page: {display: 'flex', justifyContent: 'center', padding: '1rem'},
    card: {background: '#fff', border: '1px solid #e8eaf0', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '750px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)'},
    cardHeader: {display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0f2f8'},
    icon: {fontSize: '2.5rem'},
    title: {margin: '0 0 0.2rem', fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e'},
    subtitle: {margin: 0, fontSize: '0.88rem', color: '#888'},
    grid: {display: 'flex', gap: '2rem', flexWrap: 'wrap'},
    section: {flex: '1 1 280px'},
    sectionLabel: {fontSize: '0.75rem', fontWeight: '700', color: '#4a7fd4', letterSpacing: '0.8px', margin: '0 0 1rem'},
    field: {marginBottom: '1rem'},
    label: {display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#444', marginBottom: '0.4rem'},
    input: {width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1.5px solid #dde1f0', fontSize: '0.95rem', background: '#f8f9ff', boxSizing: 'border-box'},
    infoBox: {background: '#eef6ff', border: '1px solid #b3d4f5', borderRadius: '8px', padding: '0.7rem 1rem', marginTop: '0.5rem'},
    infoText: {fontSize: '0.82rem', color: '#2c5f8a', lineHeight: '1.5'},
    error: {background: '#fdeaea', border: '1px solid #f5a0a0', borderRadius: '8px', padding: '0.7rem 1rem', color: '#c0392b', fontSize: '0.88rem', marginTop: '1rem'},
    success: {background: '#efffee', border: '1px solid #a0d4a0', borderRadius: '8px', padding: '0.7rem 1rem', color: '#2a7d2a', fontSize: '0.88rem', marginTop: '1rem'},
    actions: {display: 'flex', gap: '0.8rem', marginTop: '1.5rem', alignItems: 'center', flexWrap: 'wrap'},
    btnPrimary: {padding: '0.7rem 1.5rem', background: '#4a7fd4', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'},
    btnSecondary: {background: 'none', border: 'none', color: '#4a7fd4', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', padding: '0.7rem 0'},
};

export default RegisterUser;