import React from "react";
import NotificationBox from "../../Components/NotificationBox/NotificationBox";
import MenuBar from "../../Components/MenuBar/MenuBar";
import { Box, Typography } from "@mui/material";
const Notification = () => {
  const notifications = [
    {
      notificationText: "New message from Admin",
      notificationDate: "2024-10-06",
      notificationisNew: true,
      notificationLink: "/admin-message",
      notificationLinkType: "message",
    },
    {
      notificationText: "Your profile update was successful",
      notificationDate: "2024-10-05",
      notificationisNew: false,
      notificationLink: "/profile",
      notificationLinkType: "profile",
    },
    {
      notificationText: "System maintenance scheduled for tomorrow",
      notificationDate: "2024-10-04",
      notificationisNew: true,
      notificationLink: "/maintenance",
      notificationLinkType: "alert",
    },
    {
      notificationText: "Password changed successfully",
      notificationDate: "2024-10-03",
      notificationisNew: false,
      notificationLink: "/settings",
      notificationLinkType: "security",
    },
    {
      notificationText: "Welcome to our platform!",
      notificationDate: "2024-10-02",
      notificationisNew: true,
      notificationLink: "/welcome",
      notificationLinkType: "welcome",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        
        p: {
          md: "0px 20px 0px 20px",
          xs: "0px 0px 0px 0px",
        },
      
        flexDirection: {
          md: "column",
          xs: "column",
        },
        position: "relative",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "600",
            fontSize: {
              sm: "45px",
              xs: "30px",
            },
            fontFamily: "Fira Sans !important",
          }}
        >
          Notifications
        </Typography>
        <Typography>
          <MenuBar />
        </Typography>
      </Box>

      <Box
      sx={{
        display:"flex",
        flexDirection:"column",
        gap:"1.4rem"
      }}
      >
        {notifications.map((notif, index) => (
          <NotificationBox
            key={index}
            notificationText={notif.notificationText}
            notificationDate={notif.notificationDate}
            notificationisNew={notif.notificationisNew}
            notificationLink={notif.notificationLink}
            notificationLinkType={notif.notificationLinkType}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Notification;
