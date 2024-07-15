import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/loginWithEmail', { email, password });
            console.log('Login successful:', response.data);

            // Assuming the response contains a token
            const { token } = response.data;
            localStorage.setItem('authToken', token); // Store token in local storage

            navigate('/home'); // Navigate to home page after successful login
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
                        onClick={handleLogin} 
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
