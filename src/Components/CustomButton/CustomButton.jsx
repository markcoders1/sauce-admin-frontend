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
                    border : "1.5px solid red"
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
