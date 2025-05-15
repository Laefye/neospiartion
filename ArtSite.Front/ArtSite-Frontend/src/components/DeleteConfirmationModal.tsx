import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
}

export const DeleteConfirmationModal = ({ open, onClose, onConfirm, title = "Вы уверены, что хотите удалить этот арт?",}: DeleteConfirmationModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const handleConfirm = async () => {
        try {
            setIsDeleting(true);
            await onConfirm();
            onClose();
        } 
        finally 
        {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
                <DialogContentText>{title}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isDeleting}>Отмена</Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    disabled={isDeleting}>{isDeleting ? "Удаление..." : "Удалить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
