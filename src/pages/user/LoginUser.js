import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import {postUserLogin} from "../../comunication/FetchUser";

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const data = await postUserLogin(loginValues);
            setLoginValues(prev => ({...prev, userId: data.userId}));
            navigate('/');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.iconWrap}>🔐</div>
                <h2 style={styles.title}>Willkommen zuruck</h2>
                <p style={styles.subtitle}>Melden Sie sich an um Ihre Secrets zu verwalten</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>E-Mail</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={loginValues.email}
                            onChange={(e) => setLoginValues(prev => ({...prev, email: e.target.value}))}
                            required
                            placeholder="ihre@email.com"
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Passwort</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={loginValues.password}
                            onChange={(e) => setLoginValues(prev => ({...prev, password: e.target.value}))}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    {errorMessage && <div style={styles.error}>{errorMessage}</div>}
                    <button type="submit" style={styles.btn}>Einloggen →</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {display: 'flex', justifyContent: 'center', padding: '3rem 1rem'},
    card: {
        background: '#fff',
        border: '1px solid #e8eaf0',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
    },
    iconWrap: {fontSize: '2.5rem', marginBottom: '0.5rem'},
    title: {fontSize: '1.6rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 0.3rem'},
    subtitle: {fontSize: '0.9rem', color: '#888', margin: '0 0 1.5rem'},
    form: {textAlign: 'left'},
    field: {marginBottom: '1rem'},
    label: {display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#444', marginBottom: '0.4rem'},
    input: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
        border: '1.5px solid #dde1f0',
        fontSize: '0.95rem',
        outline: 'none',
        boxSizing: 'border-box',
        background: '#f8f9ff',
    },
    btn: {
        width: '100%',
        padding: '0.75rem',
        background: '#4a7fd4',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    error: {
        background: '#fdeaea',
        border: '1px solid #f5a0a0',
        borderRadius: '7px',
        padding: '0.6rem 0.9rem',
        color: '#c0392b',
        fontSize: '0.875rem',
        marginBottom: '0.8rem',
    },
};

export default LoginUser;