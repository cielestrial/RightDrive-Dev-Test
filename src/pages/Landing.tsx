import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import CardArea from "../components/CardGrid";
import Pagination from "../components/MyPagination";
import { getCoins, priceDetails } from "../utils/coinApi";
import { keyboardNav, sleep } from "../utils/helperFunctions";
import { myCardsActions } from "../utils/myCards";
import { useAppDispatch } from "../utils/store";

const Landing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.addEventListener("keydown", keyboardNav);
    (async () => {
      let url: string | undefined;
      let priceDetails: priceDetails | undefined;
      let rank: number;

      const coins = await getCoins();
      if (coins === undefined) return;
      dispatch(myCardsActions.setCoins(coins));

      for (let multiplier = 0; multiplier < 40; multiplier += 4) {
        for (let cardId = 1; cardId <= 4; cardId++) {
          rank = cardId + multiplier;

          //url = await getLogo(coins[rank].id);
          await sleep();
          if (url !== undefined)
            dispatch(myCardsActions.setLogo({ rank, url }));

          //priceDetails = await getPriceDetails(coins[rank].id);
          await sleep();
          if (priceDetails !== undefined)
            dispatch(myCardsActions.setPriceDetails({ rank, priceDetails }));
        }
        dispatch(myCardsActions.incrementLoadCounter());
      }
    })();
    return () => {
      document.removeEventListener("keydown", keyboardNav);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        height: "100vh",
        ["@supports(height: 100dvh)"]: {
          height: "100dvh",
        },
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        pt={3}
        px={3}
        gutterBottom
        align="center"
      >
        RightDrive Dev Test
      </Typography>
      <CardArea />
      <Pagination />
    </Box>
  );
};

export default Landing;
