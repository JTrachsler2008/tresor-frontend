/**
 * Fetch methodes for secret api calls
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

export const postSecret = async ({loginValues, content}) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/secrets`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: loginValues.email,
            encryptPassword: loginValues.password,
            content: content
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Secret konnte nicht gespeichert werden.');
    }
    return await response.json();
};

export const updateSecret = async ({secretId, loginValues, content}) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/secrets/${secretId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: loginValues.email,
            encryptPassword: loginValues.password,
            content: content
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Secret konnte nicht aktualisiert werden.');
    }
    return await response.json();
};

export const deleteSecret = async (secretId) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/secrets/${secretId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    });
    if (!response.ok) {
        throw new Error('Secret konnte nicht geloscht werden.');
    }
    return true;
};
export const getSecretsforUser = async (loginValues) => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/secrets/byemail`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: loginValues.email,
            encryptPassword: loginValues.password
        })
    });
    // 404 = keine Secrets vorhanden -> leere Liste zuruckgeben, kein Fehler
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Secrets konnten nicht geladen werden.');
    }
    return await response.json();
};

export const getAllSecrets = async () => {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/secrets`, {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    });
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new Error('Secrets konnten nicht geladen werden.');
    }
    return await response.json();
};