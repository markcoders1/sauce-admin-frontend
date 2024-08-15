import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { handleSnackAlert } from "../../Redux/Slice/SnackAlertSlice/SnackAlertSlice";

const SnackAlert = ({
  duration = 5000,
  anchorOrigin = { vertical: "top", horizontal: "right" }, // Default to left top
  severity = "success",
  message = "",
  open = false,
  handleClose = () => {},
}) => {
  const dispatch = useDispatch();
  const snackAlert = useSelector((state) => state.SnackAlert);

  React.useEffect(() => {
    dispatch(handleSnackAlert({ ...snackAlert }));
    // Reset the timer when the message or open state changes
    const timer = setTimeout(() => {
      dispatch(handleSnackAlert({ open: false }));
    }, duration);
    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [message, open]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    handleClose(); // Close Snackbar
  };

  return (
    message && (
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={open}
        autoHideDuration={null}
        onClose={handleSnackbarClose}
      >
        <Alert
          className="manRope500"
          onClose={handleSnackbarClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", color: "white" }}
        >
          {message}
        </Alert>
      </Snackbar>
    )
  );
};

export default React.memo(SnackAlert);
