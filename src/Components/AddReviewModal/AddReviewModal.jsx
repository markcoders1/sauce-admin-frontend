import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CustomInputShadow from '../CustomInput/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../SnackAlert/SnackAlert';
import { useSelector } from 'react-redux';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddReviewModal = ({ open, handleClose, onSuccess }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackAlertData, setSnackAlertData] = useState({
        message: "",
        severity: "success",
        open: false,
    });

    const auth = useSelector(state => state.auth);

    const handleSubmit = async () => {
        if (!url) {
            setSnackAlertData({
                message: "URL is required",
                severity: "error",
                open: true,
            });
            return;
        }

        try {
            setLoading(true);

            const response = await axios({
                url: `${appUrl}/admin/create-official-review`,
                method: "post",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                data: { url : url, sauceId : "66d0b9ce5931c1508238f0a7" },
            });

            console.log(response)

            setLoading(false);
            setSnackAlertData({
                message: response.data.message || "Review created successfully",
                severity: "success",
                open: true,
            });
            onSuccess(); // Refresh the reviews list
            handleClose();
        } catch (error) {
            setLoading(false);
            setSnackAlertData({
                message: error.response?.data?.message || "Failed to create review",
                severity: "error",
                open: true,
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
                        <Typography sx={{ fontWeight: "600", color: "white", fontSize: "24px", textAlign: "center" , mb:"30px"}}>
                            Add Review
                        </Typography>
                        <CustomInputShadow
                            placeholder="Enter Review URL"
                            name="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            error={snackAlertData.severity === "error" ? snackAlertData.message : ""}
                        />
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: "1rem" }}>
                            <CustomButton
                                loading={loading}
                                border="1px solid #FFA100"
                                borderRadius="10px"
                                background={loading ? "#8B4513" : "#2e210a"}  // Light brown color when loading
                                hoverBg="#FFA100"
                                hovercolor="#1A0049"
                                buttonStyle={{ padding: "10px 20px" }}
                                ButtonText="Add Review"
                                color={"white"}
                                onClick={handleSubmit}
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
            <SnackAlert
                message={snackAlertData.message}
                severity={snackAlertData.severity}
                open={snackAlertData.open}
                handleClose={() => setSnackAlertData(prev => ({ ...prev, open: false })) }
            />
        </>
    );
};

export default AddReviewModal;
