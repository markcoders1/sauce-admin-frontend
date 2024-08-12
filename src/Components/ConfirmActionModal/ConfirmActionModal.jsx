import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CustomButton from '../CustomButton/CustomButton';
import SnackAlert from '../SnackAlert/SnackAlert';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const ConfirmActionModal = ({ open, handleClose, userId, action, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [snackAlertData, setSnackAlertData] = React.useState({
        message: "",
        severity: "success",
        open: false,
    });

    const handleConfirm = async () => {
        setSnackAlertData({
            open: false,
            message: "",
            severity: "success",
        });

        try {
            setLoading(true);
            const response = await axios({
                url: `https://sauced-backend.vercel.app/api/admin/block-unblock-user`,
                method: "post",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`
                },
                data: { 
                    userId: userId
                }
            });

            setLoading(false);
            if (response) {
                setSnackAlertData({
                    open: true,
                    message: response?.data?.message,
                    severity: "success",
                });
                onSuccess();
                handleClose();
            }

        } catch (error) {
            setLoading(false);
            setSnackAlertData({
                open: true,
                message: error.toString(),
                severity: "error",
            });
        }
    };

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
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                            {action === 'block' ? 'Block User' : 'Unblock User'}
                        </Typography>
                        <Typography sx={{ mt: 2, color: "white", textAlign: "center" }}>
                            Are you sure you want to {action} this user?
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CustomButton
                                loading={loading}
                                border="1px solid #FFA100"
                                borderRadius="10px"
                                background="#2e210a"
                                hoverBg="#FFA100"
                                hovercolor="#1A0049"
                                buttonStyle={{ padding: "10px 20px" }}
                                ButtonText="Confirm"
                                color={"white"}
                                onClick={handleConfirm}
                            />
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <SnackAlert
                message={snackAlertData.message}
                severity={snackAlertData.severity}
                open={snackAlertData.open}
                handleClose={() => { setSnackAlertData(prev => ({ ...prev, open: false })) }}
            />
        </>
    );
};

export default ConfirmActionModal;
