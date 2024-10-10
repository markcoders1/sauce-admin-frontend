import React from "react";
import { Box, Icon, Typography } from "@mui/material";

// import {Icon} from '@mui/material';
import { MailTwoTone, DraftsTwoTone } from "@mui/icons-material";

const NotificationBox = ({
  notificationText,
  notificationDate,
  notificationLink,
  notificationisNew,
  notificationLinkType,
  onClick=()=>{},
}) => {

//   function convertUnixToTime(unixTimestamp) {
//     const date =new Date(unixTimestamp);
  
//     // Validate if the date is correct
//  console.log(date)
  
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
  
//     return `${hours}:${minutes}:${seconds}`;
//   }
  
  return (
    <Box
      sx={{
        border: "1px solid #FFA100",
        borderRadius: "10px",
        p: "38px 48px 38px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Montserrat !important",

        position: "relative",
        backgroundColor: notificationisNew
          ? "rgba(90, 61, 10, 1)"
          : "rgba(46, 33, 10, 1)",
         cursor:"pointer",
         ":hover":{
          backgroundColor:"rgba(90, 61, 10, 1)"
         }
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          width: "100%",
        }}
      >
        {notificationisNew ? (
          <MailTwoTone
            sx={{
              color: "rgba(0,90,255,0.5)",
              minWidth: "58px !important",
              minheight: "58px !important",
              maxHeight: "58px",
              maxWidth: "58px",
              margin: "auto 0",
              fontSize: "32px",
            }}
          />
        ) : (
          <DraftsTwoTone
            sx={{
              color: "rgba(0,90,255,0.5)",
              minWidth: "58px !important",
              minheight: "58px !important",
              maxHeight: "58px",
              maxWidth: "58px",
              margin: "auto 0",
              fontSize: "32px",
            }}
          />
        )}
        <Box>
          <Typography
            sx={{
                fontFamily: "Montserrat !important",

              fontWeight: "600",
              fontSize: { sm: "20px", xs: "16px" },
              color: "rgba(255, 255, 255, 1)",
              width: "100%",
            }}
          >
            {notificationText}
          </Typography>
          <Typography
            sx={{
                fontFamily: "Montserrat !important",

              color: "#99999C",
              fontSize: "16px",
            }}
          >
            {/* {convertUnixToTime(notificationDate)}
            {console.log(notificationDate)} */}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationBox;
