import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const CustomSelectForType = ({ label, options, handleChange, value, error, boxShadow = "0px 8px 26px -4px rgba(0, 0, 0, 0.1)" }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedValue(selectedValue);
    handleChange(selectedValue); // Call the parent's handler with the selected value
  };

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "7px 10px",
          justifyContent: "space-between",
          borderRadius: "10px",
          boxShadow: boxShadow,
          width: '100%',
          border: "1px solid #FFA100",
          "& fieldset": { border: 'none' },
          '& .MuiInputLabel-outlined.Mui-focused': {
            fontSize: "22px",
            lineHeight: "30px",
            fontWeight: "500",
            color: "white",
          },
          position: "relative",
          background: "#2e210a",
          color: "white",
        }}
        variant="outlined"
      >
        <InputLabel
          sx={{
            position: 'absolute',
            top: '50%',
            left: "10px",
            transform: 'translateY(-50%)',
            width: "100%",
            fontSize: "22px",
            lineHeight: "30px",
            fontWeight: "500",
            color: "grey",
            display: selectedValue ? 'none' : 'flex',
          }}
          id={`select-${label}-label`}
        >
          {label}
        </InputLabel>
        <Select
          labelId={`select-${label}-label`}
          id={`select-${label}`}
          value={selectedValue}
          onChange={handleSelectionChange}
          sx={{
            width: "100%",
            fontSize: "22px",
            lineHeight: "30px",
            fontWeight: "500",
            color: selectedValue ? "white" : "white",
            "& .MuiSelect-select": {
              backgroundColor: "#2e210a",
              color: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFA100",
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#2e210a",
                "& .MuiMenuItem-root": {
                  fontSize: "22px",
                  lineHeight: "30px",
                  fontWeight: "500",
                  color: "white",
                  backgroundColor: "#2e210a",
                  "&.Mui-selected": {
                    backgroundColor: "#2e210a",
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#402605",
                    color: "white",
                  },
                },
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
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
};

export default CustomSelectForType;
