import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface PdfViewerIframeProps {
    pdfPath: string;
    open: boolean;
    handleClose: () => void;
}

const PdfViewerIframe: React.FC<PdfViewerIframeProps> = ({ pdfPath, open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            {/* <DialogTitle>PDF Viewer</DialogTitle> */}
            <DialogContent>
                <iframe
                    title="Guides"
                    style={{ width: '100%', height: '80vh', border: 'none' }}
                    src={pdfPath}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PdfViewerIframe;

