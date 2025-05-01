import { useState, useEffect, useRef } from "react";
import { Box, Paper, Stack, IconButton, Typography, Divider } from "@mui/material";
import { X, File, FilePdf, FileDoc, FileXls, FileText, FileZip, FileImage } from "phosphor-react";

// Function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to get file icon based on mime type
const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) {
        return <FilePdf size={24} weight="fill" />;
    } else if (mimeType.includes('word') || mimeType.includes('doc')) {
        return <FileDoc size={24} weight="fill" />;
    } else if (mimeType.includes('excel') || mimeType.includes('sheet') || mimeType.includes('csv')) {
        return <FileXls size={24} weight="fill" />;
    } else if (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('xml')) {
        return <FileText size={24} weight="fill" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) {
        return <FileZip size={24} weight="fill" />;
    } else if (mimeType.includes('image')) {
        return <FileImage size={24} weight="fill" />;
    } else {
        return <File size={24} weight="fill" />;
    }
};

const FilePreview = ({ files, onRemove }) => {
    const [fileDetails, setFileDetails] = useState([]);
    const prevFilesRef = useRef(null);

    useEffect(() => {
        // Reset if no files
        if (!files || files.length === 0) {
            setFileDetails([]);
            return;
        }

        // Check if files array changed (not just a re-render)
        const filesChanged = !prevFilesRef.current ||
            prevFilesRef.current.length !== files.length ||
            files.some((file, i) => prevFilesRef.current[i] !== file);

        if (filesChanged) {
            // Create new details only if files changed
            const details = files.map((file) => ({
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type || 'application/octet-stream',
                icon: getFileIcon(file.type || 'application/octet-stream'),
                file,
            }));
            setFileDetails(details);
            prevFilesRef.current = files;
        }
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
                maxHeight: "200px",
                overflowY: "auto",
            }}
        >
            <Stack spacing={1}>
                {fileDetails.map((file, index) => (
                    <Box key={index}>
                        {index > 0 && <Divider sx={{ my: 0.5 }} />}
                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    color: (theme) =>
                                        file.type.includes('pdf') ? theme.palette.error.main :
                                            file.type.includes('doc') ? theme.palette.primary.main :
                                                file.type.includes('sheet') ? theme.palette.success.main :
                                                    theme.palette.info.main
                                }}
                            >
                                {file.icon}
                            </Box>
                            <Stack sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" noWrap fontWeight="medium">
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'} • {file.size}
                                </Typography>
                            </Stack>
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
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default FilePreview; 