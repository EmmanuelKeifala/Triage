import { CachedFile, Setting } from "@/components/Store";

// Define types for function parameters and responses
export interface FetchApiParams {
  messagesData: any;
  settings?: Setting[];
  endpoint?: string;
  cachedFiles?: CachedFile;
}

interface FetchApiResponse {
  Error?: string;
  [key: string]: any; // Adjust based on actual expected response shape
}

const API_URL = "https://server-one-cyan.vercel.app/api"; // Move API URL to a constant

export const fetchApi = async ({
  messagesData,
  settings,
  endpoint,
  cachedFiles,
}: FetchApiParams): Promise<FetchApiResponse> => {
  if (!endpoint) {
    console.error("No endpoint provided");
    return { Error: "Endpoint is required" };
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messagesData,
        userSettings: settings,
        cache: cachedFiles,
      }),
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return { Error: `Something went wrong with status ${response.status}` };
    }

    const data: FetchApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error during fetch:", error);
    return { Error: "Network error or server is down" };
  }
};
