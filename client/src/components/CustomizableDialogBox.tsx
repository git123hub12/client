import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react';
interface AudioRecorderDialogBoxProps {
  open: boolean;
  handleOutsideClick: (value: boolean) => void;
  handleCloseDialog: (value: boolean) => void;
  handleConfirmDialog: (value: boolean) => void;
  message : string;
  cancelButtonName : string;
  confirmButtonName : string;
  title : string;
}

const CustomizableDialogBox : React.FC<AudioRecorderDialogBoxProps> = ({ title, open, handleOutsideClick, handleCloseDialog, handleConfirmDialog , message , cancelButtonName, confirmButtonName }) => {
  return (
    <Box>
        <Dialog
        open={open}
        onClose={handleOutsideClick}
        PaperProps={{
          style: {
            backgroundColor: "white",
            borderRadius: 15,
            border: "2px solid dodgerblue",
            padding: "20px",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {title}
        </DialogTitle>
        <DialogContent>
          {message}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={()=>handleCloseDialog(false)} color="primary" variant="contained">
              {cancelButtonName}
            </Button>
            <Button onClick={()=>handleConfirmDialog(true)} color="primary" variant="contained">
              {confirmButtonName}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CustomizableDialogBox;