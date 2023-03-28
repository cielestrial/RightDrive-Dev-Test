import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { startRetryAfterTimer } from "../api/apiErrorsCS";
import { getCoins, getRetryAfter } from "../api/coinApiCS";
import CardGrid from "../components/CardGrid";
import MyAlert from "../components/MyAlert";
import MyPagination from "../components/MyPagination";
import Navbar from "../components/Navbar";
import Watermark from "../components/Watermark";
import { keyboardNav, sleepFor } from "../utils/helperFunctions";
import { myCardsActions } from "../utils/myCards";
import { RootState, useAppDispatch } from "../utils/store";

const Landing = () => {
  const retryAfter = useRef(0);
  const { currency } = useSelector((state: RootState) => state.myCards);
  const dispatch = useAppDispatch();
  const retryTimer = useRef<NodeJS.Timer>();
  const retryCount = useRef(0);
  const fromCache = useRef(true);

  useEffect(() => {
    document.addEventListener("keydown", keyboardNav);
    (async () => {
      // Get retry_after
      getRetryAfter(dispatch, retryTimer, retryAfter);
      do {
        // CoinGecko has a rate limit of 10 calls per min, hence 6000.
        if (retryAfter.current > retryCount.current * 6000)
          await sleepFor(retryAfter.current + 1000);
        else await sleepFor(retryCount.current * 6000 + 1000);
        // Get coins
        const coins = await getCoins(
          currency,
          dispatch,
          retryTimer,
          retryAfter,
          fromCache
        );
        if (coins !== undefined) {
          dispatch(myCardsActions.setCoins(coins));
          if (!fromCache.current) {
            retryAfter.current = 10000;
            localStorage.setItem("retryAfter", retryAfter.current + "");
            startRetryAfterTimer(retryTimer, retryAfter);
          }
          return;
        }
        retryCount.current++;
      } while (retryCount.current < 4);
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
      <MyAlert retryAfter={retryAfter} />
      <Navbar />
      <CardGrid />
      <MyPagination />
      <Watermark />
    </Box>
  );
};

export default Landing;
