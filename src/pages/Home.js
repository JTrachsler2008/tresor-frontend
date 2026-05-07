import '../App.css';

/**
 * Home
 * @author Peter Rutschmann
 */
const Home = () => {
    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <div style={styles.iconWrap}>🔐</div>
                <h1 style={styles.title}>Tresor Application</h1>
                <p style={styles.subtitle}>Ihre sensiblen Daten — sicher verschlusselt gespeichert.</p>
            </div>

            <div style={styles.cards}>
                <div style={styles.card}>
                    <span style={styles.cardIcon}>🔑</span>
                    <h3 style={styles.cardTitle}>Credentials</h3>
                    <p style={styles.cardText}>Benutzernamen, Passworter und URLs sicher aufbewahren.</p>
                </div>
                <div style={styles.card}>
                    <span style={styles.cardIcon}>💳</span>
                    <h3 style={styles.cardTitle}>Kreditkarten</h3>
                    <p style={styles.cardText}>Kartendaten verschlusselt und jederzeit abrufbar.</p>
                </div>
                <div style={styles.card}>
                    <span style={styles.cardIcon}>📝</span>
                    <h3 style={styles.cardTitle}>Notizen</h3>
                    <p style={styles.cardText}>Geheime Notizen und Informationen privat speichern.</p>
                </div>
            </div>

            <div style={styles.infoBox}>
                <p style={styles.infoText}>
                    🛡️ Alle Secrets werden mit <strong>AES-256</strong> verschlusselt.
                    Ihr Login-Passwort dient als individueller Schlussel — nur Sie konnen Ihre Daten lesen.
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    hero: {
        textAlign: 'center',
        padding: '3rem 1rem 2rem',
    },
    iconWrap: {
        fontSize: '3.5rem',
        marginBottom: '0.5rem',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '800',
        margin: '0.5rem 0',
        color: '#1a1a2e',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#555',
        marginTop: '0.5rem',
    },
    cards: {
        display: 'flex',
        gap: '1.2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '2rem 0',
    },
    card: {
        background: '#f8f9ff',
        border: '1px solid #e0e4f0',
        borderRadius: '12px',
        padding: '1.5rem',
        flex: '1 1 220px',
        maxWidth: '260px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    cardIcon: {
        fontSize: '2rem',
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        margin: '0.7rem 0 0.4rem',
        color: '#1a1a2e',
    },
    cardText: {
        fontSize: '0.9rem',
        color: '#666',
        lineHeight: '1.5',
    },
    infoBox: {
        background: '#eef6ff',
        border: '1px solid #b3d4f5',
        borderRadius: '10px',
        padding: '1rem 1.5rem',
        marginTop: '1rem',
    },
    infoText: {
        fontSize: '0.95rem',
        color: '#2c5f8a',
        margin: 0,
        lineHeight: '1.6',
    },
};

export default Home;