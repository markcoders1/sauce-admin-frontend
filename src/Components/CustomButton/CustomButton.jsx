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
    hoverBg = "",
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
                fontSize,
                color,
                background,
                fontWeight,
                type,
                width,
                textTransform: "none",  // Ensures the text is displayed as provided
                ...buttonStyle,
                '&:hover': {
                    background: hoverBg,
                    color: hovercolor,
                    border : hoverBorder
                }
            }} 
            type={`${type}`}
        >
            {loading ? "Loading..." : ButtonText}
        </Button>
    );
}

export default CustomButton;
