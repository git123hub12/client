import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductAppBar from '../productAppBar/ProductAppBar';
import CategoryMenu from '../userProfile/categoryMenu';
import { AxiosError } from 'axios';
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { fetchActiveSession, ssoLogout, resetinpage } from '../../controller/registerController';
import { getDataFromLocalStorage } from '../../localStorageComp/storage';

interface ErrorResponse {
  message: string;
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).response !== undefined;
}

const LoginAndSecurity: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [user, setUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const DataOfUser = getDataFromLocalStorage('user');
  const shouldRender = !DataOfUser?.login;

  useEffect(() => {
    const userData: any = getDataFromLocalStorage('user');
    if (!userData) {
      navigate('/');
    } else {
      setUser(userData.user);
      fetchSessions(userData.id);
    }
  }, [navigate]);

  const fetchSessions = async (userId: any) => {
    try {
      const data = await fetchActiveSession(userId);
      setSessions(data.session);
      if (data.sessions) {
        setSessions(data.sessions);
      }
      if (data.logintype) {
        console.log("this isssss theeeeeeee logintytpeeeeee",data.logintype);
        setLoginType(data.logintype);
      }

      
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const handleLogout = async () => {
    try { 
      const result = await ssoLogout(DataOfUser?.SessionId);
      console.log('Google login result => ', result);
      localStorage.removeItem('user');
      setLoginType('')
      navigate('/');
    } catch (error) {
      console.error('Error while logging out the user:', error);
    } finally {
      handleCloseDialog();
    }
  };


  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleMyNotesClick = () => {
    navigate('/notes');
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setCurrentPasswordError('');
    setPasswordError('');
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }

    if (name === 'newPassword' && !validatePassword(value)) {
      setPasswordError('Password must be at least 8 characters long and include an uppercase letter, lowercase letter, digit, and special character (! @ # $ & ? _ *.');
    } else if (name === 'confirmNewPassword' && value !== newPassword) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters long and include an uppercase letter, lowercase letter, digit, and special character (! @ # $ & ? _ *');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      const response = await resetinpage(currentPassword, newPassword, DataOfUser?.id);
      console.log('Password updated successfully:', response);
      setSuccessDialogOpen(true);
      setTimeout(() => {
        setSuccessDialogOpen(false);
      }, 5000);

      setSnackbarOpen(true); // Open Snackbar on success
      handleClosePasswordDialog();
    } catch (error) {
      if (isAxiosError(error)) {
        const errorResponse = error.response?.data as ErrorResponse;
        if((error.response?.status === 404 && errorResponse?.message === 'Your new password cannot be the same as your current password.')){
          setCurrentPasswordError(errorResponse?.message);
        }
  
        if (error.response?.status === 400 && errorResponse?.message === 'Current password is incorrect') {
          setCurrentPasswordError('The current password is incorrect.');
        } else {
          setPasswordError('An error occurred while updating the password. Please try again.');
          console.error('Error updating password:', error);
        }
      } else {
        setPasswordError('An unexpected error occurred.');
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <ProductAppBar
        open={open}
        showMenu={true}
        setOpen={setOpen}
      />
      
      <Box sx={{ width: '100vw', height: '100vh' }}>
        <Box display="flex" mt={2} sx={{ height: 'calc(100% - 64px)' }}>
          <CategoryMenu open={open} selectedCategory={"PersonalInfo"} />
          <Box flexGrow={1} ml={3} sx={{ overflowY: 'auto' }}>
            <Container maxWidth="md">
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                  Login and security
                </Typography>
                {shouldRender && (
                  <Box mb={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Password</Typography>
                      <Button variant="outlined" onClick={handleOpenPasswordDialog}>
                        Update password
                      </Button>
                    </Box>
                  </Box>
                )}
                <Divider />
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Device history
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {loginType}
                  </Typography>
                  <Box mt={4}>
  {sessions.length > 0 ? (
    sessions.map((session, index) => (
      <Box key={index} mb={2}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography>{session.deviceInfo}</Typography>
              <Typography variant="body2" color="textSecondary">
                {session.ip}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(session.timestamp).toLocaleString()},
              </Typography>
            </Box>
            {/* Button for session status */}
            <Box
            sx={{
              backgroundColor: session.active === true ? '#0085FE' : '#F0F0F0',
              color: session.active === true ? 'white' : 'black',
              padding: '8px 16px', // Adjust padding as needed
              borderRadius: '4px',  // You can adjust the border radius as needed
              display: 'inline-block',
              textAlign: 'center',
              // cursor: session.active === true ? 'pointer' : 'default',
            }}
          >
                      {session.active === true ? 'Logged In' : 'Logged Out'}
                    </Box>
                    </Box>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography>No active sessions found.</Typography>
            )}
          </Box>
                </Box>
              </Paper>
            </Container>
          </Box>
        </Box>
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
              <Button onClick={handleLogout} color="primary" variant="contained">
                Confirm
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
        <Dialog
          open={passwordDialogOpen}
          onClose={handleClosePasswordDialog}
          PaperProps={{
            style: {
              backgroundColor: "white",
              borderRadius: 15,
              border: "2px solid dodgerblue",
              padding: "20px",
            },
          }}
        >
          <DialogTitle>Update Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Current Password"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              fullWidth
              value={currentPassword}
              onChange={handlePasswordChange}
              margin="normal"
              error={!!currentPasswordError}
              helperText={currentPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              error={!!passwordError && !currentPasswordError}
              helperText={passwordError && !currentPasswordError ? passwordError : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              name="confirmNewPassword"
              type={showConfirmNewPassword ? 'text' : 'password'}
              fullWidth
              value={confirmNewPassword}
              onChange={handlePasswordChange}
              margin="normal"
              // error={!!passwordError && !currentPasswordError}
              // helperText={passwordError && !currentPasswordError ? passwordError : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      edge="end"
                    >
                      {showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={handlePasswordUpdate} color="primary" variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              backgroundColor: "white",
              borderRadius: 15,
              border: "2px solid dodgerblue",
              padding: "20px",
              boxShadow: "none",
            },
          }}
          BackdropProps={{
            style: {
              backgroundColor: "transparent",
              backdropFilter: "none",
            },
          }}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "18px", // Adjust as needed
              fontWeight: "bold", // Optional, for emphasis
            }}
          >
            Password Updated
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px", // Ensure content has padding
            }}
          >
            <Typography
              sx={{
                textAlign: "center", // Center the text within the dialog
                fontSize: "16px", // Adjust font size as needed
              }}
            >
              Your password has been successfully updated.
            </Typography>
          </DialogContent>
        </Dialog>

        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000} // Auto-hide after 5 seconds
          onClose={handleCloseSnackbar}
          message="Password updated successfully!"
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Password updated successfully!
          </Alert>
        </Snackbar> */}
      </Box>
    </>
  );
};

export default LoginAndSecurity;