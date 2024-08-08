import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography, Button } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';

const AddSEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    organizedBy: '',
    day: '',
    date: '',
    time: '',
    details: '',
    destination: '',
    bannerImage: null,

  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] // Save the file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit =async () => {
    let validationErrors = {};
    Object.keys(formData).forEach(field => {
      if (!formData[field]) {
        validationErrors[field] = `${field} is required`;
      }
    });
    if (Object.keys(validationErrors).length > 4) {
      setErrors(validationErrors);
      return;
    }
    console.log('Form data submitted:', formData);
    // Handle form submission here

   // Create FormData instance
   const data = new FormData();
   data.append('eventName', formData.eventName);
  //  data.append('organizedBy', formData.organizedBy);
   data.append('date', formData.date);
  //  data.append('time', formData.time);
   data.append('details', formData.details);
   data.append('destination', formData.destination);
   if (formData.bannerImage) {
     data.append('bannerImage', formData.bannerImage); // Append the file
   }

 
    try {
      const response = await axios({
        url: "https://aws.markcoders.com/sauced-backend/api/admin/add-event",
        method: "post",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`,
          'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
        },
        data: data
      });
      console.log(response);
    } catch (error) {
      console.error('Error submitting events:', error);
    }

    //  try {
    //   const response = await axios({
    //     url: "https://aws.markcoders.com/sauced-backend/api/admin/add-event",
    //     method: "post",
    //     headers: {
    //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`
    //     },
    //     data : {
    //       eventName : formData.eventName,
    //       // owner: formData.organizedBy,
    //       eventDate : formData.date,
    //       venueName : formData.destination,
    //       // eventDetails : formData.details,
    //       bannerImage : formData.bannerImage

    //     }
    // });
    // console.log(response);
    //  } catch (error) {
    //   console.error('Error submitting events:', error);
    //  }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
         padding: "0px 21px"
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
  <input type="file" id="uploadBannerImage" name="bannerImage" style={{ display: 'flex' }} onChange={handleChange} />
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
