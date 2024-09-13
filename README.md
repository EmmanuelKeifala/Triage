# Welcome to Triage

## Getting Started with the App

This guide will help you set up the **Triage** app development environment. Follow the steps carefully to get your app running.

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (Version v22.x or higher)
- **Expo CLI** (You can install this globally using `npm install -g expo-cli`)

If you do not have these installed, follow the official installation instructions:

- [Node.js Installation](https://nodejs.org/en/download/)
- [Expo Installation](https://docs.expo.dev/get-started/installation/)

### Step-by-Step Setup

#### Step 1: Install Dependencies

Navigate to the project folder and run the following command in your terminal to install all required packages:

```bash
npm install
```

This will install all the necessary dependencies defined in the `package.json` file.

#### Step 3: Generate a development build

To run the dev build on your physical device without expo go. Why? Because most react native modules do not work in expo-go

- **Install the latest EAS CLI**: `npm install -g eas-cli` we recommend you use `npm` over `yarn` for global package installations
- **Log in to your Expo account**: `eas login`
- **Configure the project**: `eas build:configure`
- **Run a build Build for Android Emulator/device or iOS Simulator**: this works for android `eas build --profile development --platform android` we recommend using android dev builds over ios dev builds
  -- **Download the abb file**: download the abb file from expo dev website and install

#### Step 3: Start the Development Application

Once the dependencies are installed, use the following command to start the Expo development server:

```bash
npx expo --dev-client
```

This will launch Expo's development tools in your browser, where you can run the app on an emulator, physical device, or web preview.

### Tech Stack Overview

The app leverages the following technologies:

- **React Native**: For building cross-platform mobile applications.
- **Expo**: For streamlining the development and testing of React Native apps.
- **Node.js**: For managing dependencies and running the development server.
- **React Navigation**: To handle routing and navigation between screens.
- **AsyncStorage**: For persistent local storage in the app.
- **Supabase**: For handling storage of public patient data.
- **Akord on Arweave**: Akord is an on-chain decentralized permanent storage option, that stores all the patient medical info.
- **google/generative-ai**: Used to generate responses for interactive sessions with patient and to generate a summary of the data.
- **Zustand**: For effective and effortless state management.

### Things to Look Out For

1. **Expo vs React Native**: Expo is just a workflow, so most native modules will not run in expo-go. To fix this issue, we advise that you first build the android dev app
2. **Expo CLI**: If you encounter issues with Expo not starting or crashes, try updating Expo using:
   ```bash
   npm install -g expo-cli
   ```
3. **Metro Bundler Issues**: If the Metro bundler fails to start or crashes, try clearing the cache by running:
   ```bash
   expo start --clear
   ```
4. **Emulator or Physical Device**: Ensure that you have an emulator (iOS/Android) properly set up or your physical device connected with USB debugging enabled.

### Environment Configuration

In this project, you’ll need to set up your `.env` file to manage sensitive data like API keys or configuration settings. Create a `.env` file at the root of the project and add your environment variables. Here's an example:

```bash
EXPO_PUBLIC_GOOGLE_API_KEY="from google gemini studio"
EXPO_PUBLIC_SUPABASE_URL = "from subaase"
EXPO_PUBLIC_SUPABASE_KEY="from supabase"
EXPO_PUBLIC_AKORD_API ="from arweave(akord)"
```

Make sure to include `.env` in your `.gitignore` file to prevent it from being committed to version control.

### Explanation of the App

The **Triage** app is designed to help healthcare workers to get patient medical history seemlessly and effortlessly:

- Have a voice conversation with the patient.
- Analyze the data from AI to AI models.
- Sync data with a backend server to ensure persistence across devices and send them on the blockchain for permanent storage, integrity and privacy.

### Common Troubleshooting Tips

1. **Missing or incorrect `.env` variables**: Double-check your environment variables. The app may fail to connect to the API without correct configurations.
2. **Slow Metro Bundler**: Restart your terminal or run the `npx expo --dev-client --clear` command to ensure a fresh build.
3. **Build Errors**: Ensure that all dependencies are installed correctly by running `npm install` again or deleting the `node_modules` folder and reinstalling.

### Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Node.js Documentation](https://nodejs.org/en/docs/)

Feel free to reach out if you encounter any issues!
