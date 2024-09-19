import React, { useState } from "react";
import { changepassword } from "../../controller/registerController";
import { Link, useNavigate } from "react-router-dom";
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
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [instructionsSent, setInstructionsSent] = useState(false);
  const [isRegisteredUser, setIsRegisteredUser] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogButtonText, setDialogButtonText] = useState("");
  const [dialogButtonAction, setDialogButtonAction] = useState<() => void>(() => () => {});
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend route
      await changepassword({ email });
      setInstructionsSent(true);
      setIsRegisteredUser(true);
      setErrorMessage("");
      setDialogMessage("Password reset link has been sent to your email.");
      setDialogButtonText("SIGN-IN");
      setDialogButtonAction(() => () => navigate("/"));
      setTimeout(() => navigate("/"), 10000);
    } catch (error: unknown) {
      console.error("Error:", error);
      setInstructionsSent(true);
      setIsRegisteredUser(false);
      if (axios.isAxiosError(error) && error.response) {
        // Handle error, show error message to the user, etc.
        const axiosError = error as AxiosError<ErrorResponse>;
        const message = axiosError.response?.data.message ?? "Something went wrong! Please Try Again";
        setErrorMessage(message);
        setDialogMessage(message);
        setDialogButtonText("CLOSE");
        setDialogButtonAction(() => handleCloseDialog);
      } else {
        console.log("something went wrong", error);
        setErrorMessage("Please Try Again");
        setDialogMessage("Please Try Again");
        setDialogButtonText("CLOSE");
        setDialogButtonAction(() => handleCloseDialog);
      }
    }

    setDialogOpen(true);
    // Clear the input field after submission
    setEmail("");
  };

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
            background:
              "linear-gradient(153.69deg, #0085fe, rgba(255, 255, 255, 0))",
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
              flexDirection: "column", // Aligns items in a column
              alignItems: "center", // Aligns items horizontally
              mt: 2, // Adds margin top
            }}
          >
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                mt: 2,
                color: "white",
                wordWrap: "break-word",
                borderLeft: "4px",
                paddingLeft: 2,
                whiteSpace: "normal",
              }}
            >
              Enter your email address to get instructions to reset your
              password.
            </Typography>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                {
                  <FormControl variant="outlined" margin="dense">
                    <TextField
                      label="Email"
                      // variant="outlined"
                      value={email}
                      onChange={handleChange}
                      fullWidth
                      sx={{
                        width: "315px",
                        mb: 2,
                        mt: 4,
                        backgroundColor: "white",
                      }}
                    />
                  </FormControl>
                }
                <Button type="submit" variant="contained" color="primary">
                  Request Reset
                </Button>
              </FormGroup>
            </form>
            {!instructionsSent && (
              <Typography
                variant="body1"
                sx={{
                  wordWrap: "break-word",
                  borderLeft: "4px",
                  paddingLeft: 2,
                  whiteSpace: "normal",
                  mb: 2,
                  mt: 1,
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                We’ll send a verification code to this email if it matches an
                existing Qurenote account.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
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
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#044cae", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button onClick={dialogButtonAction} color="primary" variant="contained">
              {dialogButtonText}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForgotPassword;
