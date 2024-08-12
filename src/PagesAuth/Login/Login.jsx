import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../firebase.config';
import axios from 'axios';
import axiosInstance from '../../Hooks/AuthHook/AuthHook';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in:', user);
            // Handle successful login, e.g., redirect or store user information

            try {
              // setLoading(true);
              const response = await axios({
                url: `https://aws.markcoders.com/sauced-backend/api/auth/firebase-authentication`,
                method: "post",
                data : {
                  accessToken : user.accessToken
                }, 
                headers: {
                  Authorization: `Bearer ${user.accessToken}`
              }
              });
              // setLoading(false);
            console.log(response)

            sessionStorage.setItem("accessToken", response.data.user.token)
            localStorage.setItem("accessToken", response.data.user.token)
           
            } catch (error) {
              console.error(error);
              
            }

          
        } catch (error) {
            setError(error.message);
            console.error('Error signing in:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{color:"black"}}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{color:"black"}}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Login;
