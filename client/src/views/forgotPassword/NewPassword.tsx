import { FunctionComponent, useState } from "react";
import { resetpassword } from "../../controller/registerController";
import {
  FormControl,
  TextField,
  Box,
  Button,
  FormGroup,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LogoComponent from "../logo/logoComponent";
import ProductAppBar from "../productAppBar/ProductAppBar";
import { useNavigate } from "react-router-dom";

const NewPassword: FunctionComponent = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogButtonText, setDialogButtonText] = useState("");
  const navigate = useNavigate();
  const url = window.location.href;
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword: string = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (inputPassword: string) => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const spaceRegex = /\s/;
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{}|;':",./<>?]/;

    const isValidPassword =
      inputPassword.length >= minLength &&
      uppercaseRegex.test(inputPassword) &&
      lowercaseRegex.test(inputPassword) &&
      digitRegex.test(inputPassword) &&
      !spaceRegex.test(inputPassword) &&
      specialCharRegex.test(inputPassword);

    setIsPasswordValid(isValidPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setDialogMessage("Please fill in the fields");
      setDialogButtonText("CLOSE");
      setDialogOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setDialogMessage("Both passwords do not match. Please retry again.");
      setDialogButtonText("CLOSE");
      setDialogOpen(true);
      return;
    }

    if (!isPasswordValid) {
      setDialogMessage(
        "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, digit, and special character (! @ # $ & ? _ *)"
      );
      setDialogButtonText("CLOSE");
      setDialogOpen(true);
      return;
    }

    try {
      await resetpassword(url, password);
      setDialogMessage("Your password has been reset.");
      setDialogButtonText("SIGN-IN");
      setDialogOpen(true);
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Something went wrong! Please Try Again");
      setDialogButtonText("CLOSE");
      setDialogOpen(true);
    }

    setPassword("");
    setConfirmPassword("");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (dialogButtonText === "SIGN-IN") {
      navigate("/");
    } else if (dialogButtonText === "CLOSE" && dialogMessage === "Please fill in the fields") {
      navigate("/");
    } else if (dialogButtonText === "CLOSE" && dialogMessage === "Both passwords do not match. Please retry again.") {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const passwordCriteria = [
    { text: "At least 8 characters long", isValid: password.length >= 8 },
    { text: "Includes an uppercase letter", isValid: /[A-Z]/.test(password) },
    { text: "Includes a lowercase letter", isValid: /[a-z]/.test(password) },
    { text: "Includes a digit", isValid: /\d/.test(password) },
    { text: "Includes a special character (! @ # $ & ? _ *)", isValid: /[!@#$%^&*()_+\-=[\]{}|;':",./<>?]/.test(password) },
    { text: "No space", isValid: !/\s/.test(password) },
  ];

  return (
    <>
      <ProductAppBar showMenu={false} />
      <Grid container sx={{ height: "100vh" }}>
        {isMdUp && <LogoComponent />}
        <Grid
          xs={12}
          sm={5}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            background: "linear-gradient(153.69deg, #0085fe, rgba(255, 255, 255, 0))",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ color: "white" }}>
              Welcome!
            </Typography>
            <Typography component={"h1"} variant="h5" sx={{ color: "white" }}>
              Revolutionize Patient Care.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              mt: -7, // Reduced top margin to decrease space
            }}
          >
            <Typography variant="body1" color="primary" sx={{ mt: 0.5 }}> {/* Reduced top margin */}
              Enter new password.
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormControl sx={{ alignItems: "center" }} variant="outlined" margin="dense">
                  <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    sx={{
                      width: "275px",
                      mb: 2,
                      mt: 2,
                      backgroundColor: "white",
                    }}
                  />
                  
                  {/* Password criteria as unordered list */}
                  <Box sx={{ mb: 2, textAlign: "left", width: "275px" }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Password must meet the following criteria:
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      {passwordCriteria.map((criterion, index) => (
                        <li key={index} style={{ color: criterion.isValid ? "#044cae" : "red" }}>
                          {criterion.text}
                        </li>
                      ))}
                    </ul>
                  </Box>

                  <TextField
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    fullWidth
                    disabled={!isPasswordValid}
                    sx={{
                      width: "275px",
                      mb: 2,
                      mt: 2,
                      backgroundColor: "white",
                    }}
                  />
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                  Reset Password
                </Button>

                <Box
                  sx={{
                    mb: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    "& > *": {
                      m: 5,
                    },
                  }}
                ></Box>
              </FormGroup>
            </form>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          style: {
            backgroundColor: "white",
            borderRadius: 15,
            border: "2px solid #044cae",
            padding: "20px",
          },
        }}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: '#044cae', fontWeight: 'bold', fontSize: '1.2rem' }} // Make text bold and increased font size
          >
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button onClick={handleDialogClose} color="primary" variant="contained">
              {dialogButtonText}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewPassword;








