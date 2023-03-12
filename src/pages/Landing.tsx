import { Box, Typography } from "@mui/material";
import CardArea from "../components/CardGrid";
import Pagination from "../components/MyPagination";

const Landing = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        height: "100vh",
      }}
    >
      <Typography variant="h3" component="h1" align="center" mt={"auto"}>
        RightDrive Dev Test
      </Typography>
      <CardArea />
      <Pagination />
    </Box>
  );
};

export default Landing;
