import '../../App.css';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUsers, deleteUser} from "../../comunication/FetchUser";

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = ({loginValues}) => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [loginValues]);

    const handleDelete = async (userId) => {
        if (!window.confirm(`User #${userId} wirklich loschen?`)) return;
        try {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            setErrorMessage('Loschen fehlgeschlagen: ' + error.message);
        }
    };

    return (
        <>
            <h1>Client list</h1>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            {users.length === 0 ? (
                <p>Keine User gefunden.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password Hash</th>
                        <th>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td style={{fontFamily: 'monospace', fontSize: '0.7rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                {user.password}
                            </td>
                            <td>
                                <button onClick={() => navigate(`/user/edit/${user.id}`)} style={styles.btnEdit}>
                                    Editieren
                                </button>
                                <button onClick={() => handleDelete(user.id)} style={styles.btnDelete}>
                                    Loschen
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

const styles = {
    btnEdit: {marginRight: '6px', padding: '3px 10px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #4a90d9', background: '#e8f4fd', color: '#4a90d9', fontWeight: 'bold'},
    btnDelete: {padding: '3px 10px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #d94a4a', background: '#fde8e8', color: '#d94a4a', fontWeight: 'bold'},
};

export default Users;