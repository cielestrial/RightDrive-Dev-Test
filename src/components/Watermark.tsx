import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2

const Watermark = () => {
  return (
    <Grid2 container pt={0.75} pb={0.5} bgcolor={blue[800]}>
      <Grid2 xs={12} sm={6} display="flex" justifyContent="center">
        <Typography
          variant="body1"
          align="center"
          fontWeight={500}
          color={grey[200]}
        >
          {"Powered by "}
          <Link
            color="inherit"
            href="https://www.coingecko.com/en/api"
            target="_blank"
            rel="noreferrer noopener"
          >
            CoinGecko API
          </Link>
        </Typography>
      </Grid2>
      <Grid2 xs={12} sm={6} display="flex" justifyContent="center">
        <Typography
          variant="body1"
          align="center"
          fontWeight={500}
          color={grey[200]}
        >
          {"Created by "}
          <Link
            color="inherit"
            href="https://cielestrial.github.io/"
            target="_blank"
            rel="noreferrer noopener"
          >
            cielestrial
          </Link>
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default Watermark;
