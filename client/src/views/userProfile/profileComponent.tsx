import { useNavigate, useSearchParams } from "react-router-dom";
import { saveUserDetails, getUserDetails, fetchAndStoreUserDetails, logout } from "../../controller/registerController";
import { stateOptions, specialtyOptions } from '../dropDownOptions';
import { getDataFromLocalStorage, getUserDetailsFromLocalStorage, saveDataToLocalStorage } from "../../localStorageComp/storage";
import { useState, useEffect, SetStateAction } from "react";
import CategoryMenu from "./categoryMenu";
import ProductAppBar from "../productAppBar/ProductAppBar";

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";

const ProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [personalInfos, setPersonalInfos] = useState([]);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('+1');
  const [state, setSelectedState] = useState<string>("");
  const [specialty, setSelectedSpecialty] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [inValidDetails, setInValidDetails] = useState(false);
  const [isContactValid, setIsContactValid] = useState(true);
  const [open, setOpen] = useState(false);
  const [alert,setAlert] = useState<boolean>(false); // to show user alert message after successful profile updation
  const [errorAlert,setErrorAlert] = useState<boolean>(false); // to show user alert message when profile is not updated due to some server error

  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
  const userData = getDataFromLocalStorage("user");

  useEffect(() => {
    const initializeUserDetails = async () => {
      const storedUserDetails = getUserDetailsFromLocalStorage();
      if (storedUserDetails && storedUserDetails.userDetails) {
        if(!isFormChanged){
          setUserDetails(storedUserDetails.userDetails); // set the user details only if form is not changed
        }
      } else {
        const userData = getDataFromLocalStorage("user");
        if (userData && userData.id) {
          const fetchedUserDetails = await fetchAndStoreUserDetails(userData.id);
          if(!isFormChanged){
            setUserDetails(fetchedUserDetails.userDetails);
          }
        } else {
          navigate("/"); // Redirect to login page if user data is not found
        }
      }
    };

    if (userData && userData.id) {
      initializeUserDetails();
    } else {
      navigate("/"); // Redirect to login page if user data is not found
    }
  }, [navigate, userData]);
/**
 * @description it will take the userdetails and set it to state of the component
 * @param userDetail
 */
  const setUserDetails = (userDetail: any) => {
    if (userDetail) {
      const { firstName, lastName, email, phone, address, specialty, state } = userDetail;
      setFirstName(firstName || '');
      setLastName(lastName || '');
      setFullname(`${firstName} ${lastName}`);
      setEmail(email || '');
      setPhone(phone || '');
      setAddress(address || '');
      setSelectedSpecialty(specialty || '');
      setSelectedState(state || '');
    }
    else{
      setEmail(userData.email);
      setFullname(userData.fullname);
    }
  };

  const handleSpecialtyChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSelectedSpecialty(event.target.value);
    setIsFormChanged(true);
  };

  const validateContactInput = (input: any) => {
    if (input?.trim() === "" || !phoneRegex.test(input)) {
      setIsContactValid(false);
    } else {
      setIsContactValid(true);
    }
  };

  const handleStateChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSelectedState(event.target.value);
    setIsFormChanged(true);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFirstName(newValue);
    setFullname(`${newValue} ${lastName}`);
    setIsFormChanged(true);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLastName(newValue);
    setFullname(`${firstName} ${newValue}`);
    setIsFormChanged(true);
  };

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    // Remove all non-numeric characters
    let numericOnly = newValue.replace(/\D/g, '');

    // Limit to 10 digits
    if (numericOnly.length > 10) {
      numericOnly = numericOnly.substring(0, 10);
    }

    // Format as XXX-XXX-XXXX
    let formattedPhone = '';

    if (numericOnly.length > 0) {
      formattedPhone = numericOnly.substring(0, 3); // XXX
    }
    if (numericOnly.length > 3) {
      formattedPhone += '-' + numericOnly.substring(3, 6); // XXX-XXX
    }
    if (numericOnly.length > 6) {
      formattedPhone += '-' + numericOnly.substring(6, 10); // XXX-XXX-XXXX
    }

    setPhone(formattedPhone);
    validateContactInput(formattedPhone);
    setIsFormChanged(true);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    setIsFormChanged(true);
  };

  // const fullName = `${firstName} ${lastName}`;

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      if (firstName !== "" && phone !== "") {
        if (phoneRegex.test(phone)) {
          const userData = getDataFromLocalStorage("user");
          if (!userData || !userData.id) {
            console.error("User ID not found in local storage");
            navigate("/"); // Redirect to login page if user data is not found
            return;
          }
  
          const userId = userData.id; // Assuming 'id' is stored in localStorage
          const userDetails = {
            firstName,
            lastName,
            email: userData.email, // Get email from local storage
            phone,
            state,
            specialty,
            address,
          };
  
          const result = await saveUserDetails(userId, userDetails);
          if(result.message === "UserDetails updated successfully"){
            // Save updated details to local storage after successfull updation of profile
            saveDataToLocalStorage("userDetails", { userDetails });
            setAlert(true);
            setTimeout(()=>{
              setAlert(false);
            },10000);
          }else if(result.message === "Internal server error"){
            setErrorAlert(true);
            setTimeout(()=>{
              setErrorAlert(false);
            },10000);
          }
          setIsFormChanged(false);
        } else {
          setInValidDetails(true);
        }
      } else {
        setInValidDetails(true);
      }
    } catch (error) {
      console.error("Error saving user details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <ProductAppBar
        open={open}
        showMenu={true}
        setOpen={setOpen}
      />
      <Grid
        container
        columnGap={4}
        component={Paper}
        sx={{
          xs: {
            justifyContent: "center",
          },
        }}
      >
        <Grid item xs={1} sm={1} md={2}>
          <CategoryMenu open={open} selectedCategory={"PersonalInfo"} />
        </Grid>
        {alert && <Box sx={{width : '100%',display:'flex',flexDirection:'row',justifyContent: 'center'}}>
          <Alert severity="success">Your profile info has been successfully updated</Alert>
        </Box> }
        {errorAlert && <Box sx={{width : '100%',display:'flex',flexDirection:'row',justifyContent: 'center'}}>
          <Alert severity="error">Something went wrong, please try again.</Alert>
        </Box> }
        <Grid item container justifyContent="flex-end">
          <Grid item xs={11} sm={11} md={9}>
            <Box sx={{display:'flex',width:'100%',alignItems:'center',justifyContent:'center'}}  >
            <FormGroup sx={{width:'min-content'}}>
              <Grid container spacing={2} sx={{mt : {md:16,xs : 2},width:{xs:"100%",md:"600px"}}}>
              {/* <div style={{ display: "flex", gap: "40px" }}> */}
              <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 16,
                    // }}
                  />
                </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    variant="outlined"
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 16,
                    // }}
                  />
                </FormControl>
                </Grid>
              {/* </div> */}
              {/* <div style={{  display: "flex", gap: "40px" }}> */}
              <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <TextField
                    label="Full Name"
                    // value={`${firstName} ${lastName}`}
                    value={fullname}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 4,
                    // }}
                  />
                </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <TextField
                    label="Email"
                    disabled
                    variant="outlined"
                    value={email}
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 4,
                    // }}
                  />
                </FormControl>
                </Grid>
              {/* </div> */}
              {/* <div style={{ display: "flex", gap: "40px" }}> */}
              <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={phone}
                    onChange={handleContactChange}
                    error={!isContactValid}
                    helperText={!isContactValid ? "Please provide a valid phone number." : ""}
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 4,
                    // }}
                  />
                </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <TextField
                    label="Address"
                    variant="outlined"
                    value={address}
                    onChange={handleAddressChange}
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 4,
                    // }}
                  />
                </FormControl>
                </Grid>
              {/* </div> */}
              {/* <div style={{ display: "flex", gap: "40px" }}> */}
              <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <InputLabel id="state" >
                    State
                  </InputLabel>
                  <Select
                    labelId="state"
                    label="State"
                    variant="outlined"
                    value={state}
                    onChange={handleStateChange}
                    
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 2,
                    //   mt: 4,
                    // }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {stateOptions.map((state, index) => (
                      <MenuItem key={index} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                <FormControl sx={{width : "275px"}} variant="outlined" margin="dense">
                  <InputLabel id="speciality" >
                    Speciality
                  </InputLabel>
                  <Select
                    labelId="speciality"
                    label="Speciality"
                    variant="outlined"
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    fullWidth
                    // sx={{
                    //   width: "275px",
                    //   mb: 4,
                    //   mt: 4,
                    // }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {specialtyOptions.map((specialty, index) => (
                      <MenuItem key={index} value={specialty}>
                        {specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
              {/* </div> */}
              <div style={{ display: "flex", gap: "160px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isFormChanged}
                  onClick={handleUpdateProfile}
                  sx={{
                    width :{md:"175px",xs:"100px"},
                    height :{md : "60px",xs : "40px"}
                  }}
                  // style={{
                  //   width: "175px",
                  //   height: "60px",
                  // }}
                >
                  Submit
                </Button>
              </div>
              </Grid>
            </FormGroup>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileComponent;