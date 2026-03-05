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
            <nav>
                <h1>The secret tresor application</h1>
                <p>{isLoggedIn ? 'user: ' + loginValues.email : 'No user logged in'}</p>
                <ul>
                    {isLoggedIn && (
                        <li><span>Secrets</span>
                            <ul>
                                <li><Link to="/secret/secrets">my secrets</Link></li>
                                <li><Link to="/secret/newcredential">new credential</Link></li>
                                <li><Link to="/secret/newcreditcard">new credit-card</Link></li>
                                <li><Link to="/secret/newnote">new note</Link></li>
                            </ul>
                        </li>
                    )}
                    <li><span>User</span>
                        <ul>
                            {!isLoggedIn && <li><Link to="/user/register">register</Link></li>}
                            {!isLoggedIn && <li><Link to="/user/login">login</Link></li>}
                            {isLoggedIn && (
                                <li>
                                    <button onClick={handleLogout} style={styles.logoutBtn}>logout</button>
                                </li>
                            )}
                        </ul>
                    </li>
                    {isLoggedIn && (
                        <li><span>Admin</span>
                            <ul>
                                <li><Link to="/user/users">All users</Link></li>
                                <li><Link to="/user/register">Add user</Link></li>
                                <li><Link to="/secret/allsecrets">All secrets</Link></li>
                            </ul>
                        </li>
                    )}
                    <li>
                        <Link to="/">About</Link>
                    </li>
                </ul>
            </nav>
            <hr/>
            <Outlet/>
        </>
    );
};

const styles = {
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#118bee',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'inherit',
        padding: 0,
        textDecoration: 'underline',
    }
};

export default Layout;