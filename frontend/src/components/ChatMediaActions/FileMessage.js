import { Box, Paper, Stack, Typography, IconButton } from "@mui/material";
import {
    File,
    FilePdf,
    FileDoc,
    FileXls,
    FileText,
    FileZip,
    FileImage,
    DownloadSimple
} from "phosphor-react";

// Function to get file icon based on mime type or extension
const getFileIcon = (fileUrl) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();

    // Common document extensions
    if (extension === 'pdf') {
        return <FilePdf size={24} weight="fill" />;
    } else if (['doc', 'docx'].includes(extension)) {
        return <FileDoc size={24} weight="fill" />;
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return <FileXls size={24} weight="fill" />;
    } else if (['txt', 'json', 'xml'].includes(extension)) {
        return <FileText size={24} weight="fill" />;
    } else if (['zip', 'rar', '7z'].includes(extension)) {
        return <FileZip size={24} weight="fill" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return <FileImage size={24} weight="fill" />;
    } else {
        return <File size={24} weight="fill" />;
    }
};

// Function to get color based on file type
const getFileColor = (fileUrl, theme) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        return theme.palette.error.main;
    } else if (['doc', 'docx'].includes(extension)) {
        return theme.palette.primary.main;
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return theme.palette.success.main;
    } else if (['zip', 'rar', '7z'].includes(extension)) {
        return theme.palette.warning.main;
    } else {
        return theme.palette.info.main;
    }
};

// Function to get formatted file name
const getFileName = (fileUrl) => {
    try {
        // Extract filename from URL
        const fileName = decodeURIComponent(fileUrl.split('/').pop());
        // Remove any query parameters
        return fileName.split('?')[0];
    } catch (error) {
        return "File";
    }
};

const FileMessage = ({ file, theme, isMe = false }) => {
    const fileName = getFileName(file);
    const fileIcon = getFileIcon(file);
    const fileColor = getFileColor(file, theme);

    // Handle file download
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = file;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                borderRadius: 1,
                backgroundColor: isMe ? 'rgba(0, 0, 0, 0.04)' : 'white',
                border: `1px solid ${theme.palette.divider}`,
                width: '100%',
                maxWidth: 280,
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ color: fileColor }}>
                    {fileIcon}
                </Box>
                <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                        {fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                    </Typography>
                </Stack>
                <IconButton
                    size="small"
                    onClick={handleDownload}
                    sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        }
                    }}
                >
                    <DownloadSimple weight="fill" />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default FileMessage; 