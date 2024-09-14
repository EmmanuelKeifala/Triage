import { create } from "zustand";

export interface Message {
  content: string;
  role: "user" | "assistant";
}

export interface Setting {
  location: string;
  type: "Focused" | "Emergency";
}

export interface CachedFile {
  fileUri: string;
  mimeType: string;
}

interface MessageStore {
  facilityCode: number;
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setFacilityCode: (code: number) => void;
  settings: Setting[];
  addSetting: (setting: Setting) => void;
  clearSetting: () => void;
  fileCache: Record<string, CachedFile>; // cache object
  checkFileCache: (location: string) => CachedFile | undefined;
  addFileToCache: (location: string, fileData: CachedFile) => void;
}

const useMessageStore = create<MessageStore>((set, get) => ({
  facilityCode: 1,
  messages: [
    {
      content: "Hi, how can I assist you",
      role: "assistant",
    },
  ],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () =>
    set((state) => ({
      messages: state.messages.length > 0 ? [state.messages[0]] : [],
    })),
  setFacilityCode: (code) => set({ facilityCode: code }),
  settings: [
    {
      location: "Emergency",
      type: "Focused",
    },
  ],
  addSetting: (setting) =>
    set(() => ({
      settings: [setting],
    })),
  clearSetting: () =>
    set(() => ({
      settings: [
        {
          location: "Emergency",
          type: "Focused",
        },
      ],
    })),
  fileCache: {},

  checkFileCache: (location) => {
    const state = get();
    return state.fileCache[location];
  },

  addFileToCache: (location, fileData) => {
    const state = get();
    const existingFile = state.fileCache[location];

    if (existingFile) {
      if (
        existingFile.fileUri === fileData.fileUri &&
        existingFile.mimeType === fileData.mimeType
      ) {
        // Do nothing if the file data is the same
        return;
      }
    }

    // Update cache with new file data if different or not present
    set((state) => ({
      fileCache: {
        ...state.fileCache,
        [location]: fileData,
      },
    }));
  },
}));

export default useMessageStore;
