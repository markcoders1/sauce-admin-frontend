import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, ListItemText } from '@mui/material';
import React, { useState } from 'react';

const CustomSelect = ({ data = [], handleChange, categoryError = "", boxShadow = "0px 8px 26px -4px rgba(0, 0, 0, 0.1)", isMultiSelect = false }) => {
  const [selectedCategory, setSelectedCategory] = useState(isMultiSelect ? [] : "");

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value;

    if (isMultiSelect) {
      setSelectedCategory(selectedValue);
      handleChange(selectedValue); // Call the parent's handler with the selected array of values
    } else {
      setSelectedCategory(selectedValue);
      handleChange(selectedValue); // Call the parent's handler with the selected value
    }
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
            display: selectedCategory.length > 0 ? 'none' : 'flex',
          }}
          id="demo-simple-select-label"
        >
          Select Brand
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple={isMultiSelect} // Enable multi-select mode if the prop is true
          value={selectedCategory}
          onChange={handleSelectionChange}
          renderValue={(selected) =>
            isMultiSelect ? selected.map((id) => data.find((item) => item._id === id)?.name).join(', ') : selectedCategory
          }
          sx={{
            width: "100%",
            fontSize: "22px",
            lineHeight: "30px",
            fontWeight: "500",
            color: selectedCategory ? "black" : "black",
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
          {data.map((item, index) => (
            <MenuItem key={index} value={item._id}>
              {isMultiSelect && <Checkbox checked={selectedCategory.indexOf(item._id) > -1} />}
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {categoryError && (
        <Typography sx={{
          background: "#2e210a",
          p: "10px",
          color: "red",
          mt: "8px",
          wordBreak: "break-word",
          borderRadius: "5px"
        }}>
          {categoryError}
        </Typography>
      )}
    </Box>
  )
};

export default CustomSelect;
