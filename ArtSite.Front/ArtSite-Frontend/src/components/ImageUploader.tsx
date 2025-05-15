import { useState, useRef } from "react";
import { uploadPicture } from "../api/artService";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

interface ImageUploaderProps {
    artId: number;
    onSuccess?: () => void;
    onError?: (message: string) => void;
}

const MAX_FILE_SIZE_MB = 30;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const ImageUploader = ({ artId, onSuccess, onError }: ImageUploaderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return "Допустимые форматы: PNG, JPEG, WEBP";
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `Файл не должен превышать ${MAX_FILE_SIZE_MB} МБ`;
        }
        return null;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        const validationError = validateFile(file);
    
        if (validationError) {
            setError(validationError);
            onError?.(validationError);
            return;
        }

        try {
            setIsLoading(true);
            await uploadPicture(artId, file);
            onSuccess?.();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } 
        catch (error)
        {
            console.error("Ошибка загрузки изображения:", error);
            setError("Ошибка загрузки. Попробуйте другой файл");
            onError?.("Ошибка загрузки");
        } 
        finally 
        {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ border: "1px dashed #ccc", p: 2, textAlign: "center" }}>
            <input
                type="file"
                accept={ALLOWED_MIME_TYPES.join(", ")}
                onChange={handleFileUpload}
                ref={fileInputRef}
                disabled={isLoading}
                style={{ display: "none" }}
                id="image-upload"
            />
        
            <label htmlFor="image-upload">
                <Button 
                    variant="contained" 
                    component="span"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}>
                    {isLoading ? "Загрузка..." : "Выбрать изображение"}
                </Button>
            </label>

            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Макс. размер: {MAX_FILE_SIZE_MB} МБ. Форматы: {ALLOWED_MIME_TYPES.join(", ")}
            </Typography>
        </Box>
    );
};