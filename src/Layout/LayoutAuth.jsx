import { Box } from "@mui/material";
import {Outlet } from "react-router-dom";
import React from 'react'
// import background1 from "../../assets/images/LoginImg.png";
// import background2 from "../../assets/images/SignupBackground.png";



import { useLocation } from "react-router-dom";

const LayoutSinglePage = () => {

    const location = useLocation();

  return (
    <div>
        <Box
        sx={{
            backgroundColor:"brown",
            boxSizing: "border-box",
            fontFamily: "Poppins",
            width: {
              xs: "100vw",
              sm: "100vw",
              md: "100%",
            },
            height: {
              height: "100vh",
            },
    
            p: {
              md: "20px 20px",
            },
            // maxWidth: "1440px",
            margin: "0 auto",
            
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {
              md: "row",
              xs: "column",
            },
            minWidth: {
              md: "400px"
            },
          
          }}
        >
            <Box
             sx={{
                flexBasis: {
                  xs: "50%",
                },
                flexShrink: "1",
                flexGrow: {
                    lg:"0",
                    md:"1"
                },
                p: {
                  md: "23px 30px",
                  xs: "60px 20px",
      
                },
                mt:"50px",



                
                // bgcolor:"red"
                ml:{
                  sm:"70px",
                  xs:"0px"

                }
              }}
            >
            <Outlet/>
            </Box>
         
        </Box>
    </div>
  )
}

export default LayoutSinglePage