import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";

interface SignInAndLoginProps {
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  emailError: boolean;
  emailHelperText: string;
  isPasswordValid: boolean;
  password: string;
  email: string;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLogin: boolean;
  firstName?: string;
  onFirstNameChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  firstNameError?: boolean;
  firstNameHelperText?: string;
  lastName?: string;
  onLastNameChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lastNameError?: boolean;
  lastNameHelperText?: string;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SignUpAndLogin: React.FC<SignInAndLoginProps> = ({
  onEmailChange,
  emailError,
  emailHelperText,
  isPasswordValid,
  password,
  email,
  handlePasswordChange,
  isLogin,
  firstName,
  onFirstNameChange,
  firstNameError,
  firstNameHelperText,
  lastName,
  onLastNameChange,
  lastNameError,
  lastNameHelperText,
  handleKeyPress,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      {!isLogin && (
        <>
          <FormControl variant="outlined" margin="dense">
            <InputLabel>
            First Name
          </InputLabel>
          <OutlinedInput
            label="First Name"
            // variant="outlined"
            size="medium"
            value={firstName}
            onChange={onFirstNameChange}
            onKeyDown={handleKeyPress} 
            error={firstNameError}
            // helperText={lastNameHelperText}
            sx={{
              mb: 2,
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          />
          </FormControl>
          <FormControl variant="outlined" margin="dense">
            <InputLabel>
            Last Name
          </InputLabel>
          <OutlinedInput
            label="Last Name"
            // variant="outlined"
            size="medium"
            value={lastName}
            onChange={onLastNameChange}
            onKeyDown={handleKeyPress} 
            error={lastNameError}
            // helperText={lastNameHelperText}
            sx={{
              mb: 2,
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          />
          </FormControl>
        </>
      )}
      <>
        <FormControl variant="outlined" margin="dense">
        <InputLabel>
            Email
          </InputLabel>
          <OutlinedInput
            label="Email"
            // variant="outlined"
            size="medium"
            value={email}
            onChange={onEmailChange}
            onKeyDown={handleKeyPress} 
            sx={{
              mb: 2,
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          />
          {emailError && (
            <FormHelperText error>{emailHelperText}</FormHelperText>
          )}
        </FormControl>

        <FormControl variant="outlined" margin="dense">
          <InputLabel htmlFor="password" error={!isPasswordValid}>
            Password
          </InputLabel>
          <OutlinedInput
            id="password"
            value={password}
            size="medium"
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyPress} 
            error={!isPasswordValid}
            sx={{
              mb: 2,
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          />
          {!isPasswordValid && (
            <FormHelperText error>
              <p style={{ color: "red",paddingLeft : "10px",paddingRight : "10px",textAlign : "justify" }}>Note- Password must be at least 8 characters long and include an uppercase letter, lowercase letter, digit, and special character (! @ # $ & ? _ *)</p>
            </FormHelperText>
          )}
        </FormControl>
      </>
    </>
  );
};

export default SignUpAndLogin;
