import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../firebase.config';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { handleAuth } from '../../Redux/Slice/UserSlice/UserSlice';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for the button
    const [error, setError] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const authState = useSelector(state => state.auth);
    const [snackAlertData, setSnackAlertData] = useState({
        open: false,
        message: "",
        severity: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" }
    });
    console.log(authState.authenticated)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError({});
        setLoading(true); // Set loading state to true when request starts

        // Custom validation
        let validationErrors = {};
        if (!email) validationErrors.email = "Email is required";
        if (!password) validationErrors.password = "Password is required";

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            setLoading(false); // Reset loading state if validation fails
            return;
        }

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
                console.log(response.data);

                const userData = response.data.user;
                dispatch(handleAuth({
                    accessToken: userData.token,
                    refreshToken: userData.token,
                    _id: userData._id,
                    username: userData.name,
                    email: userData.email,
                    authenticated: true,
                    type: userData.type
                }));

                sessionStorage.setItem("accessToken", userData.token);
                localStorage.setItem("accessToken", userData.token);

                if (userData.type === "admin") {
                    navigate("/admin");
                }

            } catch (error) {
                console.error(error);
                setSnackAlertData({
                    ...snackAlertData,
                    open: true,
                    message: "Invalid Login Credentials",
                    severity: "error"
                });
            }

        } catch (error) {
            console.error('Error signing in:', error);
            setSnackAlertData({
                ...snackAlertData,
                open: true,
                message: "Invalid Login Credentials",
                severity: "error"
            });
        } finally {
            setLoading(false); // Reset loading state after request completes
        }
    };

    const navigateToFP = () => {
        navigate('/forget-password')
    }

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

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: { sm: "30px", xs: "20px" }, marginTop: "20px" }}>
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
                            error={error.email}
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
                            error={error.password}
                        />
                    </div>
                    <Typography
                        sx={{
                            color: "#C1C1C1",
                            fontWeight: "500",
                            fontSize: {
                                sm: "14px",
                                xs: "14px"
                            },
                            textAlign: "end",
                            fontFamily: "Montserrat !important",
                            mt: "20px",
                            cursor: "pointer",
                            transition: "color 0.4s ease",
                            '&:hover': {
                                color: "#FFA100",
                            }
                        }}
                        onClick={navigateToFP}
                    >
                        Forgot Password
                    </Typography>

                    <Box
                        sx={{
                            mt: {
                                md: "80px",
                                xs: "30px"
                            }
                        }}
                    >
                        <CustomButton
                            border='1px solid #FFA100'
                            ButtonText={loading ? 'Signing in...' : 'Sign in'}
                            color={loading ? '#FFA100' : 'white'}
                            width={"100%"}
                            borderRadius='8px'
                            background={loading ? 'linear-gradient(90deg, #2E210A 0%, #5A3D0A 100%)' : 'linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'}
                            padding='16px 0px'
                            fontSize='18px'
                            fontWeight='600'
                            type="submit"
                            fullWidth={true}
                            disabled={loading} // Disable the button while loading
                        />
                    </Box>
                </Box>
            </form>
            <SnackAlert
                severity={snackAlertData.severity}
                message={snackAlertData.message}
                open={snackAlertData.open}
                handleClose={() => { setSnackAlertData(prev => ({ ...prev, open: false })) }}
                anchorOrigin={{ vertical: "top", horizontal: "left" }} // Custom position for login page
            />
        </div>
    );
};

export default Login;
