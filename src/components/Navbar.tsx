import AppBar from "@mui/material/AppBar";
import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: blue[700] }}>
      <Toolbar>
        <Typography
          component="h1"
          fontSize="3rem"
          color={grey[50]}
          pt={3}
          gutterBottom
          px={3}
          flexGrow={1}
          align="center"
        >
          RightDrive Dev Test
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
