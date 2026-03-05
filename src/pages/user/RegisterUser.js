import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (credentials.password !== credentials.passwordConfirmation) {
            setErrorMessage('Passwort und Passwort-Bestatigung stimmen nicht uberein.');
            return;
        }

        try {
            await postUser(credentials);
            setSuccessMessage('Registrierung erfolgreich! Du wirst zum Login weitergeleitet...');
            setCredentials(initialState);
            setTimeout(() => navigate('/user/login'), 1500);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Register user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Firstname:</label>
                            <input
                                type="text"
                                value={credentials.firstName}
                                onChange={(e) => setCredentials(prev => ({...prev, firstName: e.target.value}))}
                                required
                                placeholder="Please enter your firstname *"
                            />
                        </div>
                        <div>
                            <label>Lastname:</label>
                            <input
                                type="text"
                                value={credentials.lastName}
                                onChange={(e) => setCredentials(prev => ({...prev, lastName: e.target.value}))}
                                required
                                placeholder="Please enter your lastname *"
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={credentials.email}
                                onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                                required
                                placeholder="Please enter your email *"
                            />
                        </div>
                    </aside>
                    <aside>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                                required
                                placeholder="Please enter your pwd *"
                            />
                        </div>
                        <div>
                            <label>Password confirmation:</label>
                            <input
                                type="password"
                                value={credentials.passwordConfirmation}
                                onChange={(e) => setCredentials(prev => ({...prev, passwordConfirmation: e.target.value}))}
                                required
                                placeholder="Please confirm your pwd *"
                            />
                        </div>
                    </aside>
                </section>
                <button type="submit">Register</button>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;