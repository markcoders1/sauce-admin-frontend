import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Slice/UserSlice/UserSlice';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../LogoutConfirmationModal/LogoutConfirmationModal';
import logoutpng from '../../assets/logout.png';
import logoutHover from '../../assets/logoutHover.png';
import { Box, Typography } from '@mui/material';
import { toggleSidebar, closeSidebar } from '../../Redux/Slice/sidebarSlice/sidebarSlice';
import { useSelector } from 'react-redux';


const LogoutButton = ({ isSidebarOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isOpen = useSelector((state) => state.sidebar.isOpen)
    console.log("mobilesidebr",isOpen);


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
        dispatch(toggleSidebar())
        dispatch(closeSidebar()); 
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    '&:hover .logout-text': {
                        color: 'red', // Change text color on hover
                    },
            
                }}
                onClick={handleOpenModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box
                className=  "logout-text"
                    sx={{
                        border: "none",
                        outline: "none",
                        backgroundColor: "white",
                        marginTop: "5px",
                        height: "40px", 
                        width: "40px", 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        borderRadius: "50%", 
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.6)',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Box shadow on hover
                            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                        }
                    }}
                >
                    <img style={{width:"15px"}} src={isHovered ? logoutpng : logoutpng} alt="Logout" />
                </Box>
                {isSidebarOpen && (
                    <Typography
                        className="logout-text"
                        sx={{
                         fontSize: "18px", fontWeight: "600", fontFamily: "Montserrat !important",
                            ml: "10px",
                            transition: "color 0.3s ease",
                        }}
                    >
                        Logout
                    </Typography>
                )}
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
