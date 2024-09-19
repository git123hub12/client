import React, { useEffect, useState } from "react";
import {
  facebookLogin,
  googleLogin,
  loginUser,
  fetchDeviceAndIPInfo,
  fetchIP
} from "../../controller/registerController";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
} from "../../localStorageComp/storage";
import UAParser from 'ua-parser-js';
import {
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  FormGroup,
  Grid,
  Paper,
  Typography,
  Link as Link2,
  Divider,
  Container,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LogoComponent from "../logo/logoComponent";
import SignUpAndLogin from "../signUpAndLoginFields/signUpAndLogin";
import ProductAppBar from "../productAppBar/ProductAppBar";

const LoginAccount: React.FC = () => {
  const navigate = useNavigate();
  const data: any = getDataFromLocalStorage("user");
  const userEmail: any = data?.email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const [contact, setContact] = useState<string>("");
  const [isContactValid, setIsContactValid] = useState(true);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [contactType, setContactType] = useState<string>("");
  const [emailVerfied, setEmailVerified] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (userEmail !== null || userEmail !== undefined) {
      validateContactInput(userEmail);
      setContact(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    const userData: any = getDataFromLocalStorage("user");
    if (userData?.token) {
      navigate("/notes");
    }
  }, [navigate]);

  useEffect(() => {
    const currentURL = window.location.search;
    const urlParams = new URLSearchParams(currentURL);
    if (
      urlParams.has("error") &&
      urlParams.get("error") === "usernotregistered"
    ) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    } else {
      setShowErrorMessage(false);
    }
  }, []);

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setContact(newValue);
    validateContactInput(newValue);
  };

  const validateContactInput = (input: any) => {
    if (
      input?.trim() === "" ||
      (!emailRegex.test(input) && !phoneRegex.test(input))
    ) {
      setIsContactValid(false);
      // setErrorMessage("Please enter a valid email.");
    } else {
      setIsContactValid(true);
      setErrorMessage("");
    }

    if (emailRegex.test(input)) {
      setContactType("email");
    } else if (phoneRegex.test(input)) {
      setContactType("phoneNumber");
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
  

  const handleSubmit = async () => {
    try {
      
      if (
        contact !== "" &&
        password !== "" &&
        (contactType === "email" || contactType === "phoneNumber")
      ) {
        // if (!emailRegex.test(contact)) {
        //   setErrorMessage("Please enter a valid email.");
        // } else {
        //   setErrorMessage("");
        // }
        if (
          (emailRegex.test(contact) || phoneRegex.test(contact)) &&
          password.length >= 8
        ) {
          setErrorMessage("");
          const deviceInfo = await fetchDeviceAndIPInfo();

          if (!deviceInfo) {
            console.error("Failed to retrieve device and IP info");
            return;
          }

          // Now you can use deviceInfo for further operations
          console.log("Device Info:", deviceInfo);
          const result = await loginUser({
            contact,
            password,
            contactType,
            deviceBrand: deviceInfo.deviceBrand, // Use deviceBrand instead of deviceId
            deviceModel: deviceInfo.deviceModel, // Assuming you want to include deviceModel as well
            city: deviceInfo.city,
            state: deviceInfo.state
          });
          // Handle successful user registration, if needed
          if (result.status === "SUCCESS") {
            const userVal = result.data.user;
            const resultToken = result.token;
            userVal["token"] = resultToken;
            saveDataToLocalStorage("user", userVal);
            if (result?.data.user.isSubscribed) {
              navigate("/notes");
            } else {
              navigate("/subscription");
            }
          } else {
            let message = "";
            if (
              result.status === "FAILED" &&
              result?.info?.message ===
                "Email hasn't been verified yet. Check your inbox."
            ) {
              setEmailVerified(false);
            } else if (
              result.status === "FAILED" &&
              result?.info?.message === "Please enter a Valid email!"
            ) {
              message = "User not registered!";
            } else if (
              result.status === "FAILED" &&
              result?.info?.message === "Invalid Credentials!"
            ) {
              message = "You have entered wrong password!";
            } else if (
              result?.status === "FAILED" &&
              result?.message ===
                "you are already signed-up with google account"
            ) {
              message = result.message;
            } else if (
              result?.status === "FAILED" &&
              result?.message ===
                "you are already signed-up with facebook account"
            ) {
              message = result.message;
            }

            if (message) {
              setDialogMessage(message);
              setDialogOpen(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const [isGetuserDone, setGetUserDone] = useState(false);

  const getUser = async () => {
    if (isGetuserDone) {
      return;
    }
    setGetUserDone(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const url = `${apiUrl}/api/auth/login/success`;
    const deviceInfo = await fetchDeviceAndIPInfo();
    // this constains device info contain city,country,deviceModel,deviceBrand how to send them in header and access them
    try {
      const response = await axios.post(url, {
        headers: {
          'Device-Brand': deviceInfo.deviceBrand, // Include Device Brand
          'Device-Model': deviceInfo.deviceModel, // Include Device Model
          'City': deviceInfo.city, // Include City
          'State': deviceInfo.state, // Include Country
        },
        withCredentials: true,
      });
      const { data } = response;
      if (!data.error) {
        saveDataToLocalStorage("user", {
          email: data.user.email,
          token: data.token,
          user: data.user,
        });
        navigate && typeof navigate === "function" && navigate("/notes");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookLogin();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();

    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <ProductAppBar showMenu={false} />
      <Grid container spacing={2} sx={{ height: "95vh", margin: 0 }}>
        <CssBaseline />
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
              Sign in
            </Typography>
            <Typography component={"h1"} variant="h5" sx={{ color: "white" }}>
              Revolutionize Patient Care.
            </Typography>
          </Box>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              flex: "0 0 100%",
            }}
          >
            <FormGroup
              sx={{
                display: "flex",
                justifyContent: "center",
                flex: "0 0 100%",
              }}
            >
              {!emailVerfied}
              <SignUpAndLogin
                isLogin={true}
                onEmailChange={handleContactChange}
                email={contact}
                emailError={
                  errorMessage !== "" || !emailVerfied || showErrorMessage
                }
                emailHelperText={
                  !isContactValid
                    ? "Please enter a valid email."
                    : errorMessage
                    ? errorMessage
                    : !emailVerfied
                    ? "Email hasn't been verifed yet. Check your inbox."
                    : ""
                }
                isPasswordValid={isPasswordValid}
                password={password}
                handlePasswordChange={handlePasswordChange}
                handleKeyPress = {handleKeyPress}
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
                  disabled={!isContactValid || !isPasswordValid}
                  variant="contained"
                  sx={{ m: 1 }}
                  onClick={handleSubmit}
                >
                  Sign In
                </Button>
              </Box>
              <Grid sx={{ m: 1 }}>
                <Grid sm={10}>
                  <Link2
                    href="#"
                    onClick={handleForgotPassword}
                    variant="body2"
                  >
                    Forgot password?
                  </Link2>
                </Grid>
              </Grid>
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
                  <Typography variant="h6" color="primary">
                    Or Sign In using
                  </Typography>
                </Divider>

                <ButtonGroup
                  variant="text"
                  aria-label="Basic button group"
                  sx={{ marginTop: 5 }}
                >
                  <Button onClick={handleGoogleLogin}>
                    <GoogleIcon sx={{ fontSize: 40 }}></GoogleIcon>
                  </Button>
                  <Button onClick={handleFacebookLogin}>
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
                  {" "}
                  <Link
                    to="/register"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "20px",
                    }}
                  >
                    <Typography
                      component={"h6"}
                      variant="h6"
                      sx={{ color: "#0085FE" }}
                    >
                      {"Don't have an account? Sign Up"}
                    </Typography>
                  </Link>
                </Link2>
              </Grid>
            </FormGroup>
          </Container>
        </Grid>
      </Grid>

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
        <DialogTitle
          sx={{ display: "flex", justifyContent: "center", alignItems: "center", color: '#044cae', fontWeight: 'bold', fontSize: '1.2rem' }}
        >
          {dialogMessage}
        </DialogTitle>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%"}}>
            <Button onClick={handleCloseDialog} color="primary" variant="contained">
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginAccount;
