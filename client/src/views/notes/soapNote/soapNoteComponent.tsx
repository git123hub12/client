import React, { useEffect, useState } from "react";
import { soapNoteCall } from "../../../controller/registerController";
import { getDataFromLocalStorage } from "../../../localStorageComp/storage";
import LoadingOverlay from "../../loading/loadingComponent";
import { useData } from "../../../context/dataContext";
import { deleteNote } from "../../../controller/registerController";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DoneIcon from "@mui/icons-material/Done";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Container
} from "@mui/material";
import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BillingCodesTable from "../../../components/BillingCodesTable";
import CustomizableDialogBox from "../../../components/CustomizableDialogBox";

interface SOAPNoteFrameProps {
  transcriptionData: any;
  componentUpdate: any;
}


const SOAPNoteFrame: React.FC<SOAPNoteFrameProps> = ({
  transcriptionData,
  componentUpdate,
}) => {
  console.log(
    "transcriptionData =>",
    transcriptionData,
    transcriptionData.transcriptionResponse
  );
  const navigate = useNavigate();
  const [billingCodesData, setBillingCodesData] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [createdAt, setCreatedAt] = useState("");
  const [subjectiveText, setSubjectiveText] = useState("");
  const [objectiveText, setObjectiveText] = useState("");
  const [assessmentText, setAssessmentText] = useState("");
  const [planText, setPlanText] = useState("");
  const [currentSoapNoteId, setCurrentSoapNoteId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transcriptedText, setTranscriptedText] = useState("");
  const [soapNoteCompleted, setSoapNoteCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isEditingTitle,setIsEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [soapNoteTitle,setSoapNoteTitle] = useState("");

  const { globalData } = useData();

  useEffect(() => {
    console.log("global data from audio recoding ", globalData);

    try {
      if (
        componentUpdate === "audioRecorderComponent" &&
        transcriptionData !== null &&
        transcriptionData !== undefined &&
        transcriptionData !== ""
      ) {
        const data = transcriptionData.soapData.message.content;
        // console.log("DATAAAAAA is here ", data);
        const billingCodesData: string = transcriptionData.billingCodes;
        setBillingCodesData(transcriptionData.billingCodes);

        // Specify the word after which you want to split the string
        const splitAfterWord = "SOAP Note:";

        // Use the split method to split the string
        const note = data.split(splitAfterWord);
        const stringWithoutNewLine = note[1]?.replace(/\n/g, "");

        console.log("stringWithoutNewLine", stringWithoutNewLine);

        // Split the string based on the headings
        const [subjective, rest] = stringWithoutNewLine
          ?.replace("Subjective:", "")
          ?.split("Objective:");
        const [objective, rest1] = rest?.split("Assessment:");
        const [assessment, plan] = rest1?.split("Plan:");
        console.log("reaching here");
        // Trim extra whitespaces
        const cleanSubjective = subjective.trim();
        const cleanObjective = objective.trim();
        const cleanAssessment = assessment.trim();
        const cleanPlan = plan?.trim();
        setSubjectiveText(cleanSubjective);
        
        setObjectiveText(cleanObjective);
        
        setAssessmentText(cleanAssessment);
        
        setPlanText(cleanPlan);
        
        console.log(transcriptionData.combinedTranscription);
        setTranscriptedText(transcriptionData.combinedTranscription);
        
        // setTranscriptedText(transcriptionData.transcriptionResponse.text);
        // console.log("TD",transcriptionData.transcriptionResponse.text)
        
        // automaticSave();
        // automaticSave(
        //   cleanSubjective,
        //   cleanObjective,
        //   cleanAssessment,
        //   cleanPlan,
        //   transcriptionData.combinedTranscription
        // );
        console.log("after");
        // Additional logic for audioRecorderComponent...
      } else if (
        componentUpdate === "soapNoteHistoryComponent" &&
        transcriptionData !== null &&
        transcriptionData !== undefined
      ) {
        setSubjectiveText(transcriptionData.soapNote.subjective);
        setObjectiveText(transcriptionData.soapNote.objective);
        setAssessmentText(transcriptionData.soapNote.assessment);
        setPlanText(transcriptionData.soapNote.plan);
        setCreatedAt(transcriptionData.soapNote.createdAt);
        setCurrentSoapNoteId(transcriptionData.soapNote._id);
        console.log("SOAP NOTE ID in soapnote comp",transcriptionData.soapNote._id);
        setTranscriptedText(transcriptionData.soapNote.transcriptedText);
        console.log("TEXT IS HERE", transcriptionData);
        setBillingCodesData(transcriptionData.soapNote.billingCodesText);
        setSoapNoteTitle(transcriptionData.soapNote?.chiefComplaint);
      }
    } catch (error) {
      setErrorMessage("Error while processing soap note");
    }
  }, [transcriptionData, componentUpdate]);

  const handleEditSubjectiveClick = () => {
    setIsEditing(true);
  };

  const handleSaveSubjectiveClick = () => {
    // Perform any save operation, for now, let's just exit edit mode
    setIsEditing(false);
  };

  const handleSubjectiveTextChange = (e: any) => {
    setSubjectiveText(e.target.value);
  };

  const handleEditObjectiveClick = () => {
    setIsEditingObjective(true);
  };

  const handleSaveObjectiveClick = () => {
    // Perform any save operation, for now, let's just exit edit mode
    setIsEditingObjective(false);
  };

  const handleObjectiveTextChange = (e: any) => {
    setObjectiveText(e.target.value);
  };

  const handleEditAssessmentClick = () => {
    setIsEditingAssessment(true);
  };

  const handleSaveAssessmentClick = () => {
    // Perform any save operation, for now, let's just exit edit mode
    setIsEditingAssessment(false);
  };

  const handleAssessmentTextChange = (e: any) => {
    setAssessmentText(e.target.value);
  };

  const handleEditPlanClick = () => {
    setIsEditingPlan(true);
  };

  const handleSavePlanClick = () => {
    // Perform any save operation, for now, let's just exit edit mode
    setIsEditingPlan(false);
  };

  const handlePlanTextChange = (e: any) => {
    setPlanText(e.target.value);
  };

  // Function to delete soapNote

  // const deleteSoapNote = async () => {
  //   try {
  //     console.log("current soap note id", currentSoapNoteId);

  //     await deleteNote({ currentSoapNoteId });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const [copiedSoap, setCopiedSoap] = useState(false);

  const handleCopySoap = () => {
    // const combinedText = `${subjectiveText}\n${objectiveText}\n${assessmentText}\n${planText}`;
    const combinedText = `Subjective: ${subjectiveText}\nObjective: ${objectiveText}\nAssessment: ${assessmentText}\nPlan: ${planText}`;

    navigator.clipboard.writeText(combinedText);
    setCopiedSoap(true);
    setTimeout(() => setCopiedSoap(false), 5000); // Reset copied state after 2 seconds
  };

  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedAssessment, setCopiedAssessment] = useState(false);
  const [copiedObjective, setCopiedObjective] = useState(false);
  const [copied, setCopied] = useState(false); //Global Copy all 

  const handleCopySubjective = () => {
    const combinedText = `${subjectiveText}`;
    navigator.clipboard.writeText(combinedText);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 5000); // Reset copied state after 2 seconds
  };

  const handleCopyAssessment = () => {
    const combinedText = `${assessmentText}`;
    navigator.clipboard.writeText(combinedText);
    setCopiedAssessment(true);
    setTimeout(() => setCopiedAssessment(false), 5000); // Reset copied state after 2 seconds
  };

  const handleCopyObjective = () => {
    const combinedText = `${objectiveText}`;
    navigator.clipboard.writeText(combinedText);
    setCopiedObjective(true);
    setTimeout(() => setCopiedObjective(false), 5000); // Reset copied state after 2 seconds
  };

  const handleCopyPlan = () => {
    const combinedText = `${planText}`;
    navigator.clipboard.writeText(combinedText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 5000); // Reset copied state after 2 seconds
  };

  // Function to handle title change
  const handleTitleChange = (event:any) => {
    setSoapNoteTitle(event.target.value);
  };

  // Function to handle title blur (when input loses focus)
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };
  

  // Function to handle SOAP note submission
  const submitSoapNote = async () => {
    setIsLoading(true);

    try {
      const user: any = getDataFromLocalStorage("user");

      const newSoapNote: any = {
        email: user?.email,
        subjective: subjectiveText,
        objective: objectiveText,
        assessment: assessmentText,
        plan: planText,
        chiefComplaint : soapNoteTitle,
        completed: soapNoteCompleted,
        soapNoteId: currentSoapNoteId,
        transcriptedText: transcriptedText,
        consolidatedText: {
          subjective: subjectiveText,
          objective: objectiveText,
          assessment: assessmentText,
          plan: planText,
        },
        billingCodesText: billingCodesData,
      };
      const formData = new FormData();
      formData.append("audio", globalData.audio.blob);
      formData.append("newSoapNote", JSON.stringify(newSoapNote));

      const response = await soapNoteCall(formData);

      if (response.status === "Success") {
        console.log("response.soapNoteId =>", response.soapNoteId);
        setCurrentSoapNoteId(response.soapNoteId);
        setIsLoading(false);
        setShowSuccessMessage(true);

        // Reload the page
        // window.location.reload();
      } else {
        setShowErrorMessage(true);
      }

      console.log("Server response:", response);
    } catch (error: any) {
      console.error("Error submitting SOAP note:", error.message);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setIsEditingAssessment(false);
      setIsEditingObjective(false);
      setIsEditingPlan(false);
      setOpen(false);
      // You can use setTimeout to hide the success/error message after a few seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000); // Adjust the duration (in milliseconds) as needed
    }
  };
  const getCard = (
    editAction: () => void,
    saveAction: () => void,
    handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    isEditing: boolean,
    header: string,
    contentText: string
  ) => {
    return (
      <Grid
        sx={{
          m: 2,
        }}
      >
        
        <Card variant="outlined">
          <Box>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CardHeader title={header}></CardHeader>
              <CardActions>
                {/* <div>{header === "SUBJECTIVE" ? null : null}</div> */}
                {header === "SUBJECTIVE" && (
                  <Box sx={{ marginRight: "10px" }}>
                    <Button onClick={handleCopySubjective}>
                      {copiedSubject ? <DoneIcon /> : <ContentPasteIcon />}
                    </Button>
                  </Box>
                )}
                {header === "OBJECTIVE" && (
                  <Box sx={{ marginRight: "10px" }}>
                    <Button
                      onClick={handleCopyObjective}
                    >
                      {copiedObjective ? <DoneIcon /> : <ContentPasteIcon />}
                    </Button>
                  </Box>
                )}
                {header === "ASSESSMENT" && (
                  <Box sx={{ marginRight: "10px" }}>
                    <Button
                      onClick={handleCopyAssessment}
                    >
                      {copiedAssessment ? <DoneIcon /> : <ContentPasteIcon />}
                    </Button>
                  </Box>
                )}
                {header === "PLAN" && (
                  <Box sx={{ marginRight: "10px" }}>
                    <Button
                      onClick={handleCopyPlan}
                    >
                      {copiedPlan ? <DoneIcon /> : <ContentPasteIcon />}
                    </Button>
                  </Box>
                )}
                
                </CardActions>
            </div>
          </Box>
          <CardContent>
            {isEditing ? (
              <TextField
                fullWidth
                autoFocus
                id={header + "_txt_field"}
                InputProps={{
                  rows: 5,
                  fullWidth: true,
                  multiline: true,
                  inputComponent: "textarea",
                }}
                value={contentText}
                onChange={handleTextChange}
              />
            ) : (
              <Typography variant="body1" onClick={editAction}>
                {contentText}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderBillingCodes = (
    <Box sx={{ whiteSpace: "pre-wrap"}}>
      <BillingCodesTable setIsEditing = {setIsEditing} billingCodesText = {billingCodesData} setBillingCodesData = {setBillingCodesData} />  
    </Box>
  );
  const [isNoteChanged, setIsNoteChanged] = useState(false);

  const rendersoanote = (
    <div>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      {/* <div className={styles.frameItem} /> */}
      {/* <b className={styles.timeStamp}>{currentSoapNoteId}</b> */}
      {/* <div className={styles.frameInner} /> */}

      <Box
        sx={{
          maxHeight: "85vh",
          backgroundColor: "#D0E9FF",
        }}
        // component={Paper}
        // elevation={6}
      >
        <Box
          sx={{
            position: "relative",
            top: 0,
            zIndex: 1000,
            // backgroundColor: "inherit",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "2%",
            paddingRight: "2%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "rgb(246, 251, 255)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              flexGrow: 1,
              // backgroundColor: "rgb(246, 251, 255)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                display: "block", // Ensure the Typography elements stack vertically
              }}
            >
              {/* SOAP NOTE */}
            </Typography>
            {/* <Typography
              variant="h5"
              sx={{
                display: "block", // Ensure the Typography elements stack vertically
                // position: "relative",
              }}
            >
              {currentSoapNoteId}
            </Typography> */}
          </Box>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ height: "fit-content" }}
            disabled={
              !isEditing &&
              !isEditingAssessment &&
              !isEditingObjective &&
              !isEditingPlan
            }
          >
            SAVE NOTE
          </Button> */}
          
        </Box>
        {/* SUBJECTIVE */}

        {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}> */}
        {getCard(
          handleEditSubjectiveClick,
          handleSaveSubjectiveClick,
          handleSubjectiveTextChange,
          isEditing,
          "SUBJECTIVE",

          subjectiveText
        )}

        {getCard(
          handleEditObjectiveClick,
          handleSaveObjectiveClick,
          handleObjectiveTextChange,
          isEditingObjective,
          "OBJECTIVE",
          objectiveText
        )}
        {getCard(
          handleEditAssessmentClick,
          handleSaveAssessmentClick,
          handleAssessmentTextChange,
          isEditingAssessment,
          "ASSESSMENT",
          assessmentText
        )}

        {getCard(
          handleEditPlanClick,
          handleSavePlanClick,
          handlePlanTextChange,
          isEditingPlan,
          "PLAN",
          planText
        )}

        <Grid>
          <Card
            variant="outlined"
            sx={{
              m: 2,
              // backgroundColor: "lightblue"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CardHeader title={"Consolidated SOAP NOTE"}></CardHeader>
              <Box sx={{ marginRight: "20px" }}>
                <Button
                  onClick={handleCopySoap}
                  // variant="contained"
                  // color="primary"
                >
                  {/* <ContentPasteIcon /> */}
                  {copiedSoap ? <DoneIcon /> : <ContentPasteIcon />}
                </Button>
              </Box>
            </div>
            <CardContent>
              <Box
                sx={{
                  p: 2,
                  m: 2,
                }}
              >
                <Typography variant="h6">SUBJECTIVE</Typography>
                <Typography variant="body1">{subjectiveText}</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  m: 2,
                }}
              >
                <Typography variant="h6">OBJECTIVE</Typography>
                <Typography variant="body1">{objectiveText}</Typography>
              </Box>
              <Divider />

              <Box
                sx={{
                  p: 2,
                  m: 2,
                }}
              >
                <Typography variant="h6">ASSESSMENT</Typography>
                <Typography variant="body1">{assessmentText}</Typography>
              </Box>
              <Divider />

              <Box
                sx={{
                  p: 2,
                  m: 2,
                }}
              >
                <Typography variant="h6">PLAN</Typography>
                <Typography variant="body1">{planText}</Typography>
              </Box>
              <Divider />
              {/* <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  onClick={handleCopyPlan}
                  variant="contained"
                  color="primary"
                >
                  {copiedPlan ? <DoneIcon /> : <ContentPasteIcon />}
                </Button>
              </Box> */}
            </CardContent>
          </Card>
        </Grid>

        <Grid
          sx={{
            m: 2,
          }}
        >
          <Card>
            <CardHeader title={"Trancripted Text"}></CardHeader>
            <CardContent>
              <Typography>{transcriptedText}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {/* <audio src={globalData.audio.url} controls></audio> */}
          {console.log("S3 audio link",globalData.audio)}
          {globalData.audio && (
            <a href={globalData.audio} target="_blank">Listen to Audio</a>
          )}
        </Grid>
      </Box>

      <div>
        {/* Display success message if showSuccessMessage is true */}
        {showSuccessMessage && (
          <Alert variant="filled" severity="success">
            Note saved successfully!
          </Alert>
        )}

        {/* Display error message if showErrorMessage is true */}
        {showErrorMessage && (
          <>
            <Alert variant="filled" severity="error">
              Error while saving note!
            </Alert>
            <div>
              {errorMessage !== "null" &&
                errorMessage !== "undefined" &&
                errorMessage !== "" && (
                  <Alert variant="filled" severity="error">
                    {errorMessage}
                  </Alert>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <Box sx={{ width: "100%", mt: 3 }}>
        <CustomizableDialogBox title="Save Soap Note?" open = {open} cancelButtonName="Cancel" confirmButtonName="Save Note" handleCloseDialog={handleClose} handleConfirmDialog={submitSoapNote} handleOutsideClick={handleClose} message="Do you want to save the current note?" />
        <Paper elevation={3}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab label="SOAP Note" />
            <Tab label="Billing Codes" />
            {/* <Tab label="Cerner Data" /> */}
            {/* {currentSoapNoteId} */}
            {/* <Tab label={currentSoapNoteId}/> */}
          </Tabs>
          {/* <div className={classes.scrollbar} style={{ overflowY: 'auto', maxHeight: '500px' }} > */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              padding: 0,
              mt: 2,
            }}
          >
            <Stack
              direction="row"
              flexWrap={"wrap"}
              gap={"10px"}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{
                width: "100%",
                padding: 0,
                margin: 0,
              }}
            >
              <Stack
              direction ="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              >
              {isEditingTitle ? (
                <TextField
                value={soapNoteTitle}
                onChange={handleTitleChange}
                // onBlur={handleTitleBlur}
                autoFocus
                />
              ) : (
                <Typography
                variant="h5"
                sx={{
                  display: "block",
                  position: "relative",
                }}
                onClick = {handleTitleClick}
                >
                {soapNoteTitle}
              </Typography>
              )}
              <Typography
                variant="h5"
                sx={{
                  display: "block",
                  position: "relative",
                }}
                >
              {createdAt.slice(0, 10)}
              </Typography>
              </Stack>
              <Button
              variant="contained"
              color={copiedSoap ? 'success' : 'primary'}
              onClick={handleCopySoap}
              disabled={copiedSoap}  // Disable the button if copiedSoap is true
            >
              {copiedSoap ? 'Note Copied' : 'Copy Note'}
            </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                sx={{
                  height: "fit-content",
                }}
                disabled={
                  !isEditing &&
                  !isEditingAssessment &&
                  !isEditingObjective &&
                  !isEditingPlan &&
                  !isEditingTitle
                }
              >
                SAVE NOTE
              </Button>
            </Stack>
          </Box>
          {activeTab === 0 && (
            <Box
              sx={{
                maxHeight: "75vh",
                overflow: "scroll",
                mt: "12px",
                backgroundColor: "#D0E9FF",
                "&::-webkit-scrollbar": {
                  width: "10px" /* Width of the scrollbar */,
                  // width: '0',
                  // opacity: '0',
                },
                /* Track */
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1" /* Color of the track */,
                  borderRadius: "5px",
                },
                /* Handle */
                "&::-webkit-scrollbar-thumb": {
                  background: "#0085FE" /* Color of the scrollbar handle */,
                  borderRadius: "5px",
                },
                /* Handle on hover */
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#1B5AAD",
                  borderRadius: "5px",
                },
              }}
            >
              {/* {currentSoapNoteId} */}
              {rendersoanote}
            </Box>
          )}
          {activeTab === 1 && (
            <Box sx={{ p: 3,backgroundColor : "#FFFFFF",marginTop:"4px" }}>{renderBillingCodes}</Box>
          )}
          {activeTab === 2 && (
            <Typography sx={{ p: 3 }}>
              {/* Cerner Data information will be displayed here. */}
              <TextField
                label="Enter Text"
                variant="outlined"
                sx={{ width: "100%", mt: 2 }} // Adjust width and margin-top as needed
                multiline // Enables multiline
                rows={4} // Sets the initial height (number of lines) of the text field
              />
            </Typography>
          )}
        </Paper>
      </Box>
      {/* Success and Error Messages, unchanged */}
      {showSuccessMessage && (
        <Alert variant="filled" severity="success">
          Note saved successfully!
        </Alert>
      )}
      {showErrorMessage && (
        <>
          <Alert variant="filled" severity="error">
            Error while saving note!
          </Alert>
          {errorMessage && (
            <Alert variant="filled" severity="error">
              {errorMessage}
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default SOAPNoteFrame;
