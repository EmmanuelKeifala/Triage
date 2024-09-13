import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

const outputFormat: OutputFormat = {
  Biodata: {
    "Name of patient": "",
    Age: "",
    Sex: "",
    Address: "",
    "Date of interview": "",
    "Date of admission": "",
    Informant: "",
    "Reliability of the history": "",
    "Educational level of informant": "",
  },
  "Presenting complaint(s)": "",
  "History of presenting complaint": "",
  "Direct questioning": "",
  "Systemic inquiry(review)": "",
  "Pregnancy and delivery history": "",
  "Past medical history": "",
  "Drug history": "",
  "Developmental history": "",
  "Feeding history": "",
  "Immunization history": "",
  "Family history": "",
  "Social history": "",
  Summary: "",
  "differential diagnosis": "",
  "Doctors to see": "",
};

const numRetries = 5; // Limit the number of retries for generating valid JSON

// Utility function to strip backticks and "```json" blocks
const cleanResponse = (content: string) => {
  return content
    .replace(/```json/g, "") // Remove the "```json" block
    .replace(/```/g, "") // Remove trailing ```
    .trim(); // Remove any extra spaces
};

export async function POST(req: Request, res: Response) {
  try {
    const { message: userMessage } = await req.json();

    const conversationHistory = userMessage
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role}: ${msg.content}`
      )
      .join("\n");

    const prompt = `
      You are a virtual healthcare assistant tasked with diagnosing patients based on their symptoms.
      You will review a conversation and derive the following data points, returning them in valid JSON format with the following keys:
      "Biodata": {
        "Name of patient": "",
        "Age": "",
        "Sex": "",
        "Address": "",
        "Date of interview": "",
        "Date of admission": "",
        "Informant": "",
        "Reliability of the history": "",
        "Educational level of informant": ""
      },
      "Presenting complaint(s)",
      "History of presenting complaint",
      "Direct questioning",
      "Systemic inquiry(review)",
      "Pregnancy and delivery history",
      "Past medical history",
      "Drug history",
      "Developmental history",
      "Feeding history",
      "Immunization history",
      "Family history",
      "Social history",
      "Summary",
      "differential diagnosis",
      "Doctors to see"

      Your output must be a valid JSON structure, and all fields must be filled based on the conversation.
      Do not use escape characters or quotes inside values.
      Replace any dynamic elements (e.g., <content>) with appropriate values.
      If the output is incorrect, the system will retry the request.

      Conversation History:
      ${conversationHistory}

      Healthcare Assistant:
    `;

    let error_msg = ""; // For tracking retries
    let result = null;

    // Retry logic to ensure valid JSON response
    for (let i = 0; i < numRetries; i++) {
      // Generate content with the AI model
      result = await model.generateContent(prompt + error_msg);

      let assistantContent =
        result.response?.candidates?.[0]?.content.parts[0].text ||
        "No response from the assistant";

      // Clean the response by removing markdown formatting
      assistantContent = cleanResponse(assistantContent);

      // Attempt to parse the output as JSON
      try {
        const parsedOutput = JSON.parse(assistantContent.replace(/'/g, '"'));

        // Check if all expected keys exist in the output
        const keysAreValid = Object.keys(outputFormat).every(
          (key) => key in parsedOutput
        );
        if (!keysAreValid) {
          throw new Error("Missing keys in the JSON output");
        }

        console.log(parsedOutput);
        // Return the valid JSON response
        return Response.json({ data: parsedOutput });
      } catch (error) {
        error_msg = `\nInvalid JSON format. Retrying... \nError message: ${error}`;
        console.log(error_msg);
        console.log("Current invalid JSON format:", assistantContent);
      }
    }

    // If retries exhausted and no valid JSON was produced
    throw new Error(
      "Failed to generate valid JSON response after multiple attempts."
    );
  } catch (error: any) {
    console.error("Error generating response:", error);
    return Response.json({
      error: "Failed to generate response",
      statusText: error.message,
    });
  }
}
