import React, { useEffect, useState } from "react";
import {
  deleteNote,
  soapNoteHistoryCall,
  soapNotedetails,
} from "../../../../controller/registerController";
import { getDataFromLocalStorage } from "../../../../localStorageComp/storage";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useData } from "../../../../context/dataContext";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Menu from "@mui/material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Paper, { PaperProps } from "@mui/material/Paper";
import { createTheme, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

// import './ScrollbarStyles.css';

import { makeStyles } from "@mui/styles";
import CustomizableDialogBox from "../../../../components/CustomizableDialogBox";

const useStyles = makeStyles({
  scrollbar: {
    /* CSS for scrollbar */
    "&::-webkit-scrollbar": {
      width: "10px" /* Width of the scrollbar */,
      // width: '0',
      // opacity: '0',
    },
    /* Track */
    "&::-webkit-scrollbar-track": {
      background: "#BEE0FF" /* Color of the track */,
      borderRadius: "5px",
    },
    /* Handle */
    "&::-webkit-scrollbar-thumb": {
      background: "#0085FE" /* Color of the scrollbar handle */,
      borderRadius: "5px",
    },
    /* Handle on hover */
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#1B5AAD" /* Color of the scrollbar handle on hover */,
      borderRadius: "5px",
    },
  },
  hideScrollbar: {
    /* Hide the default scrollbar */
    "&::-webkit-scrollbar": {},
  },
});




const options = ["Delete", "Rename"];

const ITEM_HEIGHT = 48;

interface AudioRecorderProps {
  show: (b: boolean) => void;
  onTranscriptionUpdate: (newTranscription: string) => void;
  onComponentUpdate: (newTranscription: string) => void;
  open: boolean;
  setOpen: (b: boolean) => void;
  recordings : Blob[];
  setRecordings : (blobs : Blob[])=>void;
  isRecording : boolean;
  showProcessing : boolean;
}

// interface DeleteDialogProps {
//   open: boolean;
//   handleClose: () => void;
//   handleDelete: () => void;
//   // note: string;
// }
const handleDeleteNote = async (noteId: any) => {
  
  console.log("Deleting note with ID:", noteId);
 
  await deleteNote(noteId);
  window.location.reload();
  
};


const SoapNoteHistoryComponent: React.FC<AudioRecorderProps> = ({
  show,
  onTranscriptionUpdate,
  onComponentUpdate,
  setOpen,
  open,
  recordings,
  setRecordings,
  isRecording,
  showProcessing,
}) => {
  const [soapNotesHistory, setSoapNotesHistory] = useState<any[]>([]);
  const [pendingSoapNoteId,setPendingSoapNoteId] = useState<string | null>(null);
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [groupedsoapNotesHistory, setGroupedsoapNotesHistory] = useState<any>(
    {}
  );
  
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const [singleSoapNoteData, setSingleSoapNoteData] = useState<any>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md")); // Check if screen size is mobile/tablet
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screen size

  const [openDialog, setOpenDialog] = React.useState(false);
  const [keep,setkeep] =React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { setGlobalData } = useData();

  useEffect(() => {
    let isMounted = true; // Flag to determine if the component is still mounted

    const fetchData = async () => {
      try {
        const user = await getDataFromLocalStorage("user");
        const email = user ? user.email : null;
        if (!email) {
          console.error(
            "No email found, user is not logged in or data is corrupted"
          );
          return;
        }

        const res = await soapNoteHistoryCall(email);
        if (isMounted) {
          console.log("res in history", res);

          if (res.status === "Success") {
            setSoapNotesHistory(res.soapNotes);
            console.log("soapNotesHistory=> ", soapNotesHistory);
          } else {
            console.error("Failed to fetch SOAP notes:", res.message);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching soap notes history:", error);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Set it to false when the component unmounts
    };
  }, []); // Empty dependency array means this effect runs once on mount
  ///made change on 4/22 by subhan

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const email = getDataFromLocalStorage("user").email;
  //       console.log("email ", email);

  //       const res = await soapNoteHistoryCall(email);
  //       console.log("res in history", res);

  //       if (res.status === "Success") {
  //         setSoapNotesHistory(res.soapNotes);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching soap notes history:", error);
  //     }
  //   };

  //   fetchData(); // Call the async function immediately
  // }, []); // Empty dependency array means this effect runs once on mount

  const groupsoapNotesHistoryByDay = () => {
    const groupedByDay: { [key: string]: any[] } = {};

    if (soapNotesHistory && soapNotesHistory.length > 0) {
      console.log("soapNotesHistory=> ", soapNotesHistory);

      soapNotesHistory.forEach((note) => {
        const createdAt = new Date(note.createdAt);
        const dayKey = getDayKey(createdAt);

        if (!groupedByDay[dayKey]) {
          groupedByDay[dayKey] = [];
        }

        groupedByDay[dayKey].push(note);
      });
    } else {
      console.error("soapNotesHistory is undefined or empty");
    }

    console.log("groupedByDay=> ", groupedByDay);

    return groupedByDay;
  };

  useEffect(() => {
    const historyByDay = groupsoapNotesHistoryByDay();

    console.log("historyByDay=>", historyByDay);

    setGroupedsoapNotesHistory(historyByDay);
  }, [soapNotesHistory]); // Call the grouping function only after setting soapNotesHistory state

  console.log("groupedsoapNotesHistory =>", groupedsoapNotesHistory);




  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getDayKey = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    } else {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      if (date >= thirtyDaysAgo) {
        return "Previous30Days";
      } else {
        return date.toLocaleDateString(); // Use a formatted date for other days
      }
    }
  };

  // function to respond according to dialog action

  const handleDialogFunction = (confirm : boolean) => {
    if(confirm && pendingSoapNoteId){
      setIsDialogOpen(false);
      setRecordings([]);
      handleMultipleClicks(pendingSoapNoteId);
    }else if(!confirm){
      setIsDialogOpen(false);
    }
  }

  const handleIDClick = async (id: string) => {
    console.log("inside handle id click", id);
    const response = await soapNotedetails(id);
    console.log("inside handle id click response", response);
    if (response !== undefined) {
      console.log("response =>", response);

      // const contentType = "mp3";

      // const base64Data = response.audioDetails;

      // // Function to convert base64 string to Blob
      // const base64toBlob = (base64Data: string, contentType: string) => {
      //   const byteCharacters = atob(base64Data);
      //   const byteNumbers = new Array(byteCharacters.length);
      //   for (let i = 0; i < byteCharacters.length; i++) {
      //     byteNumbers[i] = byteCharacters.charCodeAt(i);
      //   }
      //   const byteArray = new Uint8Array(byteNumbers);
      //   return new Blob([byteArray], { type: contentType });
      // };

      // // Convert base64 string to Blob
      // const blob = base64toBlob(base64Data, contentType);

      // // Create Object URL for the Blob
      // const objectUrl = URL.createObjectURL(blob);

      // Update state with the Object URL
      setGlobalData((prev) => {
        return { ...prev, audio: response.soapNote?.awss3url || null };
      });

      onTranscriptionUpdate(response);
      onComponentUpdate("soapNoteHistoryComponent");
    }
  };
  
  // function to check before opening a soap note whether we have recorded session or not
  const checkIsSessionRecorded = (noteId : string)=>{
    if(recordings.length > 0){
      setPendingSoapNoteId(noteId);
      setIsDialogOpen(true);
    }else{
      handleMultipleClicks(noteId);
    }
  }

  const handleMultipleClicks = (noteId: string) => {
    if(fullScreen){
      toggleDrawer(false)(); // extra paranthesis is because toggleDrawer returns function when called and to call the actual function which close the menu button this extra paranthesis is required
    }

    console.log("Inside handleMultipleClicks  noteId=>", noteId);

    setSelectedNoteId(noteId);
    console.log("selectedNoteId in handleMultipleClicks=>", selectedNoteId);
  
    handleIDClick(noteId);
    handlenoteClick(noteId);
  };

  const handlenoteClick = (noteId: React.SetStateAction<string | null>) => {
    setSelectedNoteId(noteId);
    setkeep(true);
    console.log("selectedNoteId in handleNoteClick=>", selectedNoteId);

  };

  const getDrawer = () => {
    return (
      <div>
        <Drawer
          open={open}
          onClose={toggleDrawer(false)}
          sx={{
            height: "200vh", // Set the height to fill the entire viewport
            "& .MuiDrawer-paper": {
              height: "100%", // Ensure paper element fills the height of the drawer
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {fullScreen && (
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{ alignSelf: "flex-end", margin: "10px" }}
          >
            {isMobile ? <ArrowBackIcon /> : <CloseIcon />}
          </IconButton>
        )}
          {renderView()}
        </Drawer>
      </div>
    );
  };

 const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(
      null
    );

  const GetList = (key: string, text: string) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(
    //   null
    // );
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      // setSelectedNoteId(noteId);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const [renameDialogOpen, setDeleteDialogOpen] = useState(false);



    

const printMytext = (selectedNoteId: any)  => {
  console.log("selectedNoteId=>", selectedNoteId);
};





    const handleDeleteItemClick = (option: string) => {
      if (option === "Delete") {
        setDeleteDialogOpen(true);
      }
    };

    const handleDialogClose = () => {
      setDeleteDialogOpen(false);
    };
    const isSelected = (noteId: string | null) => noteId === selectedNoteId;
    const classes = useStyles();
    return (
      // <div className={classes.scrollbar} style={{ overflowY: 'auto', maxHeight: '500px' }} >
      <div>
        <List
          component="nav"
          sx={{
            // maxWidth: 360,
            padding: 0,
            // marginTop: 1,
            width: "100%",
            height: "100%", // Set height to 100% to extend to the bottom
            paddingLeft: 0, // Adjust padding instead of using 'padding: 0'
            paddingRight: 0,
            bgcolor: "background.paper",
            position: "relative", // Position fixed to keep it in place while scrolling
            left: 0, // Align to the left
            bottom: 0, // Align to the bottom
            // top: 0, // Align to the top
            // overflowY: "auto", // Add vertical scrollbar when content exceeds height
          }}
          subheader={
            <ListSubheader
              color="primary"
              // component={Paper}
              id="nested-list-subheader"
              // sx={{ color: "blue" }}
            >
              {text}
              <Divider
                sx={{
                  background: "primary",
                }}
                color="primary"
                variant="fullWidth"
                component="li"
              />
            </ListSubheader>
          }
        >
          {groupedsoapNotesHistory[key]?.length > 0 &&
            groupedsoapNotesHistory[key]?.map((note: any) => {
               const selected = isSelected(note._id);
              return (
                <>
                  <ListItem
                    // {setSelectedNoteId(note._id)}
                    alignItems="flex-start"
                    sx={{
                      cursor: (isRecording || showProcessing) ? "not-allowed" : "pointer",
                      padding: 1,
                      backgroundColor: selected ? "#dcdcdc" : "transparent",
                      // backgroundColor: selectedNoteId === note._id ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                    }}
                    onClick={(!isRecording && !showProcessing) ? () => checkIsSessionRecorded(note._id) : undefined}
                  >
                    <ListItemText
                      primary={
                        <span
                          style={{
                            color: selected ? "black" : "inherit",
                            fontWeight: selected ? "bold" : "normal",
                          }}
                        >
                          {note.chiefComplaint}
                          {/* {note._id}
                          {";;;;;"}
                          {selectedNoteId} */}
                          {/* {note.assessment.slice(0, 30) + "..."} */}
                        </span>
                      }
                      secondary={
                        <React.Fragment>
                          {/* <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          > */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {" "}
                            <div>
                              {/* <Typography
                                sx={{ display: "block" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {`Status: ${
                                  note.completed ? "Complete" : "Incomplete"
                                }`}
                              </Typography> */}
                              {`Time: ${new Date(
                                note.createdAt
                              ).toLocaleDateString()} ${new Date(
                                note.createdAt
                              ).toLocaleTimeString()}`}
                            </div>
                            {/* <div> */}
                            {/* <ThemeProvider theme={theme}> */}
                            <div>
                              <Box sx={{ marginRight: "10px" }}>
                                {/* <Button
                                  onClick={() => handleDeleteNote(note._id)}
                                > */}
                                <Button onClick={handleClickOpenDialog} disabled={(isRecording || showProcessing)}>
                                  <DeleteIcon />
                                </Button>
                                <Dialog
                                  open={openDialog}
                                  onClose={handleCloseDialog}
                                  PaperProps={{
                                    style: {
                                      backgroundColor: "white",
                                      borderRadius: 15,
                                      border: "2px solid dodgerblue",
                                      padding: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  BackdropProps={{
                                    style: {
                                      backgroundColor: "transparent",
                                      backdropFilter: "none",
                                    },
                                  }}
                                  aria-labelledby="responsive-dialog-title"
                                >
                                  <DialogTitle sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    Delete SOAP Note?
                                  </DialogTitle>
                                  <DialogContent>
                                    Are you sure you want to delete this patient's record? This action cannot be undone.
                                  </DialogContent>
                                  <DialogActions sx={{ justifyContent: 'center', gap: '10px' }}>
                                    <Button onClick={handleCloseDialog} color="primary" variant="contained">
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        printMytext(selectedNoteId);
                                        handleDeleteNote(selectedNoteId);
                                      }}
                                      color="primary"
                                      variant="contained"
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </Box>
                            </div>
                            {/* </ThemeProvider> */}
                          </div>
                          {/* </Box> */}
                          {/* <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={handleClick}
                            >
                              <MoreVertIcon />
                            </IconButton> */}
                          {/* <Menu
                              id="long-menu"
                              MenuListProps={{
                                "aria-labelledby": "long-button",
                              }}
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              PaperProps={{
                                style: {
                                  maxHeight: ITEM_HEIGHT * 4.5,
                                  width: "20ch",
                                },
                              }}
                            >
                              <DeleteDialog
                                open={renameDialogOpen}
                                handleClose={handleDialogClose}
                                handleDelete={note._id}
                                // handleDelete={() => handleDeleteNote(note._id)}
                                // note={note._id}
                              />
                            </Menu> */}
                          {/* </div> */}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />

                  {/* <Divider
                    variant="fullWidth"
                    component="li"
                    sx={{
                      borderWidth: "medium",
                    }}
                  /> */}
                </>
              );
            })}
        </List>
      </div>
    );
  };

  const renderView = () => {
    return (
      <>
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#0085FE",
          }}
        >
          My Notes
        </Typography>
        {keep && (
  <Button
    onClick={() => {
      show(false);
      setkeep(false);
    }}
    style={{
      marginLeft: '77%',
      marginTop: '2%',
      marginBottom: '2%',
      backgroundColor: '#0085FE',
      color: 'white',
      borderRadius: '10px',
      border: 'none',
      padding: '8px 16px',
    }}
  >
    <AddIcon /> New Note
  </Button>
)}
        {GetList("Today", "Today")}
        {GetList("Yesterday", "Yesterday")}
        {GetList("Previous30Days", "Previous 30 Days")}
      </>
    );
  };
  const classes = useStyles();

  return (
    <>
      {getDrawer()}
      <div
        className={classes.scrollbar}
        style={{ overflowY: "auto", maxHeight: "auto" }}
      >
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },
            // border: "1px solid black",
            maxHeight: "85vh",
            // overflow: "scroll",
            height: "85vh",
            paddingTop: "16px", // Adjust padding as needed
            paddingLeft: "16px",
            "&::-webkit-scrollbar": {
              width: "10px" /* Width of the scrollbar */,
              // width: '0',
              // opacity: '0',
            },
            /* Track */
            "&::-webkit-scrollbar-track": {
              background: "blue" /* Color of the track */,
            },
            /* Handle */
            "&::-webkit-scrollbar-thumb": {
              background: "#0085FE" /* Color of the scrollbar handle */,
            },
            /* Handle on hover */
            "&::-webkit-scrollbar-thumb:hover": {
              background:
                "#0085FE" /* Color of the scrollbar handle on hover */,
            },
          }}
          component={Paper}
          // elevation={6}
        >
          {renderView()}
        </Box>
        <CustomizableDialogBox title = "Warning" open={isDialogOpen} message={"You are about to lose the recorded file. Do you wish to continue?"} cancelButtonName={"Cancel"} confirmButtonName={"Confirm"} handleOutsideClick={()=>{handleDialogFunction(false)}} handleCloseDialog={()=>{handleDialogFunction(false)}} handleConfirmDialog={()=>{handleDialogFunction(true)}} />
      </div>
    </>
  );
};

export default SoapNoteHistoryComponent;
