import {Outlet, Link, useNavigate} from "react-router-dom";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = ({loginValues, setLoginValues}) => {
    const isLoggedIn = !!loginValues.userId;
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoginValues({email: '', password: '', userId: null});
        navigate('/');
    };

    return (
        <>
            <nav style={styles.nav}>
                <div style={styles.navLeft}>
                    <span style={styles.logo}>🔐</span>
                    <span style={styles.appName}>Tresor App</span>
                </div>

                {isLoggedIn && (
                    <div style={styles.userBadge}>
                        <span style={styles.userDot}></span>
                        <span>{loginValues.email}</span>
                    </div>
                )}

                <ul style={styles.navList}>
                    {isLoggedIn && (
                        <li style={styles.navItem}>
                            <span style={styles.navLink}>Secrets</span>
                            <ul style={styles.dropdown}>
                                <li><Link to="/secret/secrets" style={styles.dropLink}>🔐 Meine Secrets</Link></li>
                                <li><Link to="/secret/newcredential" style={styles.dropLink}>🔑 Credential</Link></li>
                                <li><Link to="/secret/newcreditcard" style={styles.dropLink}>💳 Kreditkarte</Link></li>
                                <li><Link to="/secret/newnote" style={styles.dropLink}>📝 Notiz</Link></li>
                            </ul>
                        </li>
                    )}
                    <li style={styles.navItem}>
                        <span style={styles.navLink}>User</span>
                        <ul style={styles.dropdown}>
                            {!isLoggedIn && <li><Link to="/user/register" style={styles.dropLink}>Registrieren</Link></li>}
                            {!isLoggedIn && <li><Link to="/user/login" style={styles.dropLink}>Einloggen</Link></li>}
                            {isLoggedIn && (
                                <li>
                                    <button onClick={handleLogout} style={styles.logoutBtn}>Ausloggen</button>
                                </li>
                            )}
                        </ul>
                    </li>
                    {isLoggedIn && (
                        <li style={styles.navItem}>
                            <span style={styles.navLink}>Admin</span>
                            <ul style={styles.dropdown}>
                                <li><Link to="/user/users" style={styles.dropLink}>👥 Alle User</Link></li>
                                <li><Link to="/user/add" style={styles.dropLink}>➕ User hinzufügen</Link></li>
                                <li><Link to="/secret/allsecrets" style={styles.dropLink}>🗄️ Alle Secrets</Link></li>
                            </ul>
                        </li>
                    )}
                    <li style={styles.navItem}>
                        <Link to="/" style={{...styles.navLink, color: '#4a7fd4', textDecoration: 'none'}}>About</Link>
                    </li>
                </ul>
            </nav>
            <div style={styles.divider}></div>
            <main style={styles.main}>
                <Outlet/>
            </main>
        </>
    );
};

const styles = {
    nav: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 2rem', background: '#fff', gap: '1rem', flexWrap: 'wrap'},
    navLeft: {display: 'flex', alignItems: 'center', gap: '0.5rem'},
    logo: {fontSize: '1.5rem'},
    appName: {fontSize: '1.3rem', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px'},
    userBadge: {display: 'flex', alignItems: 'center', gap: '6px', background: '#eef4ff', border: '1px solid #c8d8f5', borderRadius: '20px', padding: '4px 12px', fontSize: '0.82rem', color: '#4a7fd4', fontWeight: '500'},
    userDot: {width: '7px', height: '7px', borderRadius: '50%', background: '#4aad4a', display: 'inline-block'},
    navList: {display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '0.3rem', alignItems: 'center'},
    navItem: {position: 'relative', display: 'inline-block'},
    navLink: {fontWeight: '600', fontSize: '0.9rem', color: '#1a1a2e', cursor: 'pointer', padding: '0.4rem 0.7rem', borderRadius: '6px', display: 'inline-block'},
    dropdown: {display: 'none', position: 'absolute', top: '2rem', right: 0, background: '#fff', border: '1px solid #e8eaf0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '0.4rem', listStyle: 'none', minWidth: '180px', zIndex: 10},
    dropLink: {display: 'block', padding: '0.45rem 0.8rem', color: '#1a1a2e', textDecoration: 'none', fontWeight: '500', fontSize: '0.88rem', borderRadius: '6px', whiteSpace: 'nowrap'},
    logoutBtn: {background: 'none', border: 'none', color: '#d94a4a', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', padding: '0.45rem 0.8rem', width: '100%', textAlign: 'left', borderRadius: '6px'},
    divider: {height: '1px', background: '#eef0f5'},
    main: {maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem'},
};

const styleTag = document.createElement('style');
styleTag.innerHTML = `nav li:hover > ul { display: block !important; } nav a:hover { background: #f0f4ff; } nav button:hover { background: #fdeaea; }`;
document.head.appendChild(styleTag);

export default Layout;