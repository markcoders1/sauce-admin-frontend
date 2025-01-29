import { Box, FormControl, TextField, Typography } from "@mui/material";
import React, { forwardRef } from "react";

const CustomTextAreaShadow = forwardRef(({
  rows = 4, // Default rows for textarea
  handleKeyDown = () => { },
  onChange = () => { },
  name = "",
  value = "",
  error = "",
  mb = "0px",
  placeholder = "",
  width = "100%",
  disabled = false,
  inputStyle = {},
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
          padding: "10px",
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
          ref={ref}
          disabled={disabled}
          sx={{
            '&::placeholder': {
              fontSize: "22px",
              fontWeight: "600",
              color: "white",
              fontFamily: "poppins",
            },
            '& textarea': {
              color: "white",
              fontSize: { md: "22px", xs: "18px" },
            },
            '& .MuiInputBase-input': {
              color: "white",
            },
            '& .MuiInputBase-root': {
              color: "white",
            },
            '& .Mui-disabled': {
              WebkitTextFillColor: 'rgba(255, 255, 255, 1) !important'
            },
            borderRadius: "12px",
            mt: "7px",
            '& .MuiOutlinedInput-root': {
              borderRadius: "12px",
              border: "1px solid rgba(102, 102, 102, 0)",
            },
            backgroundColor: "",
            fontSize: { md: "22px", xs: "10px" },
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
          multiline={true} // Ensuring it's a textarea
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
          borderRadius: "5px"
        }}>
          {error}
        </Typography>
      )}
    </Box>
  );
});

export default CustomTextAreaShadow;
