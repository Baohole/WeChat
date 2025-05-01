import { ShowSnackbar } from "../../redux/slices/userSlice";

const actionHandler = (type, dispatch, setSelectedImages, setSelectedFiles) => {
  switch (type) {
    case "gaming":
      return console.log("gaming click");

    // handling photo click
    case "photo":
      const acceptedImageTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ];

      const imageInput = document.createElement("input");
      imageInput.type = "file";
      imageInput.accept = acceptedImageTypes.join(",");
      imageInput.multiple = true;
      imageInput.click();

      // handling selected file
      imageInput.addEventListener("change", (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = [];
        let hasInvalidFiles = false;

        selectedFiles.forEach((img) => {
          if (acceptedImageTypes.includes(img.type)) {
            validFiles.push(img);
          } else {
            hasInvalidFiles = true;
          }
        });

        if (hasInvalidFiles) {
          dispatch(
            ShowSnackbar({
              severity: "info",
              message: "Some selected file types are not allowed",
            })
          );
        }

        if (validFiles.length > 0 && setSelectedImages) {
          setSelectedImages((prev) => [...prev, ...validFiles]);
        }

        // Reset input to allow selecting the same file again
        imageInput.value = "";
      });
      break;

    case "document":
      // Accept most common document types
      const acceptedDocTypes = [
        // Office documents
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

        // PDF
        "application/pdf",

        // Text
        "text/plain",
        "text/csv",

        // Archives
        "application/zip",
        "application/x-rar-compressed",

        // Other common formats
        "application/json",
        "application/xml",
      ];

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = acceptedDocTypes.join(",");
      fileInput.multiple = true;
      fileInput.click();

      // Handling selected documents
      fileInput.addEventListener("change", (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 0 && setSelectedFiles) {
          setSelectedFiles((prev) => [...prev, ...selectedFiles]);

          // Show success notification
          dispatch(
            ShowSnackbar({
              severity: "success",
              message: `${selectedFiles.length} file(s) selected`,
            })
          );
        }

        // Reset input to allow selecting the same file again
        fileInput.value = "";
      });
      break;

    case "contact":
      return console.log("contact click");

    default:
      break;
  }

  return null;
};

export default actionHandler;
