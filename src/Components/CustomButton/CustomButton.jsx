import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const   CustomButton = ({
    border = "",
    borderRadius = "",
    buttonTextStyle = {},
    buttonStyle = {},
    ButtonText = "",
    fontSize = "",
    color = "",
    fontWeight = "",
    fullWidth = false,
    variant = "outlined",
    padding = "",
    onClick = () => {},
    background = "",
    hoverBg="linear-gradient(90deg, #F3C623 0%, #F3C623 100%)",

    hovercolor = "",
    hoverBorder = "",
    type,
    width,
    loading = false
}) => {
    return (
        <Button 
            variant={variant} 
            fullWidth={fullWidth}
            onClick={onClick}
            disabled={loading}
            sx={{
                border: border,
                borderRadius,
                padding,
                fontSize: {xl:"16px", sm:"13px", xs:"15px"},
                color,
                background,
                fontWeight,
                type,
                width,
                height:"43px",
                textTransform: "none",  // Ensures the text is displayed as provided
                ...buttonStyle,
                '&:hover': {
                    background: hoverBg,
                    border : "1.5px solid #FFA100",
                transition:".3s ease-in all"

                },
                // transition:" all ease-in .2s"
                transition:".3s ease-in all"
            }} 
            type={`${type}`}
        >
            {loading ? "Loading..." : ButtonText}
        </Button>
    );
}

export default CustomButton;
