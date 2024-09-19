import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  Divider,
  FormGroup,
  Grid,
  Paper,
  Typography,
  Link as Link2,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ProductAppBar from "../productAppBar/ProductAppBar";
import LogoComponent from "../logo/logoComponent";
import SignUpAndLogin from "../signUpAndLoginFields/signUpAndLogin";
import { facebookLogin, googleLogin, registerUser, } from "../../controller/registerController";
import { getDataFromLocalStorage, saveDataToLocalStorage } from "../../localStorageComp/storage";

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [firstName, setFirstName] = useState<string>("");
  const [isFirstValid, setIsFirstNameValid] = useState(true);
  const [lastname, setLastName] = useState<string>("");
  const [isLastValid, setIsLastNameValid] = useState(true);
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [validDetails, setValidDetails] = useState(true);
  const [contactType, setContactType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState<string | null>(null); // Control dialog visibility
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const userData: any = getDataFromLocalStorage("user");
    if (userData?.token) {
      navigate("/notes");
    }
  }, [navigate]);

  const handleFirstNameChange = (event: any) => {
    const newName = event.target.value;
    setFirstName(newName);
    validateFirstName(newName);
  };

  const validateFirstName = (inputName: string) => {
    if (inputName.trim() === "" || !nameRegex.test(inputName)) {
      setIsFirstNameValid(false);
    } else {
      setIsFirstNameValid(true);
    }
  };
  
  const handleLastNameChange = (event: any) => {
    const newName = event.target.value;
    setLastName(newName);
    validateLastName(newName);
  };

  const validateLastName = (inputName: string) => {
    if (inputName.trim() === "" || !nameRegex.test(inputName)) {
      setIsLastNameValid(false);
    } else {
      setIsLastNameValid(true);
    }
  };

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setContact(newValue);
    validateContactInput(newValue);
  };

  const validateContactInput = (input: any) => {
    if (input.trim() === "" || !emailRegex.test(input)) {
      setErrorMessage("Please enter a valid email.");
    } else {
      setErrorMessage("");
    }

    if (emailRegex.test(input)) {
      setContactType("email");
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
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

  const getTermsAndCondtion = () => {
    return (
      <>
        By creating an account means you agree to the{" "}
        <Link2>
          {" "}
          <a
            href="https://qurenote.ai/terms-conditions/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {"Terms & Conditions"}
          </a>
        </Link2>{" "}
        and{" "}
        <Link2>
          {" "}
          <a
            href="https://qurenote.ai/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {"Privacy Policy"}
          </a>
        </Link2>
      </>
    );
  };
  useEffect(() => {
    if (
      firstName !== "" &&
      lastname !== "" &&
      contact !== "" &&
      password !== "" &&
      contactType === "email" &&
      nameRegex.test(firstName) &&
      nameRegex.test(lastname) &&
      emailRegex.test(contact) &&
      password.length >= 8
    ) {
      setValidDetails(true);
    } else {
      setValidDetails(false);
    }
  }, [firstName, lastname, contact, password]);

  const handleUserRegistration = async () => {
    try {
      if (
        firstName !== "" &&
        lastname !== "" &&
        contact !== "" &&
        password !== "" &&
        (contactType === "email" || contactType === "phoneNumber")
      ) {
        if (
          nameRegex.test(firstName) &&
          nameRegex.test(lastname) &&
          emailRegex.test(contact) &&
          password.length >= 8
        ) {
          setErrorMessage("");

          const result = await registerUser({
            firstName,
            lastName: lastname,
            fullName: `${firstName} ${lastname}`,
            contact,
            password,
            contactType,
          });

          if (result.status === "SUCCESS") {
            setDialogOpen("registrationSuccess");
          } else if (result.status === "PENDING") {
            navigate("/emailVerification");
          } else if (result.status === "FAILED") {
            setDialogOpen("userExists");
          }
        } else {
          setDialogOpen("passwordInvalid");
        }
      } else {
        setValidDetails(false);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleGoogleAndFacebookLogin = async (provider: string) => {
    try {
      if (provider === "google") {
        await googleLogin();
      } else if (provider === "facebook") {
        await facebookLogin();
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(null);
  };
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleUserRegistration();
    }
  };

  return (
    <>
      <ProductAppBar showMenu={false} />
      <Grid container spacing={2} sx={{ height: "100vh", margin: 0 }}>
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
              Create your account
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              margin: 5,
            }}
          >
            <FormGroup>
              <SignUpAndLogin
                isLogin={false}
                onEmailChange={handleContactChange}
                email={contact}
                emailError={errorMessage !== ""}
                emailHelperText={errorMessage ? errorMessage : ""}
                isPasswordValid={isPasswordValid}
                password={password}
                handlePasswordChange={handlePasswordChange}
                firstName={firstName}
                onFirstNameChange={handleFirstNameChange}
                firstNameError={!isFirstValid}
                firstNameHelperText={
                  isFirstValid ? "" : "Enter Valid First Name"
                }
                lastName={lastname}
                onLastNameChange={handleLastNameChange}
                lastNameError={!isLastValid}
                lastNameHelperText={isLastValid ? "" : "Enter Valid Last Name"}
                handleKeyPress={handleKeyPress}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="Agree"
                    onChange={() => setIsChecked(!isChecked)}
                    color="primary"
                  />
                }
                label={
                  <>
                    By creating an account means you agree to the{" "}
                    <Link2>
                      <Link
                        to="https://qurenote.ai/terms-conditions/"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Terms&Conditions
                      </Link>
                    </Link2>{" "}
                    and{" "}
                    <Link2>
                      <Link
                        to="https://qurenote.ai/privacy-policy/"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Privacy Policy
                      </Link>
                    </Link2>
                  </>
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <Button
                  type="submit"
                  fullWidth
                  disabled={!isChecked || !validDetails}
                  variant="contained"
                  sx={{ m: 1 }}
                  onClick={handleUserRegistration}
                >
                  Sign Up
                </Button>
              </Box>
              <Box
                sx={{
                  mb: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <Divider component="div" role="presentation">
                  <Typography variant="body1" color="primary">
                    Or Sign up using
                  </Typography>
                </Divider>

                <ButtonGroup
                  variant="text"
                  aria-label="Basic button group"
                  sx={{ marginTop: 5 }}
                >
                  <Button
                    onClick={() => handleGoogleAndFacebookLogin("google")}
                  >
                    <GoogleIcon sx={{ fontSize: 40 }} />
                  </Button>
                  <Button
                    onClick={() => handleGoogleAndFacebookLogin("facebook")}
                  >
                    <FacebookIcon sx={{ fontSize: 40 }} />
                  </Button>
                </ButtonGroup>
              </Box>
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Link2>
                  <Link
                    to="/"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "20px",
                    }}
                  >
                    <Typography component={"h6"} variant="h6" sx={{ color: "#0085FE" }}>
                      {"Already have an account? Sign In"}
                    </Typography>
                  </Link>
                </Link2>
              </Grid>
            </FormGroup>
          </Box>
        </Grid>
      </Grid>

      {/* Dialog for Registration Success */}
      <Dialog
        open={dialogOpen === "registrationSuccess"}
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
        <DialogTitle sx={{ color: "#044cae" }}>Registration Successful</DialogTitle>
        <DialogContent>
          <Typography>
            Thanks for Registration. Please check your inbox and verify your email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => navigate("/")}
          >
            SIGN-IN
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for User Already Exists */}
      <Dialog
        open={dialogOpen === "userExists"}
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
         <DialogTitle   sx={{ display: "flex", justifyContent: "center", alignItems: "center",color: '#044cae', fontWeight:'bold', fontSize: "1.2rem" }}>
          User Already Exists</DialogTitle>
        <DialogContent>
          <Typography>User already exists, please try signing in.</Typography>
        </DialogContent>
        <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button onClick={handleCloseDialog} color="primary" variant="contained">
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Dialog for Invalid Password */}
      <Dialog
        open={dialogOpen === "passwordInvalid"}
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
        <DialogTitle  sx={{ display: "flex", justifyContent: "center", alignItems: "center",color: '#044cae',fontWeight:'bold', fontSize:'1.2rem' }}>Invalid Password</DialogTitle>
        <DialogContent>
          <Typography>
            Password must be at least 8 characters long and include an uppercase letter, lowercase letter, digit, and special character (! @ # $ & ? _ *).
          </Typography>
        </DialogContent>
        <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button onClick={handleCloseDialog} color="primary" variant="contained">
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterComponent;
