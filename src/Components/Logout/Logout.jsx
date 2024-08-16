import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/Slice/UserSlice/UserSlice';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../LogoutConfirmationModal/LogoutConfirmationModal';
import logoutpng from '../../assets/logout.png';

const LogoutButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);

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
            <button
                style={{
                    border: "none", color: "red",
                    outline: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    marginTop: "5px"
                }}
                onClick={handleOpenModal}
            >
                <img src={logoutpng} alt="Logout" />
            </button>
            <LogoutConfirmationModal 
                open={modalOpen} 
                handleClose={handleCloseModal} 
                onLogoutConfirm={handleLogout} 
            />
        </>
    );
};

export default LogoutButton;
