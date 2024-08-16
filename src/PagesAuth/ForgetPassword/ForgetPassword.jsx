import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../../firebase.config';
import { Typography, Box } from '@mui/material';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState({});
    const [resetSuccess, setResetSuccess] = useState(false); // New state for successful reset
    const navigate = useNavigate();
    const [snackAlertData, setSnackAlertData] = useState({
        open: false,
        message: "",
        severity: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" }
    });

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        setError({});

        if (!email) {
            setError({ email: "Email is required" });
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setSnackAlertData({
                open: true,
                message: "Password reset email sent! Please check your inbox.",
                severity: "success"
            });
            setResetSuccess(true); // Set reset success to true

        } catch (error) {
            console.error('Error sending password reset email:', error);
            setSnackAlertData({
                open: true,
                message: "Failed to send password reset email. Please try again.",
                severity: "error"
            });
        }
    };

    const handleBackToLogin = () => {
        navigate('/'); // Navigate to login page
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
                    Forgot Password
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
                    {resetSuccess ? "":" Enter your email address to reset your password."}
                  
                </Typography>
            </Box>

            <form onSubmit={resetSuccess ? handleBackToLogin : handlePasswordReset}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: { sm: "30px", xs: "20px" }, marginTop: "20px" }}>
                    {!resetSuccess && (
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
                    )}

                    <Box sx={{ mt: { md: "80px", xs: "30px" } }}>
                        <CustomButton
                            border='1px solid #FFA100'
                            ButtonText={resetSuccess ? 'Back to Login' : 'Send Reset Link'}
                            color='white'
                            width={"100%"}
                            borderRadius='8px'
                            background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                            padding='16px 0px'
                            fontSize='18px'
                            fontWeight='600'
                            type="submit"
                            fullWidth={true}
                        />
                    </Box>
                </Box>
            </form>
            <SnackAlert
                severity={snackAlertData.severity}
                message={snackAlertData.message}
                open={snackAlertData.open}
                handleClose={() => { setSnackAlertData(prev => ({ ...prev, open: false })) }}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
            />
        </div>
    );
};

export default ForgotPassword;
