export interface ChatFaceInterface {
  id: number;
  name: string;
  image: string;
  primary: string;
  secondary: string;
}

export interface SendMessagePayload {
  content: string;
  role: "user" | "assistant";
  facilityCode: number;
  patientId: string;
}
