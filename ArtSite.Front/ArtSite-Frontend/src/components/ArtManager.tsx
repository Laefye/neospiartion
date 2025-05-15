// components/ArtManagement.tsx
import { useState, useRef } from "react";
import { Button, Typography, Box, CircularProgress,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@mui/material";
import { deleteArt, uploadPicture } from "../api/artService";
import type { Art } from "../types/art";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
}

const MAX_FILE_SIZE_MB = 30;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title = "Вы уверены, что хотите удалить этот арт?", }: DeleteConfirmationModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirm = async () => {
    try 
    {
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
          disabled={isDeleting}
        >
          {isDeleting ? "Удаление..." : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ArtManager = ({ arts, setArts }: { arts: Art[]; setArts: React.Dispatch<React.SetStateAction<Art[]>> }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArtId, setSelectedArtId] = useState<number | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = (artId: number) => {
    setSelectedArtId(artId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArtId) return;
    try {
      await deleteArt(selectedArtId);
      setArts(prev => prev.filter(art => art.id !== selectedArtId));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, artId: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    try {
      setUploadLoading(true);
      await uploadPicture(artId, file);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Обновление списка артов после загрузки
      setArts(prev => prev.map(art => 
        art.id === artId 
          ? { ...art, hasImages: true } 
          : art
      ));
    } catch {
      setUploadError("Ошибка загрузки. Попробуйте другой файл");
    } finally {
      setUploadLoading(false);
    }
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) 
      return "Допустимые форматы: PNG, JPEG, WEBP";
    
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return `Файл не должен превышать ${MAX_FILE_SIZE_MB} МБ`;
    
    return null;
  };

  return (
    <Box sx={{ padding: 3 }}>
      {arts.map(art => (
        <Box key={art.id} sx={{ mb: 3, p: 2, border: "1px solid #eee" }}>
          <Typography variant="h6">{art.title}</Typography>
          
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => handleDeleteClick(art.id)}
            >
              Удалить арт
            </Button>

            <Box sx={{ border: "1px dashed #ccc", p: 2, flexGrow: 1 }}>
              <input
                type="file"
                accept={ALLOWED_MIME_TYPES.join(", ")}
                onChange={(e) => handleFileUpload(e, art.id)}
                ref={fileInputRef}
                disabled={uploadLoading}
                style={{ display: "none" }}
                id={`image-upload-${art.id}`}
              />
              
              <label htmlFor={`image-upload-${art.id}`}>
                <Button 
                  variant="contained" 
                  component="span"
                  disabled={uploadLoading}
                  startIcon={uploadLoading ? <CircularProgress size={20} /> : null}
                >
                  {uploadLoading ? "Загрузка..." : "Добавить изображение"}
                </Button>
              </label>

              {uploadError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {uploadError}
                </Typography>
              )}

              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Макс. размер: {MAX_FILE_SIZE_MB} МБ. Форматы: {ALLOWED_MIME_TYPES.join(", ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};
