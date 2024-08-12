import { Box, FormControl, TextField, Typography } from "@mui/material";
import React, { forwardRef } from "react";

const CustomInputShadow = forwardRef(({
  type = "text",
  rows = 10,
  multiline = false,
  handleKeyDown = () => { },
  onChange = () => { },
  name = "",
  value = "",
  error = "",
  mb = "0px",
  placeholder = "",
  boxShadow,
  height = "70px", // Set default height here
  color = "white",
  disabled = false,
  width = "100%",
  textAlign = "",
  inputStyle = {}

}, ref) => {
  return (
    <Box sx={{ mb: mb }}>
      <FormControl variant="standard" fullWidth
        sx={{
          border: "1px solid #FFA100",
          '& fieldset': {
            display: "none",
          },
          display: "flex",
          flexDirection: "column",
          padding: "0px 10px",
          justifyContent: "space-between",
          borderRadius: "10px",
          mb: 2,
          width: width,
          position: "relative",
          background: "#2e210a",
          color: "white",
        }}
      >
        <TextField
          placeholder={placeholder}
          type={type}
          ref={ref}
          disabled={disabled}
          sx={{
            '&::placeholder': {
              fontSize: "22px",
              fontWeight: "600",
              color: "white",
              fontFamily: "poppins",
            },
            '& input': {
              color: "white",
              fontSize: "22px",
            
            },
            '& .MuiInputBase-input': {
              color: "white",
            },
            '& .MuiInputBase-root': {
              color: "white",
            },
            borderRadius: "12px",
            mt: "7px",
            height: height, // Use the height prop here
            '& .MuiOutlinedInput-root': {
              borderRadius: "12px",
              border: "1px solid rgba(102, 102, 102, 0)",
              
            }, 
            backgroundColor:"",
            fontSize: "22px",
            fontWeight: "600",
            color: "white",
            ...inputStyle
          }}
          onKeyDown={handleKeyDown}
          name={name}
          onChange={onChange}
          value={value}
          InputLabelProps={{
            shrink: true,
          }}
          multiline={multiline}
          rows={rows}
        />
      </FormControl>
      {error && (
        <Typography sx={{
          background: "#2e210a",
          p: "10px",
          color: "red",
          mt: "8px",
          wordBreak: "break-word",
          borderRadius:"5px"
          
        }}>
          {error}
        </Typography>
      )}
    </Box>
  );
});

export default CustomInputShadow;
