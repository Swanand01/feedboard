import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { MAX_FILE_SIZE } from "./constants";

export async function parseSiteFormData(request: Request) {
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({
        filter({ contentType }) {
          return contentType.includes("image");
        },
        directory: "./public/uploads",
        avoidFileConflicts: false,
        file({ filename }) {
          return filename;
        },
        maxPartSize: MAX_FILE_SIZE,
      }),
      unstable_createMemoryUploadHandler(),
    ),
  );
  return formData;
}
