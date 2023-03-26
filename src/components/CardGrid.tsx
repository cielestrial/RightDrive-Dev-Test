import { Box, Fade } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useSelector } from "react-redux";
import { myCardsActions } from "../utils/myCards";
import { pageActions } from "../utils/page";
import { RootState, useAppDispatch } from "../utils/store";
import MyCard from "./MyCard";

const CardGrid = () => {
  const page = useSelector((state: RootState) => state.page);
  const myCards = useSelector((state: RootState) => state.myCards);
  const dispatch = useAppDispatch();
  const cardContainer = {
    display: "flex",
    p: 2,
    width: "100%",
    height: "100%",
  };

  return (
    <Fade
      in={page.pageTurnEffect}
      timeout={100}
      onExited={() => {
        dispatch(pageActions.enablePageTurnEffect());
        dispatch(myCardsActions.setIndex(page.index - 1));
      }}
    >
      <Grid2 role="feed" maxWidth="100%" flexGrow={1} container p={2}>
        <Grid2 xs={12} sm={6} lg={3}>
          <Box sx={cardContainer}>
            <MyCard id={1} />
          </Box>
        </Grid2>
        <Grid2 xs={12} sm={6} lg={3}>
          <Box sx={cardContainer}>
            <MyCard id={2} />
          </Box>
        </Grid2>
        <Grid2 xs={12} sm={6} lg={3}>
          <Box sx={cardContainer}>
            <MyCard id={3} />
          </Box>
        </Grid2>
        <Grid2 xs={12} sm={6} lg={3}>
          <Box sx={cardContainer}>
            <MyCard id={4} />
          </Box>
        </Grid2>
      </Grid2>
    </Fade>
  );
};

export default CardGrid;
