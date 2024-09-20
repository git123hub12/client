import React, { useEffect, useRef, useState } from "react";
import { Recorder } from "vmsg";
import { transcribeCall,getUserDetails } from "../../controller/registerController";
import SineWavesComponent from "./sineWave/sinewaveComponent";
import { useData } from "../../context/dataContext";
import { getDataFromLocalStorage } from "../../localStorageComp/storage";
import { soapNoteCall } from "../../controller/registerController"; 
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, Stack } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { Box, keyframes } from "@mui/system";
import { styled } from "@mui/material/styles";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { useNavigate } from "react-router-dom";
import CustomizableDialogBox from "../../components/CustomizableDialogBox";

const recorder = new Recorder({
  // webassembly url, here we are providing full address of ffmpg library which hosted on cdn
  wasmURL: "https://unpkg.com/vmsg@0.4.0/vmsg.wasm",
});

interface AudioRecorderProps {
  onTranscriptionUpdate: (newTranscription: string) => void;
  onComponentUpdate: (newTranscription: string) => void;
  recordings : Blob[];
  setRecordings: React.Dispatch<React.SetStateAction<Blob[]>>;
  isRecording : boolean;
  setIsRecording : React.Dispatch<React.SetStateAction<boolean>>;
  idleBox :(b: boolean) => void;
  showProcessing : boolean;
  setShowProcessing : React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen : boolean;
  setDialogOpen : React.Dispatch<React.SetStateAction<boolean>>;
  isProfileClicked : boolean;
  setIsProfileClicked : React.Dispatch<React.SetStateAction<boolean>>;
}
const AudioRecorderComponent: React.FC<AudioRecorderProps> = ({
  onTranscriptionUpdate,
  onComponentUpdate,
  recordings,
  setRecordings,
  isRecording,
  setIsRecording,
  idleBox,
  showProcessing,
  setShowProcessing,
  dialogOpen,
  setDialogOpen,
  isProfileClicked,
  setIsProfileClicked,
}) => {
  const blink = keyframes`
  from { opacity: 0; }
  to { opacity: 1; width: 150%; height: 150%}
`;
  const pulse = keyframes`
    0% {
      transform: scale(0.95);
      opacity: 0.70
    }
  
    70% {
      transform: scale(1);
      opacity: 1
    }
  
    100% {
      transform: scale(0.95);
      opacity: 0.70
    }
  `;
  const BlinkedBox = styled("div")({
    animation: `${pulse} 2s infinite`,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert,setAlert] = useState<boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
  const [paused, setPaused] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  
  const [currentSoapNoteId, setCurrentSoapNoteId] = useState("");
  
  const [soapNoteCompleted, setSoapNoteCompleted] = useState(false);

  // const [recordings,setRecordings] = useState<any>([]);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // Added for confirmation dialog
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [recordingFile,setRecordingFile] = useState("");
  const [finalRecording,setFinalRecording] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [billingCodesData, setBillingCodesData] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  // const [showResult, setShowResult] = useState<boolean>(false);
  const { globalData } = useData();

  // const [showProcessing, setShowProcessing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { setGlobalData } = useData();
  const navigate = useNavigate();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")} h : ${minutes
      .toString()
      .padStart(2, "0")} m : ${remainingSeconds.toString().padStart(2, "0")} s`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {

        console.log("inside fetch personal info");
        const email = getDataFromLocalStorage("user")?.email;
        console.log("email", email);
  
        // const response = await axios.get(
        //   "http://localhost:8000/api/personalinfo/UserInfo"

      } catch (error) {
        console.error("Error fetching personalinfo:", error);
      }
    };

    fetchPersonalInfo();
  }, []);

  // Added function to handle confirmation before recording
  const handleRecordingClick = () => {
    if (recordings.length > 0 && !isRecording) {
      setConfirmationDialogOpen(true);
    } else {
      handleRecording();
    }
  };

  const handleRecording = async () => {
    setIsLoading(true);
    setRecordingFile("");
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
    if (isRecording) {
      const blob = await recorder.stopRecording();
      setRecordings((prevRecordings)=>{
        const newRecordings = [...prevRecordings,blob];
        concatenateBlobs(newRecordings);
        return newRecordings;
      });
      setIsLoading(false);
      setIsRecording(false);
      setRecordingComplete(true);
      setTimer(0);
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        setIsLoading(false);
        setIsRecording(true);
        idleBox(true);
        setRecordingComplete(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const concatenateBlobs = async (blobs : Blob[]) =>{
    console.log("Recording length",recordings.length);
    if(blobs.length == 1){
      setFinalRecording(URL.createObjectURL(blobs[0]));
    }else if( blobs.length > 1 ){
      const concatenatedBlob = new Blob(blobs, { type: 'audio/wav' });
      setFinalRecording(URL.createObjectURL(concatenatedBlob));
    }
  }

  // const handleProcessing = async () => {
  //   setShowProcessing(true);
  //   setProcessing(true);

  //   try {
  //     const blob = await fetch(recordings[0]).then((response) =>
  //       response.blob()
  //     );
  //     const formData = new FormData();
  //     formData.append("audio", blob);
  //     //   const email = getDataFromLocalStorage('user')?.email;
  //     // Retrieve the email from local storage
  //     const userData = getDataFromLocalStorage('user');
  //     const email = userData?.email;

  //     // Check if the email exists and append it to FormData
  //     if (email) {
  //         formData.append("email", email);
  //     } else {
  //         console.error("No email found in local storage.");
  //     }

  //     setGlobalData({ audio: { url: URL.createObjectURL(blob), blob: blob } });

  //     // Wait for the API call to complete before proceeding
  //     const result = await transcribeCall(formData);

  //     if (result !== null && result !== undefined && result.status === 200) {
  //       // setShowResult(true);
  //       // setTranscription(result.transcription);
  //       // Call the callback function to update the parent component's state
  //       console.log("RESULT--->", result);
  //       console.log("COMBINED TRANSC : ",result.combinedTranscription)
        
  //       console.log("COMBINED message : ",result.soapData.message.content)


  //       const data = result.soapData.message.content;
  //       setBillingCodesData(result.billingCodes);
  //       const splitAfterWord = "SOAP Note:";
  //       const note = data.split(splitAfterWord);
  //       const stringWithoutNewLine = note[1]?.replace(/\n/g, "");
  //       const [subjective, rest] = stringWithoutNewLine
  //         ?.replace("Subjective:", "")
  //         ?.split("Objective:");
  //       const [objective, rest1] = rest?.split("Assessment:");
  //       const [assessment, plan] = rest1?.split("Plan:");

  //       console.log("IN AUDIO RECODER COMPONENT AFTER SPLITTING IS DONE");

  //       const cleanSubjective = subjective.trim();
  //       const cleanObjective = objective.trim();
  //       const cleanAssessment = assessment.trim();
  //       const cleanPlan = plan?.trim();
  //       console.log("cleanSubjective", cleanSubjective);
  //       console.log("cleanObjective", cleanObjective);
  //       console.log("cleanAssessment", cleanAssessment);
  //       console.log("cleanPlan", cleanPlan);
  //       console.log("COMBINED TRANSC : ",result.combinedTranscription);
  //       const chiefComplaint = result.chiefComplaint

  //       automaticSave(
  //         cleanSubjective,
  //         cleanObjective,
  //         cleanAssessment,
  //         cleanPlan,
  //         chiefComplaint,
  //         result.combinedTranscription,
  //         blob
  //       );

  //       onTranscriptionUpdate(result);
  //       onComponentUpdate("audioRecorderComponent");
  //     } else {
  //       // setShowResult(false);
  //     }
  //   } catch (error) {
  //     console.error("Error during audio processing:", error);
  //   }
  //   setShowProcessing(true);
  //   setProcessing(true);
  // };

  // modyfying handleRecord Functionality (maaz)
  // const handleRecording = async () => {
  //   setIsLoading(true);
  
  //   if (isRecording) {
  //     // If currently recording, stop and save the recording
  //     if (paused) {
  //       // If recording is paused, resume recording
  //       recorder.resumeRecording();
  //       setPaused(false);
  //     } else {
  //       // If recording is active, pause the recording
  //       recorder.pauseRecording();
  //       setPaused(true);
  //     }
  //   } else {
  //     // If not recording, start recording
  //     try {
  //       await recorder.initAudio();
  //       await recorder.initWorker();
  //       recorder.startRecording();
  //       setIsRecording(true);
  //       setPaused(false);
  //     } catch (error) {
  //       console.error("Error starting recording:", error);
  //     }
  //   }
  
  //   setIsLoading(false);
  // };

  // // implementing direct uploading file logic by maaz

  // function for dialog box closing

  const handleCloseDialog = (confirm : boolean) => {
    setDialogOpen(false);
    if(!confirm && isProfileClicked){
      setIsProfileClicked(false);
      return;
    }else if(confirm && isProfileClicked){
      setIsProfileClicked(false);
      navigate('/profile');
      return;
    }
    if (confirm && pendingFile) {
      handleFileSelect(pendingFile);
      setPendingFile(null);
      setRecordings([]);
    }
    else if(!confirm && fileInputRef.current){
      fileInputRef.current.value = "";
    }
  };

  // function to handle outside click of confirmation dialog box

  const handleConfirmationDialogOutsideClick = () =>{
    setConfirmationDialogOpen(false);
  }

  // function for handling action of confirmation dialog box

  const handleConfirmationDialogBox = (confirm : boolean) =>{
    if(confirm){
      handleRecording();
    } else if(!confirm){
      handleProcessing();
    }
    setConfirmationDialogOpen(false);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (recordings && recordings.length > 0) {
        setPendingFile(file);
        setDialogOpen(true);
      } else {
        handleFileSelect(file);
      }
    }
  };

  const handleFileSelect = (file : File) => {
    const fileUrl = URL.createObjectURL(file);
    if (file) {
      setRecordingFile(fileUrl);
      setFinalRecording(fileUrl);
      setGlobalData({ audio: { url: fileUrl, blob: file } });
      setRecordingComplete(true);
    }
  };
  
  const handleProcessing = async () => {
    setShowProcessing(true);
    setProcessing(true);
    idleBox(false);
    try {
      const blob = await fetch(finalRecording).then((response) =>
        response.blob()
      );
      const formData = new FormData();
      formData.append("audio", blob);
      console.log("form data in audio component",formData);
      const userData = getDataFromLocalStorage('user');
      const email = userData?.email;

      if (email) {
        formData.append("email", email);
      } else {
        console.error("No email found in local storage.");
      }

      const result = await transcribeCall(formData);

      if (result !== null && result !== undefined && result.status === 200) {
        // setShowResult(true);
        // setTranscription(result.transcription);
        // Call the callback function to update the parent component's state
        console.log("RESULT--->", result);
        console.log("COMBINED TRANSC : ", result.combinedTranscription);

        console.log("COMBINED message : ", result.soapData);
        if(recordings && recordings.length > 0){
          setRecordings([]);
        }
        const data = result.soapData;
        setBillingCodesData(result.billingCodes);
        console.log("IN AUDIO RECODER COMPONENT AFTER SPLITTING IS DONE");
        const subjective = data.Subjective;
        const objective = data.Objective;
        const assessment = data.Assessment;
        const plan = data.Plan;
        const cleanSubjective = subjective.trim();
        const cleanObjective = objective.trim();
        const cleanAssessment = assessment.trim();
        const cleanPlan = plan?.trim();
        console.log("cleanSubjective", cleanSubjective);
        console.log("cleanObjective", cleanObjective);
        console.log("cleanAssessment", cleanAssessment);
        console.log("cleanPlan", cleanPlan);
        console.log("COMBINED TRANSC : ", result.combinedTranscription);
        const chiefComplaint = result.chiefComplaint;

        await automaticSave(
          cleanSubjective,
          cleanObjective,
          cleanAssessment,
          cleanPlan,
          chiefComplaint,
          result.combinedTranscription,
          result.billingCodes,
          blob
        );

        onTranscriptionUpdate(result);
        onComponentUpdate("audioRecorderComponent");

        // Update state or perform other actions as needed
      }else if(result !== null && result !== undefined && result.status === 400){
        setAlert(true);
        // auto remove alert message after 10s
        setTimeout(()=>{
          setAlert(false);
        },10000)
      }
       else {
        console.log("Failed to transcribe audio.");
      }
    } catch (error) {
      console.error("Error during audio processing:", error);
    }

    setShowProcessing(false);
    setProcessing(false);
  };


 /**
 * Automatically saves a SOAP note along with an audio recording.
 * 
 * @param subjectiveText - The subjective component of the SOAP note.
 * @param objectiveText - The objective component of the SOAP note.
 * @param assessmentText - The assessment component of the SOAP note.
 * @param planText - The plan component of the SOAP note.
 * @param transcriptedText - The text transcripted from the audio.
 * @param audioBlob - The audio data as a blob.
 */
/**
 * Automatically saves a SOAP note along with an audio recording.
 * 
 * @param subjectiveText - The subjective component of the SOAP note.
 * @param objectiveText - The objective component of the SOAP note.
 * @param assessmentText - The assessment component of the SOAP note.
 * @param planText - The plan component of the SOAP note.
 * @param transcriptedText - The text transcripted from the audio.
 * @param audioBlob - The audio data as a blob.
 */
const automaticSave = async (
  subjectiveText: string,
  objectiveText: string,
  assessmentText: string,
  planText: string,
  chiefComplaint: String,
  transcriptedText: string,
  billingCodesText : string,
  audioBlob: Blob
): Promise<void> => {
  setIsLoading(true);
  console.log("Starting automatic save process...");

  try {
    const user = getDataFromLocalStorage("user");
    console.log("User data retrieved from storage:", user?.email);

    const newSoapNote = {
      email: user?.email,
      subjective: subjectiveText,
      objective: objectiveText,
      assessment: assessmentText,
      plan: planText,
      chiefComplaint: chiefComplaint,
      completed: soapNoteCompleted,
      transcriptedText,
      consolidatedText: {
        subjective: subjectiveText,
        objective: objectiveText,
        assessment: assessmentText,
        plan: planText,
      },
      billingCodesText: billingCodesText,
    };

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("newSoapNote", JSON.stringify(newSoapNote));

    console.log("FormData prepared for submission.",newSoapNote);
    console.log("soap note form data",formData);
    
    const response = await soapNoteCall(formData);
    console.log("Server response received:", response);

    if (response.status === "Success") {
      console.log("SOAP note saved successfully:", response.soapNoteId);
      setCurrentSoapNoteId(response.soapNoteId);
      setIsLoading(false);
      setShowSuccessMessage(true);
      window.location.reload();
      //navigate("/notes"); // Uncomment to navigate without reloading the page
    } else {
      console.log("Failed to save SOAP note:", response.error);
      setShowErrorMessage(true);
    }
  } catch (error: any) {
    console.error("Error during the automatic save process:", error instanceof Error ? error.message : String(error));
    setShowErrorMessage(true);
  } finally {
    setIsLoading(false); // This will execute regardless of try/catch result
  }
};


// const automaticSave = async (
//   subjectiveText: any,
//   objectiveText: any,
//   assessmentText: any,
//   planText: any,
//   transcriptedText: any,
//   audioBlob: any
// ) => {
//   setIsLoading(true);
//   console.log("Starting automatic save process...");

//   try {
//     const user:any = getDataFromLocalStorage("user");
//     console.log("User data retrieved from storage:", user?.email);

//     const newSoapNote:any = {
//       email: user?.email,
//       subjective: subjectiveText,
//       objective: objectiveText,
//       assessment: assessmentText,
//       plan: planText,
//       completed: soapNoteCompleted,
//       transcriptedText,
//       consolidatedText: {
//         subjective: subjectiveText,
//         objective: objectiveText,
//         assessment: assessmentText,
//         plan: planText,
//       },
//       billingCodesText: billingCodesData,
//     };

//     const formData = new FormData();
//     formData.append("audio", audioBlob);
//     formData.append("newSoapNote", JSON.stringify(newSoapNote));

//     console.log("FormData prepared for submission.");
    
//     const response = await soapNoteCall(formData);
//     console.log("Server response received:", response);

//     if (response.status === "Success") {
//       console.log("SOAP note saved successfully:", response.soapNoteId);
//       setCurrentSoapNoteId(response.soapNoteId);
//       setIsLoading(false);
//       setShowSuccessMessage(true);
//       // Reload the page
//       // window.location.reload();
//       // Optionally, use navigate to redirect user without reloading the entire page.
//        navigate("/notes");
//     } else {
//       console.log("Failed to save SOAP note:", response.error);
//       setShowErrorMessage(true);
//     }
//       console.log("Failed to save SOAP note:", response.error);
//   } catch (response.error) {
//     console.error("Error during the automatic save process:", response.error.message);
//     setIsLoading(false);
//     setShowErrorMessage(true);
//   } finally {
//     // Always turn off the loading indicator
//     setIsLoading(false);
//   }
// };



  // useEffect(() => {
  //   const handleRecordingDocumentClick = (event : any) => {
  //     // Check if recording is ongoing and if the clicked element is not the recording button
  //     if (isRecording) {
  //       alert("Please wait until recording is complete.");
  //     }
  //   };
  
  //   // Add event listener to capture clicks on the document
  //   document.addEventListener("click",handleRecordingDocumentClick);
  
  //   // Cleanup function to remove event listener when component unmounts
  //   return () => {
  //     document.removeEventListener("click", handleRecordingDocumentClick);
  //   };
  // }, [isRecording]);

  // useEffect(() => {
  //   const handleDocumentClick = (event: any) => {
  //     // Check if processing is ongoing and if the clicked element is not the button
  //     // if (processing && event.target.tagName !== "BUTTON") {
  //     //   alert("Please wait until processing is complete.");
  //     //   const clickedElement = event.target;
  //     // const isButtonOrChildOfButton = clickedElement.tagName === "BUTTON" || clickedElement.closest("button");

  //     // if (processing && !isButtonOrChildOfButton) {
  //     //   alert("Please wait until processing is complete.");
  //     // }
  //     // if (processing) {
  //     //   alert("Please wait until processing is complete.");
  //     // }

  //     // }
  //   };

  //   // Add event listener to capture clicks on the document
  //   document.addEventListener("click", handleDocumentClick);

  //   // Cleanup function to remove event listener when component unmounts
  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, [processing]);

  return (
    <>
      {alert && <Alert severity="warning">You have insufficient medical information to generate accurate SOAP Notes.</Alert>}
      <Grid display="flex" justifyContent="center" alignItems="center">
        {showProcessing ? (
          <SineWavesComponent />
        ) : (
          <div>
            <div>
              <Button
                size="large"
                sx={{
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
                onClick={handleRecordingClick}
                disabled={isLoading}
              >
                {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}> */}
                {!isRecording ? (
                  <MicIcon
                    style={{
                      display: "grid",
                      placeItems: "center",
                      fontSize: "35vh",
                      marginTop: "50%",
                    }}
                  ></MicIcon>
                ) : (
                  <BlinkedBox>
                    <RecordVoiceOverIcon
                      color="error"
                      style={{
                        display: "grid",
                        placeItems: "center",
                        fontSize: "35vh",
                        marginTop: "50%",
                      }}
                    ></RecordVoiceOverIcon>
                  </BlinkedBox>
                )}
                {/* </div> */}
              </Button>
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Chip
                label={formatTime(timer)}
                variant="outlined"
                sx={{ alignSelf: "center" }}
              />
            </div>
          </div>
        )}
      </Grid>

      <Grid display="flex" justifyContent="center" alignItems="center">
        <Stack
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {finalRecording && (
            <Paper sx={{}}>
              <audio src={finalRecording} controls />
            </Paper>
          )}
        </Stack>
      </Grid>
      <div>
      <input type="file" accept="audio/*" onChange={handleInputChange} ref={fileInputRef} disabled={isRecording || showProcessing} />
      </div>
      <Grid display="flex" justifyContent="center" alignItems="center">
        {recordingComplete && (
          <Button onClick={handleProcessing}>
            {showProcessing ? "Processing....." : "Start Processing"}
          </Button>
        )}
      </Grid>
      <Box>
      <CustomizableDialogBox title = "Warning" open = {dialogOpen} handleOutsideClick={()=>{handleCloseDialog(false)}} handleCloseDialog={()=>{handleCloseDialog(false)}} handleConfirmDialog={()=>{handleCloseDialog(true)}} message={"You are about to lose the recorded file. Do you wish to continue?"} cancelButtonName={"Cancel"} confirmButtonName={"Confirm"} />
      <CustomizableDialogBox title="Warning" open = {confirmationDialogOpen} handleOutsideClick={()=>{handleConfirmationDialogOutsideClick()}} handleCloseDialog = {()=>{handleConfirmationDialogBox(false)}} handleConfirmDialog = {()=>{handleConfirmationDialogBox(true)}} message={"Would you like to continue your recording or generate SOAP notes?"} cancelButtonName={"Start Processing"} confirmButtonName={"Continue Recording"} />
      </Box>
    </>
  );
};

export default AudioRecorderComponent;
