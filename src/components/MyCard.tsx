import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { coin } from "../utils/coinApi";
import { RootState } from "../utils/store";

type propsType = {
  id: number;
};

const MyCard = (props: propsType) => {
  const { coins, index, loadCounter } = useSelector(
    (state: RootState) => state.myCards
  );
  const avatarSize = 56;

  function formatCardContent(content: coin | undefined) {
    return (
      <Stack
        m={"auto"}
        spacing={{ xs: 2, sm: 3 }}
        width={props.id + 4 * index > loadCounter ? "auto" : "max-content"}
      >
        <Typography variant="body1" color="text.secondary">
          {props.id + 4 * index > loadCounter ? (
            <Skeleton animation="wave" />
          ) : (
            "Open: " +
            (content === undefined
              ? ""
              : content.priceDetails?.open +
                " " +
                content.priceDetails?.currency)
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {props.id + 4 * index > loadCounter ? (
            <Skeleton animation="wave" />
          ) : (
            "High: " +
            (content === undefined
              ? ""
              : content.priceDetails?.high +
                " " +
                content.priceDetails?.currency)
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {props.id + 4 * index > loadCounter ? (
            <Skeleton animation="wave" />
          ) : (
            "Low: " +
            (content === undefined
              ? ""
              : content.priceDetails?.low +
                " " +
                content.priceDetails?.currency)
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {props.id + 4 * index > loadCounter ? (
            <Skeleton animation="wave" />
          ) : (
            "Close: " +
            (content === undefined
              ? ""
              : content.priceDetails?.close +
                " " +
                content.priceDetails?.currency)
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {props.id + 4 * index > loadCounter ? (
            <Skeleton animation="wave" />
          ) : (
            "Volume: " +
            (content === undefined
              ? ""
              : content.priceDetails?.volume +
                " " +
                content.priceDetails?.currency)
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
        title={
          <Typography
            variant="h6"
            component="h2"
            aria-busy={props.id + 4 * index > loadCounter}
            aria-label={
              props.id + 4 * index > loadCounter
                ? "Fetching data, please wait..."
                : undefined
            }
          >
            {coins[props.id + 4 * index] === undefined ||
            props.id + 4 * index > loadCounter ? (
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
                : coins[props.id + 4 * index].logo
            }
          >
            {props.id + 4 * index > loadCounter ? (
              <Skeleton
                variant="circular"
                width={avatarSize}
                height={avatarSize}
                animation="wave"
              />
            ) : (
              <Typography variant="caption" fontWeight="bold">
                {coins[props.id + 4 * index] === undefined
                  ? "$"
                  : coins[props.id + 4 * index].symbol}
              </Typography>
            )}
          </Avatar>
        }
      />
      <CardContent>
        {formatCardContent(coins[props.id + 4 * index])}
      </CardContent>
    </Card>
  );
};

export default MyCard;
