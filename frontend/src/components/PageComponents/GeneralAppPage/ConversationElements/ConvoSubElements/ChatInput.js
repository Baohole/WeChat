import { useRef, useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Tooltip,
  Fab,
  IconButton,
  InputAdornment,
  Popover,
  useMediaQuery,
} from "@mui/material";
import { LinkSimple, Smiley } from "phosphor-react";

import { Actions } from "../../../../../data";
import { socket } from "../../../../../utils/socket";
import actionHandler from "../../../../ChatMediaActions/actionClickHandler";
import { useDispatch } from "react-redux";
import ImagePreview from "../../../../ChatMediaActions/ImagePreview";
import FilePreview from "../../../../ChatMediaActions/FilePreview";

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  handleSubmit,
  theme,
  convo_id,
  isOptimistic,
  onSubmitWithFiles,
}) => {
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const typingTimeoutRef = useRef(null);

  // from redux
  const dispatch = useDispatch();

  // -------------- Inner Functions --------------
  const handlePopoverOpen = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event, selectedImages, selectedFiles);

      // Không cần clear ở đây, đã được xử lý trong ConversationFooter
    }
  };

  // Submit with button
  const onSubmit = (event) => {
    handleSubmit(event, selectedImages, selectedFiles);

    // Không cần clear ở đây, đã được xử lý trong ConversationFooter
  };

  // Remove image from preview
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove file from preview
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all file previews
  const clearAllFilePreviews = () => {
    setSelectedImages([]);
    setSelectedFiles([]);


    // Force re-render preview components
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  };

  // --------- typing handlers ---------
  const startTyping = () => {
    socket.emit("start_typing", convo_id);
    setIsTyping(true);
  };

  const stopTyping = () => {
    socket.emit("stop_typing", convo_id);
    setIsTyping(false);
  };

  const onChangeHandler = (event) => {
    setValue(event.target.value);

    if (!isTyping && value.trim() !== "") {
      startTyping();
    }

    clearTimeout(typingTimeoutRef.current);
    const timer = isOptimistic ? 1000 : 5000;
    typingTimeoutRef.current = setTimeout(stopTyping, timer); // 1 seconds
  };
  // ------------------------------------

  // fn() to handle actions click
  const handleActions = (type) => {
    actionHandler(type.toLowerCase(), dispatch, setSelectedImages, setSelectedFiles);

    handlePopoverClose();
  };
  // ------------------------------------------

  // Effect to reset selected media when value is cleared externally
  // (for example, after message is sent from the parent component)
  useEffect(() => {
    if (value === "") {
      clearAllFilePreviews();
    }
  }, [value]);

  // Khi selectedImages hoặc selectedFiles thay đổi, truyền chúng cho component cha
  useEffect(() => {
    if (onSubmitWithFiles) {
      onSubmitWithFiles(selectedImages, selectedFiles);
    }
  }, [selectedImages, selectedFiles, onSubmitWithFiles]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Stack spacing={1} width="100%">
      {/* Image Preview */}
      <ImagePreview files={selectedImages} onRemove={handleRemoveImage} />

      {/* File Preview */}
      <FilePreview files={selectedFiles} onRemove={handleRemoveFile} />

      <TextField
        inputRef={inputRef}
        value={value}
        onChange={(event) => {
          onChangeHandler(event);
        }}
        onKeyDown={handleKeyPress}
        fullWidth
        multiline
        maxRows={3}
        autoComplete="off"
        autoFocus
        placeholder={isSmallScreen ? "Message..." : "Write a message..."}
        variant="outlined"
        InputProps={{
          sx: {
            borderRadius: 20,
            backgroundColor: theme.palette.background.paper,
            minHeight: 55,
            "& textarea": {
              scrollbarColor: `${theme.palette.primary.main} transparent`,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.primary.main,
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
            },
          },
          startAdornment: (
            <Stack>
              <Popover
                open={Boolean(popoverAnchor)}
                anchorEl={popoverAnchor}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "transparent !important",
                      boxShadow: "none",
                      padding: 2,
                    },
                  },
                }}
              >
                <Stack spacing={2}>
                  {Actions.map((el) => (
                    <Tooltip placement="right" title={el.title} key={el.title}>
                      <Fab
                        onClick={() => handleActions(el.title)}
                        sx={{
                          backgroundColor: theme.palette.primary[el.color],
                          color: el.contrast,
                          transition: "all 0.5s ease",
                          "&:hover": {
                            color: "#fff",
                          },
                        }}
                        aria-label="add"
                      >
                        {el.icon}
                      </Fab>
                    </Tooltip>
                  ))}
                </Stack>
              </Popover>

              <InputAdornment position="start">
                <IconButton onClick={handlePopoverOpen}>
                  <LinkSimple />
                </IconButton>
              </InputAdornment>
            </Stack>
          ),

          endAdornment: (
            <Stack sx={{ position: "relative" }}>
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setOpenPicker(!openPicker);
                  }}
                >
                  <Smiley />
                </IconButton>
              </InputAdornment>
            </Stack>
          ),
        }}
      />
    </Stack>
  );
};

export default ChatInput;
