import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import MyCard from "./MyCard";

const CardGrid = () => {
  return (
    <Grid2 maxWidth="100%" m="auto" container px={2}>
      <Grid2 xs={3}>
        <MyCard id={1} />
      </Grid2>
      <Grid2 xs={3}>
        <MyCard id={2} />
      </Grid2>
      <Grid2 xs={3}>
        <MyCard id={3} />
      </Grid2>
      <Grid2 xs={3}>
        <MyCard id={4} />
      </Grid2>
    </Grid2>
  );
};

export default CardGrid;
