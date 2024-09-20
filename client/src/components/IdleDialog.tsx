import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface IdleDialogProps {
  open: boolean;
  onClose: () => void;
  onKeepSignedIn: () => void;
}

const IdleDialog: React.FC<IdleDialogProps> = ({ open, onClose, onKeepSignedIn }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Session Timeout</DialogTitle>
      <DialogContent>
        Your session is about to expire due to inactivity. Do you want to keep your session active?
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: '10px' }}>
        <Button onClick={onKeepSignedIn} color="primary" variant="contained" autoFocus>Keep me signed in</Button>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus >Log out</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdleDialog;
