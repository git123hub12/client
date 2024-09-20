import axios, { AxiosError } from "axios";
import CryptoJS from "crypto-js";
import { getDataFromLocalStorage, saveDataToLocalStorage } from "../localStorageComp/storage";
import { Password } from "@mui/icons-material";


const SERVER_URL = process.env.REACT_APP_API_URL;
// this function will get the jwt token of the user from localstorage
/**
 * 
 * @returns tokens from localstorage
 */
const getToken = async ()=>{
  const userJson = localStorage.getItem("user");
  // Check if the item exists
  if (!userJson) {
    return null;
  }
  
  // Parse the JSON string into an object
  const user = JSON.parse(userJson);
  
  // Check if the token key exists in the object
  if (!user.data.token) {
    return null;
  }
  // Return the token
  return user.data.token; 
}



export const registerUser = async (userData: any) => {
  try {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(userData);

    // Ensure proper UTF-8 encoding for the data
    const utf8Data = CryptoJS.enc.Utf8.parse(jsonString);

    // Use a secret key for encryption (replace 'your-secret-key' with an actual secret key)
    const secretKey = "your-secret-key";

    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(utf8Data, secretKey).toString();

    const response = await axios.post(`${SERVER_URL}/api/user/signup`, {
      encrypted: encrypted,
    },{withCredentials:true});
    // const response = await axios.post(`${SERVER_URL}/user/signup`, userData);

    return response.data;
  } catch (error) {
    // Handle error (e.g., show a notification or log it)
    console.error("Error registering user:", error);
    throw error;
  }
};

// fetch active session
export const fetchActiveSession = async (userId:any) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/auth/fetchSession/${userId}`,{withCredentials:true});
    return response.data; // Return the session data
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    throw error;
  }
};

// Manual login
export const loginUser = async (userData: any) => {
  try {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(userData);

    // Ensure proper UTF-8 encoding for the data
    const utf8Data = CryptoJS.enc.Utf8.parse(jsonString);

    // Use a secret key for encryption (replace 'your-secret-key' with an actual secret key)
    const secretKey = "your-secret-key";

    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(utf8Data, secretKey).toString();

    const response = await axios.post(`${SERVER_URL}/api/user/signin`, {
      encrypted: encrypted,
    },{withCredentials:true});
    return response.data;
  } catch (error : unknown) {
    // Check if the error is an AxiosError
    if(error && (error as AxiosError).response){
      const axiosError = error as AxiosError;
      console.error("Error logging in user:", axiosError);
      return axiosError?.response?.data;
    }else {
      // Handle other types of errors
      console.error("Error logging in user:", error);
      return null;
    }
  }
};

let headers: any = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");
headers.append('Origin','http://localhost:3000');

// google login
export const googleLogin = async () => {
  try {
    window.open(`${SERVER_URL}/api/auth/google/`, "_self");
  } catch (error) {
    // Handle error (e.g., show a notification or log it)
    console.error("Error during Google login:", error);
    throw error;
  }
};



// facebook login
export const facebookLogin = async () => {
  try {
    window.open(`${SERVER_URL}/api/auth/facebook/`, "_self");
  } catch (error) {
    // Handle error (e.g., show a notification or log it)
    console.error("Error during Google login:", error);
    throw error;
  }
};


//logout
export const ssoLogout = async (SessionId: any) => {
  try {
    const body = {SessionId};
    const response = await axios.post(`${SERVER_URL}/api/auth/logout`,body,{withCredentials:true});
    // window.open(`${SERVER_URL}/api/auth/logout`, "_self");
    return response;
  } catch (error) {
    // Handle error (e.g., show a notification or log it)
    console.error("Error during Google login:", error);
    throw error;
  }
};

// logout functionality
export const logout = async () => {
  try {
    window.open(`${SERVER_URL}/api/auth/logout`, "_self");
  } catch (error) {
    // Handle error (e.g., show a notification or log it)
    console.error("Error during Google login:", error);
    throw error;
  }
};



// transcribe api call
export const transcribeCall = async (formData: any) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/transcribe`, formData,{withCredentials:true});

    return response.data;
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
};

// save soap not  api call
export const soapNoteCall = async (soapNote: any) => {
  try {
    // Make an API request to the server to save the SOAP note
    const response = await axios.post(`${SERVER_URL}/api/soapNote`, soapNote,{withCredentials:true});

    return response.data;
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
};

// save soap not  api call
export const soapNoteHistoryCall = async (data: any) => {
  try {
    // Make an API request to the server to save the SOAP note
    const response = await axios.post(`${SERVER_URL}/api/soapNote/history`, {
      data,
    },{withCredentials : true});

    return response.data;
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
};
export const fetchDeviceAndIPInfo = async () => {
  // Extract the user agent
  const userAgent = navigator.userAgent;

  let deviceBrand = 'Device login';
  let deviceModel = ' ';
  try {
    const ipResponse = await fetch("https://api.ipify.org/?format=json");
    if (!ipResponse.ok) {
      throw new Error(
        `Error fetching IP: ${ipResponse.status} ${ipResponse.statusText}`
      );
    }
    // Parse the IP address from the response
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;
    console.log("Fetched IP Address:", ipAddress);

    // Use the fetched IP address with ipinfo.io API
    const apiUrl = `https://ipinfo.io/${ipAddress}/json`;
    const apiInfoResponse = await fetch(apiUrl);
    if (!apiInfoResponse.ok) {
      throw new Error(
        `Error fetching API info: ${apiInfoResponse.status} ${apiInfoResponse.statusText}`
      );
    }

    // Parse the API response
    const apiInfoData = await apiInfoResponse.json();
    const city = apiInfoData.city || "Unknown";
    const state = apiInfoData.region || "Unknown";
    const country = apiInfoData.country || "Unknown"; // Un-comment if needed

    return {
      deviceBrand,
      deviceModel,
      city,
      state,
      // country, // Un-comment if needed
    };
  } catch (error) {
    console.error("Error fetching device or location information:", error);
    return {
      deviceBrand: "Device login",
      deviceModel: " ",
      city: "NA",
      state: "NA",
      // country: "Unknown", // Un-comment if needed
    };
  }
};


// get soapnote details call
export const soapNotedetails = async (id: any) => {
  try {
    // Make an API request to the server to save the SOAP note
    const response = await axios.post(`${SERVER_URL}/api/soapNote/details`, {
      id,
    },{withCredentials : true});

    return response.data;
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
};


// deleteSoapNote
export const deleteNote = async (id: any) => {
  try {
    // Make an API request to the server to delete the SOAP note
    const response = await axios.post(`${SERVER_URL}/api/soapNote/delete`, {
      id,
    },{withCredentials : true});

    return response.data;
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
};
// reset from Login security
export const resetinpage = async (currentpassword:any,password: any, id: any) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/userPassword/page-reset`, { currentpassword,password, id },{withCredentials : true});
    
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
// send reset password email

export const changepassword = async (email: any) => {
  try {
    // await setEmail(email);
    // localStorage.setItem("email",email);
    const response = await axios.post(
      `${SERVER_URL}/api/userPassword/request-reset`,
      { email },{withCredentials : true}
    );
    // const response = await axios.post(`${SERVER_URL}/user/signup`, userData);

    return response.data;
  } catch (error) {
    console.error("Error finding user email:", error);
    throw error;
  }
};

export const resetpassword = async (url: any, password: any) => {
  try {
    // const val = userEmail;
    const response = await axios.post(`${SERVER_URL}/api/userPassword/reset`, {
      url,
      password,
    },{withCredentials : true});

    return response.data;
  } catch (error) {
    console.error("Error finding user email:", error);
    throw error;
  }
};

// Save user details- data to the userDetail table

export const saveUserDetails = async (userId: string, userData: any) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/userDetails/${userId}`, {
      ...userData,
    },{withCredentials : true});
    return response.data;
  } catch (error) {
    if (error && (error as AxiosError).response) {
      const axiosError = error as AxiosError;
      return axiosError?.response?.data;
    } else {
      console.error("Error saving user details:", error);
      throw error;
    }
  }
};


// Get user details- data from the userDetail table
export const getUserDetails = async (userId: string) => {
  try {

    

    const response = await axios.get(`${SERVER_URL}/api/userDetails/${userId}`,{withCredentials : true})

    return response.data;
  } catch (error) {
    // Handle error (e.g., show a notification or log it)
    console.error("Error getting user details:", error);
    throw error;
  }
};


export const fetchAndStoreUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/userDetails/${userId}`,{withCredentials : true});
    if (response.data.status === 'SUCCESS') {
      const { user, userDetails } = response.data.data;
      const userData = { ...user, userDetails };
     saveDataToLocalStorage("userDetails", { userDetails });
    const localUserData = await getDataFromLocalStorage("user");
    localUserData.isSubscribed = user.isSubscribed;   // when user redirects to /profile after payment then this line will update the user in localstorage
    saveDataToLocalStorage("user",localUserData);
      return userData;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
export const fetchIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json',{withCredentials : true});
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown';
  }
};