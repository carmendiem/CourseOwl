// src/components/ConfirmationDialog.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Cancel</Button>
            <Button onClick={onConfirm} color="secondary">Confirm</Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmationDialog;
