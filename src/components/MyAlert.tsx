import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import { myAlertsActions } from "../utils/myAlerts";
import { RootState, useAppDispatch } from "../utils/store";

type propsType = {
  retryAfter: React.MutableRefObject<number>;
};

const MyAlert = (props: propsType) => {
  const { open, alertMessage } = useSelector(
    (state: RootState) => state.myAlerts
  );
  const dispatch = useAppDispatch();

  /**
   * Handles close event. Can ignore certain event triggers.
   * @param event SyntheticEvent
   * @param reason Event cause/trigger
   * @returns void
   */
  function handleClose(event: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    dispatch(myAlertsActions.close());
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      //autoHideDuration={props.retryAfter.current}
      open={true} //open
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
        <AlertTitle>Warning</AlertTitle>
        <Link
          color="inherit"
          href="https://status.coingecko.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          CoinGecko's public API is currently under a DDOS attack.
        </Link>
        {/*alertMessage*/ "\nSorry for the inconvenience."}
      </Alert>
    </Snackbar>
  );
};

export default MyAlert;
