import { useRef, useState, useEffect } from "react";
import {
  Box,
  Stack,
  IconButton,
  CircularProgress,
  useTheme,
  Grow,
} from "@mui/material";
import { PaperPlaneTilt } from "phosphor-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// redux imports
import { useDispatch } from "react-redux";
import { SendMessage } from "../../../../redux/slices/actions/chatActions";

import ChatInput from "./ConvoSubElements/ChatInput";
import { socket } from "../../../../utils/socket";

const ConversationFooter = ({
  convo_id,
  sendMsgLoading,
  currentUser,
  otherUser,
  activeConversation,
  isOptimistic,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji with a slight delay
      setTimeout(() => {
        const newPosition = selectionStart + emoji.length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const handleClickOutsidePicker = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setOpenPicker(false);
    }
  };

  // Callback để nhận files từ ChatInput component
  const handleFilesFromChatInput = (images, files) => {
    setSelectedImages(images);
    setSelectedFiles(files);
  };

  // Hàm reset tất cả các files, images, và input field
  const resetAllFiles = () => {
    // Reset state
    setSelectedImages([]);
    setSelectedFiles([]);
    setValue("");

    // Reset tất cả các input file
    document.querySelectorAll('#preview').forEach(el => el.remove());

    // Force cập nhật DOM để preview được xóa
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  };

  const handleSubmit = (e, images = selectedImages, files = selectedFiles) => {
    e.preventDefault();

    const hasMedia = images.length > 0 || files.length > 0;
    const hasText = value.trim() !== "";
    const hasContent = hasText || hasMedia;

    if (hasContent) {
      const currentDate = new Date().getTime();

      // Mảng chứa dữ liệu file dưới dạng base64
      const filePromises = [];

      // Chuyển đổi tất cả các image files sang base64
      if (images && images.length > 0) {
        images.forEach(file => {
          const promise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                data: reader.result, // base64 data
                name: file.name,
                type: file.type,
                size: file.size,
                isImage: true
              });
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng base64
          });
          filePromises.push(promise);
        });
      }

      // Chuyển đổi tất cả các document files sang base64
      if (files && files.length > 0) {
        files.forEach(file => {
          const promise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                data: reader.result, // base64 data
                name: file.name,
                type: file.type,
                size: file.size,
                isImage: false
              });
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng base64
          });
          filePromises.push(promise);
        });
      }

      // Đợi tất cả các file chuyển đổi xong
      Promise.all(filePromises).then(fileDataArray => {
        // Create temporary URLs for optimistic UI update
        const tempImageUrls = images.map(file => URL.createObjectURL(file));
        const tempFileUrls = files.map(file => URL.createObjectURL(file));
        const allFileUrls = [...tempImageUrls, ...tempFileUrls];

        let messageData = {
          approach: "optimistic",
          _id: `${currentDate}`,
          sender: {
            _id: currentUser._id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            avatar: currentUser.avatar,
          },
          message: value,
          conversation: {
            _id: activeConversation._id,
            name: activeConversation.name,
            isGroup: activeConversation.isGroup,
            users: [currentUser, otherUser],
            latestMessage: {
              _id: `${currentDate} + 2500`,
              sender: currentUser,
              message: value.length > 0 ? value : `📷 ${images.length} photo(s) and 📎 ${files.length} file(s)`,
              createdAt: new Date(currentDate).toISOString(),
              updatedAt: new Date(currentDate).toISOString(),
            },
          },
          files: allFileUrls,          // URLs for optimistic UI update
          fileData: fileDataArray,     // File data as base64 for backend processing
          createdAt: new Date(currentDate).toISOString(),
          updatedAt: new Date(currentDate).toISOString(),
          __v: 0,
        };

        if (currentUser._id === otherUser._id) {
          messageData = {
            ...messageData,
            conversation: {
              ...messageData.conversation,
              users: [currentUser],
            },
          };
        }

        // Gửi message qua socket
        socket.emit("send_message", messageData);

        // Cleanup object URLs ngay lập tức
        allFileUrls.forEach(url => URL.revokeObjectURL(url));

        // Reset tất cả files và inputs
        resetAllFiles();
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidePicker);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePicker);
    };
  }, []);

  return (
    <Box
      py={2}
      px={3}
      width={"100%"}
      sx={{
        position: "sticky",
        backgroundColor: theme.palette.background.default,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Stack sx={{ width: "100%" }}>
            <Grow in={openPicker}>
              <Box
                ref={pickerRef}
                sx={{
                  zIndex: 10,
                  position: "fixed",
                  bottom: { xs: 80, md: 65 },
                  right: { xs: 15, sm: 80, md: 100 },
                }}
              >
                <Picker
                  perLine={8}
                  autoFocus={true}
                  theme={theme.palette.mode}
                  data={data}
                  onEmojiSelect={(emoji) => {
                    handleEmojiClick(emoji.native);
                  }}
                />
              </Box>
            </Grow>
            {/* Chat Input */}
            <ChatInput
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              handleSubmit={handleSubmit}
              theme={theme}
              convo_id={convo_id}
              isOptimistic={isOptimistic}
              onSubmitWithFiles={handleFilesFromChatInput}
            />
          </Stack>

          <IconButton
            type="submit"
            sx={{
              height: 40,
              width: 40,
              backgroundColor: sendMsgLoading
                ? theme.palette.background.paper
                : theme.palette.primary.main,
              borderRadius: 20,
              transition: "background-color 0.2s ease",
            }}
            onClick={(e) => handleSubmit(e)}
          >
            {sendMsgLoading ? (
              <Stack alignItems={"center"} justifyContent={"center"}>
                <CircularProgress
                  color="primary"
                  sx={{ maxWidth: 15, maxHeight: 15 }}
                />
              </Stack>
            ) : (
              <PaperPlaneTilt color="#ffffff" size={20} />
            )}
          </IconButton>
        </Stack>
      </form>
    </Box>
  );
};

export default ConversationFooter;
