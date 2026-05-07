import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";

/**
 * NewCreditCard
 * @author Peter Rutschmann
 */
function NewCreditCard({loginValues}) {
    const initialState = {kindid: 2, kind: "creditcard", cardtype: "", cardnumber: "", expiration: "", cvv: ""};
    const [values, setValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            await postSecret({loginValues, content: values});
            setValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.icon}>💳</span>
                    <div>
                        <h2 style={styles.title}>Neue Kreditkarte</h2>
                        <p style={styles.subtitle}>Kartendaten verschlüsselt speichern</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Kartentyp</label>
                        <select style={styles.input} value={values.cardtype}
                                onChange={e => setValues(p => ({...p, cardtype: e.target.value}))} required>
                            <option value="" disabled>Kartentyp auswählen</option>
                            <option value="Visa">💳 Visa</option>
                            <option value="Mastercard">💳 Mastercard</option>
                        </select>
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Kartennummer</label>
                        <input style={styles.input} type="text" value={values.cardnumber}
                               onChange={e => setValues(p => ({...p, cardnumber: e.target.value}))}
                               required placeholder="1234 5678 9012 3456" maxLength="19" />
                    </div>
                    <div style={styles.row}>
                        <div style={{...styles.field, flex: 1}}>
                            <label style={styles.label}>Ablaufdatum (MM/JJ)</label>
                            <input style={styles.input} type="text" value={values.expiration}
                                   onChange={e => setValues(p => ({...p, expiration: e.target.value}))}
                                   required placeholder="12/28" maxLength="5" />
                        </div>
                        <div style={{...styles.field, flex: 1}}>
                            <label style={styles.label}>CVV</label>
                            <input style={styles.input} type="text" value={values.cvv}
                                   onChange={e => setValues(p => ({...p, cvv: e.target.value}))}
                                   required placeholder="123" maxLength="4" />
                        </div>
                    </div>

                    {errorMessage && <div style={styles.error}>{errorMessage}</div>}

                    <div style={styles.actions}>
                        <button type="submit" style={styles.btnPrimary}>💾 Speichern</button>
                        <button type="button" onClick={() => navigate('/secret/secrets')} style={styles.btnSecondary}>Abbrechen</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {display: 'flex', justifyContent: 'center', padding: '1rem'},
    card: {background: '#fff', border: '1px solid #e8eaf0', borderTop: '3px solid #d4924a', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)'},
    cardHeader: {display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.2rem', borderBottom: '1px solid #f0f2f8'},
    icon: {fontSize: '2.2rem'},
    title: {margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: '800', color: '#1a1a2e'},
    subtitle: {margin: 0, fontSize: '0.85rem', color: '#888'},
    field: {marginBottom: '1rem'},
    row: {display: 'flex', gap: '1rem'},
    label: {display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#444', marginBottom: '0.4rem'},
    input: {width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1.5px solid #dde1f0', fontSize: '0.95rem', background: '#f8f9ff', boxSizing: 'border-box'},
    error: {background: '#fdeaea', border: '1px solid #f5a0a0', borderRadius: '8px', padding: '0.7rem 1rem', color: '#c0392b', fontSize: '0.88rem', marginBottom: '0.8rem'},
    actions: {display: 'flex', gap: '0.8rem', marginTop: '1.5rem'},
    btnPrimary: {padding: '0.7rem 1.5rem', background: '#d4924a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'},
    btnSecondary: {padding: '0.7rem 1.2rem', background: 'none', border: '1.5px solid #dde1f0', borderRadius: '8px', color: '#555', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'},
};

export default NewCreditCard;