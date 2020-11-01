import MenuIcon from "@material-ui/icons/Menu";
import { AppBar, Toolbar, IconButton, Grid } from "@material-ui/core";
import { useSession } from "next-auth/client";

const NavbarComponent = () => {
  const [session, loading] = useSession();
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justify="space-between">
          <Grid item>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item>{!session ? "login" : "logout"}</Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarComponent;
