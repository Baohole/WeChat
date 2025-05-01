import { useState, useEffect, useRef } from "react";
import { Box, Paper, Stack, IconButton, Typography } from "@mui/material";
import { X } from "phosphor-react";

const ImagePreview = ({ files, onRemove }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const prevFilesRef = useRef(null);

    useEffect(() => {
        // Clean up previous previews
        if (previewImages && previewImages.length > 0) {
            previewImages.forEach((image) => {
                if (image.url) {
                    URL.revokeObjectURL(image.url);
                }
            });
        }

        // Reset if no files
        if (!files || files.length === 0) {
            setPreviewImages([]);
            return;
        }

        // Check if files array changed (not just a re-render)
        const filesChanged = !prevFilesRef.current ||
            prevFilesRef.current.length !== files.length ||
            files.some((file, i) => prevFilesRef.current[i] !== file);

        if (filesChanged) {
            // Create new preview URLs only if files changed
            const images = files.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
                file,
            }));
            setPreviewImages(images);
            prevFilesRef.current = files;
        }

        return () => {
            // Cleanup when component unmounts or files change
            if (previewImages) {
                previewImages.forEach((image) => {
                    if (image.url) {
                        URL.revokeObjectURL(image.url);
                    }
                });
            }
        };
    }, [files]);

    if (!files || files.length === 0) {
        return null;
    }

    return (
        <Paper
            id="preview"
            elevation={3}
            sx={{
                p: 1.5,
                borderRadius: 2,
                mb: 1,
                maxHeight: "150px",
                overflowY: "auto",
            }}
        >
            <Stack spacing={1}>
                {previewImages.map((image, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={image.url}
                            alt={`Preview ${index}`}
                            sx={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 1,
                            }}
                        />
                        <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                            {image.name}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => onRemove(index)}
                            sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                backgroundColor: (theme) => theme.palette.grey[100],
                                "&:hover": {
                                    backgroundColor: (theme) => theme.palette.grey[300],
                                },
                            }}
                        >
                            <X size={16} />
                        </IconButton>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default ImagePreview; 