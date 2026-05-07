import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";

/**
 * AddUser
 * Admin-Seite zum Hinzufügen eines neuen Users
 * @author Peter Rutschmann
 */
function AddUser({loginValues}) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    };
    const [formData, setFormData] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.password !== formData.passwordConfirmation) {
            setErrorMessage('Passwort und Passwort-Bestätigung stimmen nicht überein.');
            return;
        }

        try {
            await postUser(formData);
            setSuccessMessage(`User "${formData.email}" wurde erfolgreich erstellt.`);
            setFormData(initialState);
            setTimeout(() => navigate('/user/users'), 1500);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={() => navigate('/user/users')} style={styles.backBtn}>
                    ← Zurück
                </button>
                <h2 style={styles.title}>👤 Neuen User hinzufügen</h2>
            </div>

            <div style={styles.card}>
                <form onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Persönliche Daten</h3>
                            <div style={styles.field}>
                                <label style={styles.label}>Vorname</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                                    required
                                    placeholder="Max"
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Nachname</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                                    required
                                    placeholder="Mustermann"
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>E-Mail</label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                                    required
                                    placeholder="max@beispiel.ch"
                                />
                            </div>
                        </div>

                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Passwort</h3>
                            <div style={styles.field}>
                                <label style={styles.label}>Passwort</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Passwort bestätigen</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    value={formData.passwordConfirmation}
                                    onChange={(e) => setFormData(prev => ({...prev, passwordConfirmation: e.target.value}))}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={styles.infoBox}>
                                <p style={styles.infoText}>
                                    🔒 Das Passwort wird mit BCrypt + Salt & Pepper gehasht gespeichert.
                                </p>
                            </div>
                        </div>
                    </div>

                    {errorMessage && <div style={styles.error}>{errorMessage}</div>}
                    {successMessage && <div style={styles.success}>{successMessage}</div>}

                    <div style={styles.actions}>
                        <button type="submit" style={styles.btnSave}>
                            ✓ User erstellen
                        </button>
                        <button type="button" onClick={() => navigate('/user/users')} style={styles.btnCancel}>
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {maxWidth: '800px', margin: '0 auto'},
    header: {display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'},
    backBtn: {background: 'none', border: '1.5px solid #dde1f0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.9rem', color: '#555', fontWeight: '600'},
    title: {margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e'},
    card: {background: '#fff', border: '1px solid #e8eaf0', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)'},
    grid: {display: 'flex', gap: '2rem', flexWrap: 'wrap'},
    section: {flex: '1 1 280px'},
    sectionTitle: {fontSize: '0.95rem', fontWeight: '700', color: '#4a7fd4', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.5px'},
    field: {marginBottom: '1rem'},
    label: {display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#444', marginBottom: '0.4rem'},
    input: {width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1.5px solid #dde1f0', fontSize: '0.95rem', background: '#f8f9ff', boxSizing: 'border-box'},
    infoBox: {background: '#eef6ff', border: '1px solid #b3d4f5', borderRadius: '8px', padding: '0.7rem 1rem', marginTop: '1rem'},
    infoText: {margin: 0, fontSize: '0.82rem', color: '#2c5f8a', lineHeight: '1.5'},
    error: {background: '#fdeaea', border: '1px solid #f5a0a0', borderRadius: '8px', padding: '0.7rem 1rem', color: '#c0392b', fontSize: '0.88rem', marginTop: '1rem'},
    success: {background: '#efffee', border: '1px solid #a0d4a0', borderRadius: '8px', padding: '0.7rem 1rem', color: '#2a7d2a', fontSize: '0.88rem', marginTop: '1rem'},
    actions: {display: 'flex', gap: '0.8rem', marginTop: '1.5rem'},
    btnSave: {padding: '0.7rem 1.5rem', background: '#4a7fd4', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'},
    btnCancel: {padding: '0.7rem 1.5rem', background: 'none', color: '#555', border: '1.5px solid #dde1f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'},
};

export default AddUser;