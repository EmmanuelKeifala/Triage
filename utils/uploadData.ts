import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

// Define the tag structure
interface Tag {
  name: string;
  value: string;
}

const uploadFileToArweave = async (
  fileUri: string,
  fileMimeType: string
): Promise<any> => {
  try {
    const file = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert the Base64 string to a Buffer
    const fileBuffer = Buffer.from(file, "base64");

    const tags: Tag[] = [
      { name: "Title", value: "Uploaded File" },
      { name: "Type", value: fileMimeType },
    ];

    const jsonTags = JSON.stringify(tags);
    const encodedTags = Buffer.from(jsonTags).toString("base64");

    const response = await fetch("https://api.akord.com/files", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Api-Key": process.env.EXPO_PUBLIC_AKORD_API!,
        "Content-Type": fileMimeType,
        Tags: encodedTags,
      },
      body: fileBuffer,
    });
    const responseBody = await response.json();

    return responseBody;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default uploadFileToArweave;
