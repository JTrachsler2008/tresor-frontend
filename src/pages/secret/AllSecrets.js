import '../../App.css';
import React, {useEffect, useState} from 'react';
import {getAllSecrets, deleteSecret} from '../../comunication/FetchSecrets';

/**
 * AllSecrets
 * Admin-Ansicht: alle Secrets aller User (verschlusselt).
 * @author Peter Rutschmann
 */
const AllSecrets = ({loginValues}) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAll = async () => {
        try {
            const data = await getAllSecrets();
            setSecrets(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleDelete = async (secretId) => {
        if (!window.confirm(`Secret #${secretId} wirklich loschen?`)) return;
        try {
            await deleteSecret(secretId);
            setSecrets(prev => prev.filter(s => s.id !== secretId));
        } catch (error) {
            setErrorMessage('Loschen fehlgeschlagen: ' + error.message);
        }
    };

    return (
        <>
            <h1>All Secrets (Admin)</h1>
            <p style={{color: '#888', fontSize: '0.85rem'}}>
                Inhalt ist verschlusselt — nur der jeweilige User kann entschlusseln.
            </p>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            {secrets.length === 0 ? (
                <p>Keine Secrets gefunden.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User ID</th>
                            <th>Encrypted Content</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {secrets.map(secret => (
                            <tr key={secret.id}>
                                <td>{secret.id}</td>
                                <td>{secret.userId}</td>
                                <td style={{fontFamily: 'monospace', fontSize: '0.7rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                    {secret.content}
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(secret.id)} style={styles.btnDelete}>
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
    btnDelete: {padding: '3px 10px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #d94a4a', background: '#fde8e8', color: '#d94a4a', fontWeight: 'bold'},
};

export default AllSecrets;
