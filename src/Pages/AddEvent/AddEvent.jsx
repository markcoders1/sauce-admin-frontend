import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography, Button } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';

const AddSEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    organizedBy: '',
    day: '',
    date: '',
    time: '',
    details: '',
    destination: '',

  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    let validationErrors = {};
    Object.keys(formData).forEach(field => {
      if (!formData[field]) {
        validationErrors[field] = `${field} is required`;
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Form data submitted:', formData);
    // Handle form submission here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <Typography sx={{
        color: "white",
        fontWeight: "600",
        fontSize: {
          sm: "45px",
          xs: "26px"
        },
        fontFamily: "Fira Sans !important",
      }}>
        Add Event
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", height:{lg:"100%", xs:"370px"} }}>
        
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" style={{ display: 'none' }} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>Upload Banner Image</Typography>
        </label>
        <Box sx={{display:"flex",gap:"1rem",alignItems:"start", justifyContent:"center", flexWrap:{sm:"nowrap", xs:"wrap"} }} >
       <Box>

        <Box
            sx={{
                display:"flex",
                gap:"1rem" 
            }}
            >
            <Box >
          <CustomInputShadow
             inputStyle = {{width : {md : "49px" , xs:"30px" }, height: {md:"93px", xs:"50px"}}}
            name="hours"
            multiline={true}
            
            value={formData.chiliPapers}
            onChange={handleChange}
          
          />
        </Box>
        <Box >
        <CustomInputShadow
                         inputStyle = {{width : {md : "49px" , xs:"30px" }, height: {md:"93px", xs:"50px"}}}

            name="hours"
            multiline={true}
            value={formData.chiliPapers}
            onChange={handleChange}
        
          />
        </Box>

            </Box>  
            <Typography sx={{ fontSize:"22px", textAlign:"center", fontWeight:"600"}} >Hour</Typography>
       </Box>
            <Typography sx={{mt:"20px", fontSize:"40px", fontWeight:"600"}} >:</Typography>
             <Box>

        <Box
            sx={{
                display:"flex",
                gap:"1rem"
            }}
            >
            <Box >
          <CustomInputShadow
                       inputStyle = {{width : {md : "49px" , xs:"30px" }, height: {md:"93px", xs:"50px"}}}

            name="hours"
            value={formData.chiliPapers}
            onChange={handleChange}
            
          />
        </Box>
        <Box >
        <CustomInputShadow
                       inputStyle = {{width : {md : "49px" , xs:"30px" }, height: {md:"93px", xs:"50px"}}}

            name="hours"
            multiline={true}
            
            value={formData.chiliPapers}
            onChange={handleChange}
            
          />
        </Box>

            </Box>  
            <Typography sx={{ fontSize:"22px", textAlign:"center", fontWeight:"600"}} >Minutes</Typography>
       </Box>
            <Typography sx={{mt:{md:"20px", xs:"14px"}, fontSize:"40px", fontWeight:"600"}} >:</Typography>
            <Box>

<Box
    sx={{
        display:"flex",
        gap:"1rem"
    }}
    >
    <Box >
  <CustomInputShadow
                 inputStyle = {{width : {md : "49px" , xs:"30px" }, height: {md:"93px", xs:"50px"}}}

    name="hours"
    multiline={true}
    
    value={formData.chiliPapers}
    onChange={handleChange}
   
  />
</Box>
<Box >
<CustomInputShadow
                inputStyle = {{width : {md : "49px" , xs:"30px" }, height: {md:"93px", xs:"50px"}}}

    name="hours"
    multiline={true}
 
    value={formData.chiliPapers}
    onChange={handleChange}

  />
</Box>

    </Box>  
    <Typography sx={{ fontSize:"22px", textAlign:"center", fontWeight:"600"}} >Seconds</Typography>
</Box>
            
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: {
          md: "row",
          xs: "column"
        },
        gap: "1.5rem",
      }}>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            error={errors.eventName}

          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Organized By"
            name="organizedBy"
            value={formData.organizedBy}
            onChange={handleChange}
            error={errors.organizedBy}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Day"
            name="day"
            value={formData.day}
            onChange={handleChange}
            error={errors.day}
            // type={"date"}
          />
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: {
          md: "row",
          xs: "column"
        },
        gap: "1.5rem",
      }}>
       <Box sx={{flexBasis:"69%", display:"flex", flexDirection:"column", gap:"1.5rem"}} >
        <Box sx={{display:"flex",
          gap:"1.5rem",
          flexDirection:{
            md:"row",
            xs:"column"
          }
        }} >
        <Box flexBasis={"50%"} >
          <CustomInputShadow
            placeholder="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            type={"date"}
          />
        </Box>
        <Box flexBasis={"50%"}  >
          <CustomInputShadow
            placeholder="Time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            error={errors.time}
            type={"number"}
          />
        </Box>
        </Box>
        <Box>
        <CustomInputShadow
            placeholder="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            error={errors.destination}
           
          />
        </Box>

       </Box>
        
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Details"
            name="details"
            multiline={true}
            height="323px"
            value={formData.details}
            onChange={handleChange}
            error={errors.details}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border='1px solid #FFA100'
          ButtonText='Save'
          color='white'
          width={"178px"}
          borderRadius='8px'
          background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
          padding='10px 0px'
          fontSize='18px'
          fontWeight='600'
          onClick={() => handleSubmit()}
        />
      </Box>
    </Box>
  );
};

export default AddSEvent;
