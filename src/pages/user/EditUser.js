import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getUserById, putUser} from '../../comunication/FetchUser';

/**
 * EditUser
 * @author Peter Rutschmann
 */
function EditUser({loginValues}) {
    const {id} = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(id);
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                });
            } catch (error) {
                setErrorMessage('User konnte nicht geladen werden: ' + error.message);
            }
        };
        if (id) fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            await putUser(id, formData);
            setSuccessMessage('User erfolgreich aktualisiert.');
            setTimeout(() => navigate('/user/users'), 1000);
        } catch (error) {
            setErrorMessage('Fehler: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Edit user #{id}</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Firstname:</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                                required
                                placeholder="Firstname"
                            />
                        </div>
                        <div>
                            <label>Lastname:</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                                required
                                placeholder="Lastname"
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                                required
                                placeholder="Email"
                            />
                        </div>
                    </aside>
                </section>
                <button type="submit">Speichern</button>
                <button type="button" onClick={() => navigate('/user/users')} style={{marginLeft: '1rem'}}>
                    Abbrechen
                </button>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
            </form>
        </div>
    );
}

export default EditUser;
