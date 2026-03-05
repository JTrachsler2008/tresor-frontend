/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */

const getApiUrl = () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL;
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const path = process.env.REACT_APP_API_PATH;
    const portPart = port ? `:${port}` : '';
    return `${protocol}://${host}${portPart}${path}`;
};

export const getUsers = async () => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'User konnten nicht geladen werden.');
    }
    return await response.json();
};

export const getUserById = async (userId) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    });
    if (!response.ok) {
        throw new Error('User nicht gefunden.');
    }
    return await response.json();
};

export const putUser = async (userId, content) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            firstName: content.firstName,
            lastName: content.lastName,
            email: content.email,
            password: content.password || '',
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'User konnte nicht aktualisiert werden.');
    }
    return await response.json();
};

export const deleteUser = async (userId) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {'Accept': 'application/json'}
    });
    if (!response.ok) {
        throw new Error('User konnte nicht geloscht werden.');
    }
    return true;
};

export const postUser = async (content) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            firstName: content.firstName,
            lastName: content.lastName,
            email: content.email,
            password: content.password,
            passwordConfirmation: content.passwordConfirmation
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Backend gibt Validierungsfehler als Array zuruck
        if (Array.isArray(errorData.message)) {
            throw new Error(errorData.message.join(', '));
        }
        throw new Error(errorData.message || errorData.answer || 'Registrierung fehlgeschlagen.');
    }
    return await response.json();
};

export const postUserLogin = async (content) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: content.email,
            password: content.password
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login fehlgeschlagen.');
    }
    return await response.json();
};