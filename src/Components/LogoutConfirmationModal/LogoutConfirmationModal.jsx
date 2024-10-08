import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CustomButton from '../CustomButton/CustomButton';

const LogoutConfirmationModal = ({ open, handleClose, onLogoutConfirm }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
            xs: "90%",
            md: "400px"
        },
        bgcolor: '#5A3D0A',
        boxShadow: 24,
        outline: "none",
        borderRadius: "20px",
        p: 4,
        border: "2px solid #FFA100"
    };

    return (
        <Modal
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography sx={{ fontWeight: "600", color: "white", fontSize: "24px", textAlign: "center" }}>
                        Logout Confirmation
                    </Typography>
                    <Typography sx={{ mt: 2, color: "white", textAlign: "center" }}>
                        Are you sure you want to logout?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: "1rem" }}>
                        <CustomButton
                            border="1px solid #FFA100"
                            borderRadius="10px"
                            background="#2e210a"
                            hoverBg="#FFA100"
                            hovercolor="#1A0049"
                            buttonStyle={{ padding: "10px 20px" }}
                            ButtonText="Confirm"
                            color={"white"}
                            onClick={onLogoutConfirm}
                        />
                        <CustomButton
                            border="1px solid #FFA100"
                            borderRadius="10px"
                            background="#2e210a"
                            hoverBg="#FFA100"
                            hovercolor="#1A0049"
                            buttonStyle={{ padding: "10px 20px" }}
                            ButtonText="Cancel"
                            color={"white"}
                            onClick={handleClose}
                        />
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default LogoutConfirmationModal;
