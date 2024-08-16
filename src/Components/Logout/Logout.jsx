import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Slice/UserSlice/UserSlice';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../LogoutConfirmationModal/LogoutConfirmationModal';
import logoutpng from '../../assets/logout.png';
import logoutHover from '../../assets/logoutHover.png';
import { Box } from '@mui/material';

const LogoutButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        dispatch(logout({
            accessToken: null,
            refreshToken: null,
            _id: null,
            username: null,
            email: null,
            createdAt: null,
            updatedAt: null,
            authenticated: false,
            type: null
        }));
        navigate("/");
        localStorage.removeItem("accessToken");
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <>
            <Box
                sx={{
                    border: "none", color: "red",
                    outline: "none",
                    backgroundColor: "transparent",
                    
                    marginTop: "5px",
                    backgroundColor:"white", cursor:"pointer", height:"50px", width:"50px", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", '&:hover': {
                      backgroundColor:'rgba(255, 0, 0, 0.6)',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Box shadow on hover
                      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    }
                }}
                onClick={handleOpenModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src={isHovered ? logoutHover : logoutpng} alt="Logout" />
            </Box>
            <LogoutConfirmationModal 
                open={modalOpen} 
                handleClose={handleCloseModal} 
                onLogoutConfirm={handleLogout} 
            />
        </>
    );
};

export default LogoutButton;
