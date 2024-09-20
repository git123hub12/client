import { useEffect, useState } from "react";
import axios from "axios";
import { fetchDeviceAndIPInfo, logout, ssoLogout } from "../../controller/registerController";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
} from "../../localStorageComp/storage";
import AudioRecorderComponent from "../audioRecorder/audioRecorderComponent";
import SOAPNoteFrame from "./soapNote/soapNoteComponent";
import SoapNoteHistoryComponent from "./soapNote/soapNoteHistory/soapNoteHistort";
import ProductAppBar from "../productAppBar/ProductAppBar";
import { Box, Button, Container, Grid, Icon, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
interface MyNotesComponentProps {
  recording: (b: boolean) => void;
}
const MyNotesComponent: React.FC<MyNotesComponentProps> = ({ recording }) => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showProcessing, setShowProcessing] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<any>();
  const [component, setComponent] = useState<any>();
  const [showTranscription, setShowTranscription] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUserInitialized, setIsUserInitialized] = useState(false);
  const [isProfileClicked,setIsProfileClicked] = useState<boolean>(false);
  const [isAudioDialogOpen , setIsAudioDialogOpen] = useState<boolean>(false); //S- Added state for dialog to handle recorded audio session

  const [isImage1, setIsImage1] = useState(true);

  const handleToggle = () => {
    setIsImage1((prev) => !prev);
  };
  const [isGetUserDone, setIsGetUserDone] = useState(false);
  const [reloadAppBar,setReloadAppBar] = useState(false);
  useEffect(() => {
    const initializeUser = async () =>{
      if (!isGetUserDone) {
        await getUser();
        setIsGetUserDone(true);
      }
      const userData: any = await getDataFromLocalStorage("user");
      if (!userData?.token) {
        navigate("/");
      }else if(!userData.isSubscribed){
        navigate("/subscription");
      }
      setIsUserInitialized(true);
    }
    initializeUser();
  }, []);

  const getUser = async () => {
    // by the time user comes through manual login locastorage should be filled with user details and token so this function doesn't need to execute
    
    let token;
    if(searchParams.has('token')) token = searchParams.get('token');
    if(!token){
      return;
    }
    setSearchParams({});
    setIsGetUserDone(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    const url = `${apiUrl}/api/auth/login/success`;
    // const url = `http://localhost:8000/api/auth/login/success`;
    const DeviceInfo = await fetchDeviceAndIPInfo();
    const{deviceBrand,deviceModel,city,state} = DeviceInfo;


    const Info = deviceBrand;
    const ip = (`${city},${state}`);
    try {
      let config;
      if(token) {
        config = {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
      else config = { withCredentials: true
       }
      const devData ={
          Info,ip
      }
      const response = await axios.post(url,devData, config,);
      const { data } = response;
      if (!data.error) {
        await saveDataToLocalStorage("user", {
          email: data.data.user.email,
          fullname : data.data.user.fullname,
          id : data.data.user.id,
          isSubscribed : data.data.user.isSubscribed,
          token: data.token,
          SessionId: data.data.user.SessionId,
          login : data.data.user.login
          // user: data.user,
        });
        setReloadAppBar(true);  //this will reload the component after adding the user to localstorage in case of google sign in
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleTranscriptionUpdate = (newTranscription: string) => {
    if (
      newTranscription !== null &&
      newTranscription !== undefined &&
      newTranscription !== ""
    ) {
      setTranscription(newTranscription);
      setShowTranscription(true);
    } else {
      throw Error("Error while transcribing");
    }
  };

  const handleComponentUpdate = (comp: string) => {
    if (comp !== null && comp !== undefined && comp !== "") {
      setComponent(comp);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <ProductAppBar
        open={open}
        showMenu={true}
        setOpen={setOpen}
        isRecording = {isRecording}
        showProcessing = {showProcessing}
        recordings = {recordings}
        setIsProfileClicked = {setIsProfileClicked}
        setIsAudioDialogOpen = {setIsAudioDialogOpen}
      />
      <Grid
        component={Paper}
        container
        columnGap={4}
        sx={{
          // height: 'calc(100%-64px)', 
          justifyContent: "center",
          overflowY: "scroll",
        }}
      >
        
        <Grid xs={1} sm={1} md={4}>
          {/* <Button onClick={() => setShowTranscription(false)} style={{marginLeft: '77%',marginTop: '2%',marginBottom: '2%', backgroundColor: '#0085FE', color: 'white', borderRadius: '10px', border: 'none', padding: '8px 16px'  }}>
            <AddIcon></AddIcon>New Note
          </Button> */}
          {isUserInitialized && (
          <SoapNoteHistoryComponent
            show = {setShowTranscription}
            open={open}
            setOpen={(newOpen: boolean) => setOpen(newOpen)}
            onTranscriptionUpdate={handleTranscriptionUpdate}
            onComponentUpdate={handleComponentUpdate}
            recordings = {recordings}
            setRecordings = {setRecordings}
            isRecording = {isRecording}
            showProcessing = {showProcessing}
          />
          )}
        </Grid>
        <Grid
          xs={11}
          sm={11}
          md={7}
          sx={{
            // height: "85vh",
            mt: 2,
          }}
        >
          {showTranscription ? (
            <SOAPNoteFrame
              transcriptionData={transcription}
              componentUpdate={component}
            />
          ) : (
            <>
              <AudioRecorderComponent
                onTranscriptionUpdate={handleTranscriptionUpdate}
                onComponentUpdate={handleComponentUpdate}
                recordings={recordings}
                setRecordings={setRecordings}
                isRecording = {isRecording}
                setIsRecording={setIsRecording}
                idleBox = {recording}
                showProcessing = {showProcessing}
                setShowProcessing={setShowProcessing}
                dialogOpen = {isAudioDialogOpen}
                setDialogOpen = {setIsAudioDialogOpen}
                isProfileClicked = {isProfileClicked}
                setIsProfileClicked = {setIsProfileClicked}
              />
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyNotesComponent;
