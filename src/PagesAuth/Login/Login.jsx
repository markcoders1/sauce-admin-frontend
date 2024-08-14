import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../firebase.config';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { handleAuth } from '../../Redux/Slice/UserSlice/UserSlice';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector(state => state.auth);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in:', user);

            try {
                const response = await axios({
                    url: `https://aws.markcoders.com/sauced-backend/api/auth/firebase-authentication`,
                    method: "post",
                    data: {
                        accessToken: user.accessToken
                    },
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });
                console.log(response);

                const userData = response.data.user;
                dispatch(handleAuth({
                    accessToken: userData.token,
                    refreshToken: userData.token,
                    _id: userData._id,
                    username: userData.name,
                    email: userData.email,
                    authenticated : true,
                    type : userData.type
                }))
                // dispatch(handleAuth({ ...userData, authenticated: true }));

                sessionStorage.setItem("accessToken", userData.token);
                localStorage.setItem("accessToken", userData.token);

                if (userData.type === "admin") {
                    navigate("/admin");
                }

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
            <Box>
                <Typography sx={{
                    color: "#FFA100",
                    fontWeight: "600",
                    fontSize: {
                        sm: "50px",
                        xs: "46px"
                    },
                    fontFamily: "Fira Sans !important",
                }}>
                    Sign in
                </Typography>

                <Typography sx={{
                    color: "white",
                    fontWeight: "500",
                    fontSize: {
                        sm: "16px",
                        xs: "16px"
                    },
                    fontFamily: "Montserrat !important",
                }}>
                    Welcome! Please sign in to continue.
                </Typography>
            </Box>

            <Box sx={{ mt: "40px" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Email
                        </Typography>
                        <CustomInputShadow
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            name="email"
                            error={error}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Password
                        </Typography>
                        <CustomInputShadow
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            name="password"
                            error={error}
                        />
                    </div>
                    <Typography sx={{
                        color: "#C1C1C1",
                        fontWeight: "500",
                        fontSize: {
                            sm: "14px",
                            xs: "14px"
                        },
                        textAlign: "end",
                        fontFamily: "Montserrat !important",
                    }}>
                        Forgot Password
                    </Typography>
                    <CustomButton
                        border='1px solid #FFA100'
                        ButtonText='Sign in'
                        color='white'
                        width={"178px"}
                        borderRadius='8px'
                        background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                        padding='10px 0px'
                        fontSize='18px'
                        fontWeight='600'
                        type="submit"
                    />
                </form>
            </Box>
        </div>
    );
};

export default Login;
