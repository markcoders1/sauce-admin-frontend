import { Box, Button, Typography, Checkbox } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import axios from 'axios';
import { signInWithGooglePopup } from "../../../firebase.config"; // Adjust the import according to your project structure
import CustomButton from "../../Components/CustomButton/CustomButton";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import LoaderW from "../../Components/Loader/LoaderW";
import GoogleIcon from '../../assets/images/googleIcon.png';
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { handleAuth } from "../../Redux/Slice/UserSlice/UserSlice"; // Ensure these paths are correct
import { handleSnackAlert } from "../../Redux/Slice/SnackAlertSlice/SnackAlertSlice";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const responseData = await signInWithGooglePopup();
      console.log("response data", responseData);
      const data = responseData.data;
      data.authenticated = true;

      dispatch(handleAuth(data));
      sessionStorage.setItem("accessToken", data?.accessToken);
      sessionStorage.setItem("refreshToken", data?.refreshToken);
      localStorage.setItem("accessToken", data?.accessToken);
      localStorage.setItem("refreshToken", data?.refreshToken);

      if (data.role === "admin") {
        navigate("/dashboard-admin");
      } else if (data.role === "user") {
        navigate("/dashboard");
      }

      dispatch(handleSnackAlert({ open: true, message: responseData.data.message, severity: "success" }));
    } catch (error) {
      console.error("Sign-in failed:", error);
      setSnackAlertData({
        open: true,
        message: error.response?.data?.message || 'Google Sign-In failed',
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  const handleInput = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({ password: "", email: "" });

    if (data?.email === "" && data?.password === "") {
      setIsLoading(false);
      return setErrors({ password: "Password cannot be empty", email: "Email cannot be empty" });
    }
    if (data?.email === "") {
      setIsLoading(false);
      return setErrors({ password: "", email: "Email cannot be empty" });
    }
    if (data?.password === "") {
      setIsLoading(false);
      return setErrors({ password: "Password cannot be empty", email: "" });
    }

    try {
      let response = await axios.post(`${appUrl}/login`, data);
      response = response.data;
      dispatch(handleAuth({ ...response, authenticated: true }));
      dispatch(handleSnackAlert({ open: true, message: response.message, severity: "success" }));

      setIsLoading(false);
      sessionStorage.setItem("accessToken", response?.accessToken);
      sessionStorage.setItem("refreshToken", response?.refreshToken);
      localStorage.setItem("accessToken", response?.accessToken);
      localStorage.setItem("refreshToken", response?.refreshToken);

      setData({ email: "", password: "" });

      navigate("/dashboard");
    } catch (error) {
      const errorData = error.response?.data || { message: 'Login failed' };
      if (errorData.errorType?.includes("email")) {
        setErrors({ password: "", email: errorData.message });
      }
      if (errorData.errorType?.includes("password")) {
        setErrors({ email: "", password: errorData.message });
      }
      setIsLoading(false);
      dispatch(handleSnackAlert({ open: true, message: errorData.message, severity: "error" }));
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0px",
        }}
      >
        <Typography sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Typography
            sx={{
              color: "#1B004D",
              lineHeight: "36.9px",
              fontSize: "50px",
              fontWeight: "600",
            }}
          >
            Sign in
          </Typography>
          <Typography
            sx={{
              color: "#A0A4A9",
              fontSize: "1rem",
              fontWeight: "400",
            }}
          >
            Welcome back! Please enter your details.
          </Typography>
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
          <Typography sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
            <label style={{ color: "#666666", fontWeight: "400" }}>Email</label>
            <CustomInputShadow
              border={true}
              ref={inputRef}
              handlekeydown={handleKeyDown}
              error={errors?.email}
              onChange={handleInput}
              name={"email"}
              value={data.email}
              rows={1}
            />
          </Typography>
          <Typography sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
            <label style={{ color: "#666666", fontWeight: "400" }}>Password</label>
            <CustomInputShadow
              border={true}
              handlekeydown={handleKeyDown}
              error={errors?.password}
              onChange={handleInput}
              name={"password"}
              type="password"
              value={data.password}
              rows={1}
              showPasswordToggle={true}
            />
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              sx={{
                color: blue[800], // set the color of the checkbox
                '&.Mui-checked': {
                  color: blue[900], // set the color when checked
                },
              }}
            />
            <Typography
              sx={{
                color: "#333333",
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              Remember Me
            </Typography>
          </Box>
          <Typography sx={{ color: "#333333", fontWeight: "400", cursor: "pointer" }}>
            <NavLink to="submit-email-for-otp">Forgot Password</NavLink>
          </Typography>
        </Box>
        <Box sx={{ position: "relative", marginTop: "80px", display: "flex", flexDirection: "column", gap: "1.56rem" }}>
          <Button
            sx={{
              p: "15px 20px",
              background: "linear-gradient(to right, #1A0049, #41016C)",
              width: "100%",
              height: "56px",
              borderRadius: "32px",
              fontSize: { xs: "14px", sm: "18px" },
              fontWeight: "500",
              textTransform: "none",
              transition: "background 0.9s ease, color 0.4s ease",
              "&:hover": {
                background: "linear-gradient(to right, #1G1947, #41016C)",
                color: "white",
              },
              boxShadow: "none",
            }}
            variant="contained"
            onClick={handleLogin}
          >
            {isLoading ? <LoaderW /> : "Sign in"}
          </Button>
          <Button
            sx={{
              p: "15px 20px",
              background: "white",
              width: "100%",
              height: "56px",
              borderRadius: "32px",
              fontSize: { xs: "14px", sm: "18px" },
              fontWeight: "500",
              textTransform: "none",
              transition: "background 0.9s ease, color 0.4s ease",
              "&:hover": {
                background: "linear-gradient(to right, #1A0049, #41016C)",
                color: "white",
              },
              boxShadow: "none",
              border: "1px solid grey",
              color: "black",
              mt: "150px",
            }}
            variant="contained"
            onClick={handleSignIn}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <img src={GoogleIcon} alt="Google Icon" style={{ height: "40px" }} />
              <span>Sign in With Google</span>
            </span>
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center", marginTop: "250px" }}>
          <Typography sx={{ fontSize: { xs: "12px", sm: "18px" }, color: "#A0A4A9" }}>Don’t have an account? </Typography>
          <Typography sx={{ color: "#1E004D", textDecoration: "underline" }}>
            <NavLink
              to='signup'
              style={{ color: "#1E004D", fontWeight: "600" }}
            >
              Sign Up
            </NavLink>
          </Typography>
        </Box>
      </Box>
      <SnackAlert
        severity={snackAlertData.severity}
        message={snackAlertData.message}
        open={snackAlertData.open}
        handleClose={() => { setSnackAlertData(prev => ({ ...prev, open: false })) }}
      />
    </Box>
  );
};

export default Login;
