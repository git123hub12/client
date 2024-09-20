import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { getDataFromLocalStorage, getUserDetailsFromLocalStorage } from "../../localStorageComp/storage";
import Person2TwoToneIcon from "@mui/icons-material/Person2TwoTone";
import { Box } from "@mui/material";
import { ssoLogout, fetchAndStoreUserDetails} from "../../controller/registerController";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import { useData } from "../../context/dataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from '@mui/material/Divider';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CircularProgress } from '@mui/material';

interface ProductAppBarProps {
  open?: boolean;
  setOpen?: (b: boolean) => void;
  showMenu: boolean;
  isRecording? : boolean;
  showProcessing? : boolean;
  recordings? : Blob[];
  setIsProfileClicked? : React.Dispatch<React.SetStateAction<boolean>>;
  setIsAudioDialogOpen? : React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductAppBar: React.FC<ProductAppBarProps> = ({
  open,
  setOpen,
  showMenu,
  isRecording,
  showProcessing,
  recordings,
  setIsProfileClicked,
  setIsAudioDialogOpen,
}) => {
  const userData = getDataFromLocalStorage("user");
  const [fullName, setFullName] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false); //S- Added state for dialog
  const navigate = useNavigate();
  const theme = useTheme();
  const { setGlobalData } = useData();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  React.useEffect(() => {
    const initializeUserDetails = async () => {
      const storedUserDetails = getUserDetailsFromLocalStorage();
      if (storedUserDetails && storedUserDetails.userDetails) {
        setFullName(`${storedUserDetails.userDetails.firstName} ${storedUserDetails.userDetails.lastName}`);
      } else if (userData && userData.id) {
        const fetchedUserDetails = await fetchAndStoreUserDetails(userData.id);
        if (fetchedUserDetails.userDetails) {
          setFullName(`${fetchedUserDetails.userDetails.firstName} ${fetchedUserDetails.userDetails.lastName}`);
        } else {
          setFullName(userData.fullname);
        }
      }
    };

    if (userData && userData.id) {
      initializeUserDetails();
    }
  }, [userData]);

  const boldDividerStyles = {
    backgroundColor: '#0085fe',
    height: 3,
    fontWeight: 'bold'
  };

  const handleLogoClick = () => {
    navigate("/notes");
  };

  const toggleDrawer = () => {
    setOpen && setOpen(!open);
  }

  const handleOpenUserMenu = () => {
    if (recordings && recordings.length > 0 && setIsAudioDialogOpen && setIsProfileClicked) {
      setIsAudioDialogOpen(true);
      setIsProfileClicked(true);
    } else {
      navigate("/profile");
    }
  };

  //S- Added functions for dialog box handling
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      // await removeSession(userData?.id);
      const response = await ssoLogout(userData?.SessionId);
      if(response.status === 200){
        localStorage.removeItem("user");
        localStorage.removeItem("userDetails");
        navigate("/"); //S- Redirect to the home page after logout
      }
    } catch (error) {
      console.error("Error while logging out the user:", error);
    } finally {
      handleCloseDialog(); //S- Ensure dialog closes after logout attempt
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ background: "#FFFFFF" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {showMenu && (
                <IconButton
                  onClick={toggleDrawer}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ display: { xs: "block", sm: "block", md: "none" } }}
                  disabled={(isRecording || showProcessing) ?? false} // check if isRecording and showProcessing is not null or undefined then set according to isRecording or showProcessing otherwise false
                >
                  <MenuIcon style={{ color: '#0085FE', fontSize: 30 }} />
                </IconButton>
              )}
              <Box
                sx={{ display: "flex", 
                  cursor: (isRecording || showProcessing) ? "not-allowed" : "pointer",
                  pointerEvents: (isRecording || showProcessing) ? "none" : "auto",
                  // opacity: isRecording ? 0.5 : 1, 
                }}
                onClick={handleLogoClick}
              >
                <img
                  alt="Logo"
                  onClick={handleLogoClick}
                  src="/images/icon_light-removebg-preview.png"
                  style={{ width: isMdUp ? "65px" : "40px" }}
                />
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  sx={{
                    display: { xs: "none", md: "flex" },
                    fontFamily: "Arial",
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    mt: "6.5%",
                    color: "#1B5AAD",
                    textDecoration: "none",
                  }}
                >
                  QureNote AI
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, textAlign: 'center', color: '#000', fontSize: isMdUp ? "18px" : "16px" }}
            >
              {fullName}
            </Typography>
            {userData?.token && (
              <Box>
                {/* Below is the dark mode button implementation of this to whole application will take 3 or 4 days */}
                {/*<IconButton
                  color='primary'
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setGlobalData((prev) => ({
                      ...prev,
                      mode: prev.mode === "light" ? "dark" : "light",
                    }));
                  }}
                >
                  <img alt="Dark Mode" src="/icons/Light.svg" />
                </IconButton> */}
                
                <Button
                  onClick={handleOpenUserMenu}
                  sx={{ color: "#0085FE", minWidth: isMdUp ? "64px" : "unset" }}
                  disabled = {(isRecording || showProcessing) ?? false}
                >
                  <Person2TwoToneIcon />
                </Button>
                {/*S- Changed to open dialog instead of directly logging out */}
                <Button
                  onClick={handleOpenDialog}
                  sx={{ color: "#0085FE", minWidth: isMdUp ? "64px" : "unset" }}
                  disabled = {(isRecording || showProcessing) ?? false}
                > 
                  <LogoutTwoToneIcon />
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Divider style={boldDividerStyles} />
      {/*S- Added dialog box functionality with styling */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog} 
        PaperProps={{
          style: {
            backgroundColor: "white",
            borderRadius: 15,
            border: "2px solid dodgerblue",
            padding: "20px",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={handleCloseDialog} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={handleConfirmLogout} color="primary" variant="contained">
              Confirm
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductAppBar;
