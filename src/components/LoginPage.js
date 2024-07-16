import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';

const LoginPage = ({ handleSuccessfullLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginClick = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('handleLoginClick method called');

            // TODO: USED IT FOR TESTING WITHOUT BACKEND, REMOVE THIS ON LONG TERM
            // setTimeout(() => {
            //     console.log('handleLoginClick called');
            //     localStorage.setItem('authToken', "fakeToken"); // Store token in local storage
            // }, 1000);

            const response = await axios.post('http://localhost:8080/loginWithEmail', { email, password });
            console.log('Login endpoint response:', response.data);

            // Assuming the response contains a token
            const { token } = response.data;
            localStorage.setItem('authToken', token); // Store token in local storage

            // Send an event to App.js that login was successful and handle rest of the functionality in App.js
            handleSuccessfullLogin();
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError(error.response && error.response.data.message ? error.response.data.message : 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '400px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Login Page</h2>
                    <MDBInput 
                        wrapperClass='mb-4' 
                        placeholder='Email address' 
                        id='email' 
                        type='email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        aria-label="Email address"
                    />
                    <MDBInput 
                        wrapperClass='mb-4' 
                        placeholder='Password' 
                        id='password' 
                        type='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        aria-label="Password"
                    />
                    {error && <p className="text-danger">{error}</p>}
                    <button 
                        className="mb-4 d-block btn-primary" 
                        style={{ height: '50px', width: '100%' }} 
                        onClick={handleLoginClick} 
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <div className="text-center">
                        <p>Not a member? <Link to="/register">Register</Link></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export default LoginPage; 
