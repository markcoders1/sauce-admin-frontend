import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, TextField, Checkbox, ListItemText } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

const VirtualizedCustomSelect = ({ 
    data = [], 
    label = "Select", 
    handleChange, 
    value = "", 
    error = "", 
    boxShadow = "0px 8px 26px -4px rgba(0, 0, 0, 0.1)", 
    isMultiSelect = false ,
    setSearchQuery,
    searchQuery,
}) => {
    const [selectedValue, setSelectedValue] = useState(isMultiSelect ? [] : value);
    const [filteredOptions, setFilteredOptions] = useState(data);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSelectedValue(isMultiSelect ? [] : value);
    }, [value, isMultiSelect]);

    useEffect(() => {
        setFilteredOptions(
            data.filter(option =>
                option.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, data]);

    const handleItemClick = (option) => {
        if (isMultiSelect) {
            const currentIndex = selectedValue.indexOf(option._id);
            let newSelectedValue = [];

            if (currentIndex === -1) {
                newSelectedValue = [...selectedValue, option._id];
            } else {
                newSelectedValue = selectedValue.filter(id => id !== option._id);
            }
            setSelectedValue(newSelectedValue);
            handleChange(newSelectedValue);
        } else {
            setSelectedValue(option._id);
            handleChange(option._id);
            setOpen(false);
        }
    };

    const Row = ({ index, style }) => {
        const option = filteredOptions[index];
        const isSelected = isMultiSelect 
            ? selectedValue.indexOf(option._id) > -1 
            : selectedValue === option._id;

        return (
            <MenuItem
                key={option._id}
                value={option._id}
                onClick={() => handleItemClick(option)}
                style={style}
            >
                {isMultiSelect && <Checkbox checked={isSelected} />}
                <ListItemText primary={option.name} />
            </MenuItem>
        );
    };

    const renderSelectedValues = (selected) => {
        if (isMultiSelect) {
            return selected.length > 0 
                ? selected.map((id) => data.find((item) => item._id === id)?.name).join(', ')
                : label;
        } else {
            return data.find((item) => item._id === selected)?.name || label;
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
                        display: (isMultiSelect ? selectedValue.length > 0 : selectedValue) ? 'none' : 'flex',
                    }}
                    id="virtualized-custom-select-label"
                >
                    {label}
                </InputLabel>
                <Select
                    labelId="virtualized-custom-select-label"
                    id="virtualized-custom-select"
                    multiple={isMultiSelect}
                    value={selectedValue}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    onChange={() => {}}
                    renderValue={renderSelectedValues}
                    sx={{
                        width: "100%",
                        fontSize: "22px",
                        lineHeight: "30px",
                        fontWeight: "500",
                        color: selectedValue ? "white" : "grey",
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
                        autoFocus: false,
                    }}
                >
                    {/* Search Field */}
                    <Box sx={{ px: 2, py: 1 }}>
                        <TextField
                            placeholder="Search..."
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#FFA100',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FFA100',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FFA100',
                                    },
                                },
                                backgroundColor: "#2e210a",
                                color: "white",
                                input: {
                                    color: 'white',
                                }
                            }}
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                        />
                    </Box>

                    {/* Virtualized List of Options */}
                    {filteredOptions.length > 0 ? (
                        <List
                            height={200}
                            itemCount={filteredOptions.length}
                            itemSize={40}
                            width="100%"
                        >
                            {Row}
                        </List>
                    ) : (
                        <MenuItem disabled>No options</MenuItem>
                    )}
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

export default VirtualizedCustomSelect;
