import "./App.css";
import TermsAndConditions from "./views/TermsAndConditions/termsAndConditions";
import RegisterComponent from "./views/register/registerComponent";
import LoginAndSecurityComponent from "./views/login&Security/loginAndSecurityComponent";
import PrivacyPolicy from "./views/Privacy Policy/PrivacyPolicy";
import VerificationEmail from "./views/verficationEmail/verificationEmailComponent";
import MyNotesComponent from "./views/notes/notesComponent";
import LoginAccount from "./views/login/loginComponent";
import UserVerified from "./views/verifiedConfirmation/userVerified";
import ProfileComponent from "./views/userProfile/profileComponent";
import ForgotPassword from "./views/forgotPassword/forgotpassword";
import NewPassword from "./views/forgotPassword/NewPassword";
import PricingPage from "./views/paymentTable/index";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, useEffect,useRef } from "react";
import { useData } from "./context/dataContext";
import IdleDialog from "./components/IdleDialog";
import useIdleTimer from "./components/useIdleTimer";
import { ssoLogout } from "./controller/registerController";

function App() {
  const { globalData } = useData();
  const darkTheme = createTheme({
    palette: {
      mode: globalData.mode,
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);



  const getSessionId = (): string | null => {
    const DataOfUser = localStorage.getItem('user');
    if (DataOfUser) {
        const parsedData = JSON.parse(DataOfUser);
        return parsedData?.data?.SessionId || null;
    }
    return null;
  };

  const handleIdle = () => {
    setDialogOpen(true);
    idleTimeoutRef.current = setTimeout(() => {
      handleCloseDialog();
    }, 900000); // 15 min in milliseconds
  };

  const handleCloseDialog = async() => {
    setDialogOpen(false);
    const sessionId = getSessionId();
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current); // Clear the timeout when logging out
    }
      try {
        // Perform the logout operation
        const result = await ssoLogout(sessionId);
        console.log('Logout result:', result);
        
        // Clear user data from localStorage
        localStorage.removeItem('user');
        window.location.href = '/';
        window.location.reload();
        
      } catch (error) {
        console.error('Error while logging out the user:', error);
      }
    
  };

  const handleKeepSignedIn = async() => {
    setDialogOpen(false);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current); // Clear the existing timeout
    }
    // Restart the idle timer manually
    idleTimeoutRef.current = setTimeout(() => {
      handleIdle();
    }, 3600000); 
    //  1 hour in milliseconds
  };

  const activePages = ['/notes', '/LoginAndSecurity', '/profile']; // Add your target pages here

  // Use a location-aware component to get the current path
  const LocationAwareComponent = () => {
    const location = useLocation();
    useEffect(() => {
      setCurrentPath(location.pathname);
    }, [location]);

    useIdleTimer(3600000, handleIdle, activePages, isRecording, currentPath); // 1 hour in milliseconds

    return null;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <LocationAwareComponent />
        <Routes>
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/LoginAndSecurity" element={<LoginAndSecurityComponent />} />
          <Route path="/" element={<LoginAccount />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/emailVerification" element={<VerificationEmail />} />
          <Route path="/notes" element={<MyNotesComponent recording={setIsRecording} />} />
          <Route path="/verified" element={<UserVerified />} />
          <Route path="/profile" element={<ProfileComponent />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<NewPassword />} />
          <Route path="/subscription" element={<PricingPage />} />
        </Routes>
      </Router>
      <IdleDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onKeepSignedIn={handleKeepSignedIn}
      />
    </ThemeProvider>
  );
}

export default App;

