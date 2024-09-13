import { CachedFile } from "@/components/Store";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_KEY!);
const fileManager = new GoogleAIFileManager(
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY!
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MAX_RETRIES = 3;

// async function getFileFromCacheOrUpload(location: string) {
//   const pdfList = await fileManager.listFiles();
//   const file = pdfList.files?.find((file) => file.displayName === location);

//   if (!file) {
//     let response;
//     switch (location) {
//       case "Obs&Gyn":
//         response = await fileManager.uploadFile("assets/files/obgyn.pdf", {
//           mimeType: "application/pdf",
//           displayName: location,
//         });
//         break;
//       case "Mental Health":
//         response = await fileManager.uploadFile("assets/files/mhealth.pdf", {
//           mimeType: "application/pdf",
//           displayName: location,
//         });
//         break;
//       case "Internal Medicine":
//         response = await fileManager.uploadFile("assets/files/im.pdf", {
//           mimeType: "application/pdf",
//           displayName: location,
//         });
//         break;
//       case "Paediatrics":
//         response = await fileManager.uploadFile("assets/files/peds.pdf", {
//           mimeType: "application/pdf",
//           displayName: location,
//         });
//         break;
//       default:
//         throw new Error(`Unknown location: ${location}`);
//     }

//     if (response) {
//       return {
//         fileUri: response.file.uri,
//         mimeType: response.file.mimeType,
//       };
//     } else {
//       throw new Error(`Failed to upload file for location: ${location}`);
//     }
//   }

//   if (file && file.uri && file.mimeType) {
//     return {
//       fileUri: file.uri,
//       mimeType: file.mimeType,
//     };
//   } else {
//     throw new Error(`File is missing data for location: ${location}`);
//   }
// }

export async function POST(req: Request, res: Response) {
  try {
    const { message: userMessage, userSettings, cachedFile } = await req.json();
    // console.log("userSettings:", userSettings);

    if (!Array.isArray(userMessage) || userMessage.length === 0) {
      return new Response(
        JSON.stringify({ message: "No valid user message", status: 400 }),
        { status: 400 }
      );
    }

    // let fileData: CachedFile = {
    //   fileUri: "",
    //   mimeType: "",
    // };

    // if (cachedFile && cachedFile[userSettings[0].location]) {
    //   // Use cached file data
    //   fileData = cachedFile[userSettings[0].location];
    // } else {
    //   // Fetch file from cache or upload if not present
    //   fileData = await getFileFromCacheOrUpload(userSettings[0].location);
    // }

    // Build the conversation history prompt
    const conversationHistory = userMessage
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role}: ${msg.content}`
      )
      .join("\n");

    const settings = userSettings?.map(
      (setting: { location: string; type: string }) =>
        `triage location: ${setting.location}, type: ${setting.type}`
    );

    const prompt = `
You are an AI assistant designed to interact with patients and gather medical information in a caring, professional manner. Your role is to conduct a thorough patient interview, collecting important details about their health and medical history.
ask one question at a time, do not repeat your self, make the conversation natural and more human like sound like triage nurse
Please engage with the patient respectfully and empathetically, asking questions related to the following areas:

1. Biodata: Basic personal information (name, age, gender, address, date of interview etc.) this is very key and must promted for do not leave it behind

2. Presenting complaint(s): The main reason(s) for their visit or concern

3. History of presenting complaint: Details about when and how their symptoms started, and how they've progressed

4. Direct questioning: Specific questions related to their presenting complaint

5. Systemic inquiry (review): General health questions covering various body systems

6. Pregnancy and delivery history: If applicable, details about pregnancies and childbirth

7. Past medical history: Previous illnesses, surgeries, or health conditions

8. Drug history: Current medications, past medications, allergies

9. Developmental history: For pediatric patients, information about their growth and development

10. Feeding history: For infants or patients with eating concerns, details about diet and nutrition

11. Immunization history: Record of vaccinations

12. Family history: Health conditions that run in the family

13. Social history: Lifestyle factors, occupation, living situation

### Location-Specific Questions:
Based on the patient's location in the hospital, ask relevant questions that are specific to their department. For example:
- Surgery Department: Ask about previous surgeries, current symptoms related to surgical conditions, and specific pre-surgical evaluations.
- Emergency Department: Focus on immediate symptoms, trauma history, and rapid assessment of vital signs.

### Type-Specific Questions:
Depending on the type of triage:
- Focused: Ask detailed questions related to the presenting complaint and delve deeply into the patient's history and symptoms.
- Emergency: Ask only the most relevant questions to quickly assess the patient’s condition and prioritize urgent needs.

After gathering all relevant information, provide a brief summary of the key points from the patient's history and differential diagnosis with percentages. never spend too much time clerking

Remember to:
- Use simple, clear language
- Be patient and allow time for responses
- Show empathy and understanding
- Respect patient privacy and confidentiality
- Clarify any confusing or conflicting information
- Adapt your questions based on the patient's age and specific situation

Your goal is to gather comprehensive information while ensuring the patient feels heard, respected, and comfortable throughout the interaction and make some differential diagnosis at the end.

do not repeat the conversation when giving a response the converstation is just to guide you.

Do not repeat what is in the converstation
Conversation history:
${conversationHistory}

Settings:
${settings}

Healthcare Assistant:
`;

    let assistantContent = "";
    let attempts = 0;

    while (attempts < MAX_RETRIES && !assistantContent) {
      attempts++;
      console.log(`Attempt ${attempts} to generate response`);

      // Generate content with the AI model
      const result = await model.generateContent([
        // {
        //   fileData: {
        //     mimeType: fileData.mimeType,
        //     fileUri: fileData.fileUri,
        //   },
        // },
        prompt,
      ]);

      assistantContent =
        result.response.candidates?.[0]?.content?.parts[0]?.text || "";
    }

    if (!assistantContent) {
      assistantContent =
        "No response from the assistant after several attempts.";
    }

    console.log(assistantContent);

    const assistantMessage = {
      role: "assistant",
      content: assistantContent,
    };

    return new Response(JSON.stringify({ data: assistantMessage, cache: "" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate response",
        statusText: "500",
      }),
      { status: 500 }
    );
  }
}
