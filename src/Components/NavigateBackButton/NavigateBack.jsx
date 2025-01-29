import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
const NavigateBack = () => {
    
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(-1);
    }
  return (
    <Box
    className=  "logout-text"
    onClick={handleNavigate}
        sx={{
            border: "none",
            outline: "none",
            backgroundColor: "#FFA100",
            marginTop: "5px",
            height: "48px", 
            width: "48px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            cursor:"pointer",
            borderRadius: "50%", 
            '&:hover': {
                backgroundColor: 'rgba(55, 0, 0, 0.6)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Box shadow on hover
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }
        }}
    >
        <IoMdArrowRoundBack style={{fontSize:"30px"}} />
        </Box>
  )
}

export default NavigateBack