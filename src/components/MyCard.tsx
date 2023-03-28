import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { coin } from "../api/coinApiCS";
import { RootState } from "../utils/store";

type propsType = {
  id: number;
};

const MyCard = (props: propsType) => {
  const avatarSize = 56;
  const { coins, index, loadStatus, currency } = useSelector(
    (state: RootState) => state.myCards
  );

  /**
   * Formats the content to be displayed.
   * @param content coin object containing the data to be displayed.
   * @returns JSX.Element, the content formatted.
   */
  function formatCardContent(content: coin | undefined) {
    return (
      <Stack
        m={"auto"}
        height={"100%"}
        divider={<Divider flexItem />}
        justifyContent="space-around"
        width={!loadStatus ? "auto" : "max-content"}
      >
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "Currency: " +
            (content === undefined ? "unavailable" : currency.toUpperCase())
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "Market Cap Rank: " +
            (content?.market_cap_rank === undefined
              ? "unavailable"
              : content.market_cap_rank)
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "Market Cap: " +
            (content?.market_cap === undefined
              ? "unavailable"
              : content.market_cap)
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "High (24h): " +
            (content?.high_24h === undefined ? "unavailable" : content.high_24h)
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "Low (24h): " +
            (content?.low_24h === undefined ? "unavailable" : content.low_24h)
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "All Time High: " +
            (content?.ath === undefined ? "unavailable" : content.ath)
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "All Time Low: " +
            (content?.atl === undefined ? "unavailable" : content.atl)
          )}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {!loadStatus ? (
            <Skeleton animation="wave" />
          ) : (
            "Total Volume: " +
            (content?.total_volume === undefined
              ? "unavailable"
              : content.total_volume)
          )}
        </Typography>
      </Stack>
    );
  }

  return (
    <Card
      id={"card" + props.id}
      role="article"
      tabIndex={0}
      raised
      square
      onClick={(event) => event.currentTarget.focus()}
      sx={{
        m: "auto",
        aspectRatio: "3/4",
        minWidth: "16rem",
        width: "50vmin",
        ":focus": {
          outline: "3px solid black",
        },
      }}
    >
      <CardHeader
        sx={{ bgcolor: blue[600] }}
        title={
          <Typography
            component="h2"
            fontSize="1.5rem"
            color={grey[100]}
            aria-busy={!loadStatus}
            aria-label={
              !loadStatus ? "Fetching data, please wait..." : undefined
            }
          >
            {coins[props.id + 4 * index] === undefined || !loadStatus ? (
              <Skeleton animation="wave" />
            ) : (
              coins[props.id + 4 * index].name
            )}
          </Typography>
        }
        avatar={
          <Avatar
            aria-hidden="true" // check loaded image aria
            variant="circular"
            sx={{
              bgcolor: blue[500],
              width: avatarSize,
              height: avatarSize,
            }}
            src={
              coins[props.id + 4 * index] === undefined
                ? undefined
                : coins[props.id + 4 * index].image
            }
          >
            {!loadStatus ? (
              <Skeleton
                variant="circular"
                width={avatarSize}
                height={avatarSize}
                animation="wave"
              />
            ) : (
              <Typography
                component="div"
                fontSize={
                  coins[props.id + 4 * index] === undefined
                    ? "1.75rem"
                    : "1.25rem"
                }
                fontWeight="bold"
              >
                {coins[props.id + 4 * index] === undefined
                  ? "$"
                  : coins[props.id + 4 * index].symbol}
              </Typography>
            )}
          </Avatar>
        }
      />
      <CardContent sx={{ height: "80%" }}>
        {formatCardContent(coins[props.id + 4 * index])}
      </CardContent>
    </Card>
  );
};

export default MyCard;
