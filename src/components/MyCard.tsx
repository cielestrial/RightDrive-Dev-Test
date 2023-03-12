import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";

import { MoreVert } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../utils/store";

type propsType = {
  id: number;
};

const MyCard = (props: propsType) => {
  const { index } = useSelector((state: RootState) => state.pageIndex);
  return (
    <Card tabIndex={0} raised square sx={{ mx: 2, aspectRatio: "3/4" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="Crypto Logo">
            $
          </Avatar>
        }
        title={"Crypto Name " + (props.id + 4 * (index - 1))}
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis
          nunc enim. Cras sed varius sapien. Quisque quis tortor libero. Cras
          non maximus orci. Morbi condimentum elit ut lectus accumsan viverra.
          Nullam ullamcorper elementum libero, at bibendum nulla laoreet id.
          Duis eget leo consequat, facilisis nisi porta, fringilla sapien.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MyCard;
