import { Stack, Box, useTheme, Typography, ImageList, ImageListItem } from "@mui/material";
import BeatLoader from "react-spinners/BeatLoader";

import getAvatar from "../../../../../utils/createAvatar";
import FileMessage from "../../../../ChatMediaActions/FileMessage";

const MessageContainer = ({
  message,
  me,
  isStartOfSequence,
  isEndOfSequence,
  msgType,
  isLastMessage,
  isTyping,
}) => {
  const theme = useTheme();

  let borderRadiusStyle;

  if (isStartOfSequence && isEndOfSequence) {
    borderRadiusStyle = "20px";
  } else if (me && isStartOfSequence) {
    borderRadiusStyle = "20px 20px 5px 20px";
  } else if (me && isEndOfSequence) {
    borderRadiusStyle = "20px 5px 20px 20px";
  } else if (me) {
    borderRadiusStyle = "20px 5px 5px 20px";
  } else if (!me && isStartOfSequence) {
    borderRadiusStyle = "20px 20px 20px 5px";
  } else if (!me && isEndOfSequence) {
    borderRadiusStyle = "5px 20px 20px 20px";
  } else {
    borderRadiusStyle = "5px 20px 20px 5px";
  }

  // Check if message has images or documents
  const files = message.files.map(f => f.url)
  // console.log("files", files)
  const hasImages = files && files.filter(f => {
    const ext = f.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }).length > 0;

  const hasDocuments = files && files.filter(f => {
    const ext = f.split('.').pop()?.toLowerCase();
    return !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }).length > 0;

  // Filter images and documents
  const images = files?.filter(f => {
    const ext = f.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }) || [];

  const documents = files?.filter(f => {
    const ext = f.split('.').pop()?.toLowerCase();
    return !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }) || [];

  // Adjust padding based on message type and content
  const commonPadding = msgType === "text" ? (hasImages || hasDocuments ? 1 : 1.5) : "3px 0px";

  return (
    <Stack
      direction="row"
      justifyContent={me ? "flex-end" : "flex-start"}
      alignItems="center"
      sx={{ position: "relative" }}
    >
      {!me && isEndOfSequence && !isTyping && (
        <Box
          sx={{
            position: "absolute",
            top: msgType === "text" ? 10 : 18,
            left: -25,
          }}
        >
          {getAvatar(
            message?.sender?.avatar,
            message?.sender?.firstName,
            theme,
            20
          )}
        </Box>
      )}
      <Box
        p={commonPadding}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "max-content",
          minWidth: 40,
          maxWidth: { xs: "12em", md: "30em" },
          minHeight: 40,
          backgroundColor:
            msgType === "text"
              ? me
                ? theme.palette.primary.main
                : theme.palette.background.default
              : msgType === "emoji"
                ? ""
                : theme.palette.background.default,
          borderRadius: borderRadiusStyle,
        }}
      >
        {msgType === "typing" && isTyping ? (
          <BeatLoader
            size={5}
            height={0.5}
            width={1}
            color={theme.palette.primary.main}
            speedMultiplier={0.5}
            margin={2}
          />
        ) : (
          <>
            {message.message && message.message.trim() !== "" && (
              <Typography
                variant={msgType === "text" ? "body2" : "h3"}
                color={me ? "#fff" : theme.palette.text}
                sx={{ whiteSpace: "preserve", wordBreak: "break-word" }}
              >
                {message.message}
              </Typography>
            )}

            {/* Display images if available */}
            {hasImages && (
              <Box sx={{ width: "100%", mt: message.message ? 1 : 0 }}>
                <ImageList
                  sx={{
                    width: "100%",
                    m: 0,
                    maxHeight: 300,
                    borderRadius: 1,
                    overflow: "hidden"
                  }}
                  cols={images.length > 1 ? 2 : 1}
                  rowHeight={images.length > 3 ? 100 : 150}
                >
                  {images.map((file, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={file}
                        alt={`Message attachment ${index}`}
                        loading="lazy"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          cursor: "pointer"
                        }}
                        onClick={() => window.open(file, "_blank")}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}

            {/* Display documents if available */}
            {hasDocuments && (
              <Box sx={{
                width: "100%",
                mt: message.message || hasImages ? 1 : 0,
                display: "flex",
                flexDirection: "column",
                gap: 1
              }}>
                {documents.map((file, index) => (
                  <FileMessage
                    key={index}
                    file={file}
                    theme={theme}
                    isMe={me}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
      {me && isLastMessage && (
        <Box
          sx={{
            position: "absolute",
            top: 25,
            right: -16,
          }}
        >
          {getAvatar(
            message?.sender?.avatar,
            message?.sender?.firstName,
            theme,
            15
          )}
        </Box>
      )}
    </Stack>
  );
};

export default MessageContainer;
