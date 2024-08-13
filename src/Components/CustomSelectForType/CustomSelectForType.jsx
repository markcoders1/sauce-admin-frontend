import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const CustomSelectForType = ({ handleChange, typeError = "", boxShadow = "0px 8px 26px -4px rgba(0, 0, 0, 0.1)" }) => {
  const [selectedType, setSelectedType] = useState("");

  const handleSelectionChange = (e) => {
    const selectedType = e.target.value;
    setSelectedType(selectedType);
    handleChange(selectedType); // Call the parent's handler with the selected type
  };

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 10px",
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
            display: selectedType ? 'none' : 'flex',
          }}
          id="demo-simple-select-type-label"
        >
          Select Type
        </InputLabel>
        <Select
          labelId="demo-simple-select-type-label"
          id="demo-simple-select-type"
          value={selectedType}
          onChange={handleSelectionChange}
          sx={{
            width: "100%",
            fontSize: "22px",
            lineHeight: "30px",
            fontWeight: "500",
            color: selectedType ? "black" : "black",
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
                  backgroundColor:"#2e210a",
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
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="brand">Brand</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      {typeError && (
        <Typography sx={{
          background: "#2e210a",
          p: "10px",
          color: "red",
          mt: "8px",
          wordBreak: "break-word",
          borderRadius: "5px"
        }}>
          {typeError}
        </Typography>
      )}
    </Box>
  );
};

export default CustomSelectForType;
