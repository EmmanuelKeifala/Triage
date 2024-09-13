import React from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import WaveForm from "../WaveForm";
import * as Haptics from "expo-haptics";

interface VoiceInputProps {
  isSpeaking: boolean;
  aiSpeaking: boolean;
  startSpeechToText: () => void;
  stopSpeaking: () => void;
  cancelSpeechToText: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isSpeaking,
  aiSpeaking,
  startSpeechToText,
  stopSpeaking,
  cancelSpeechToText,
}) => {
  const handleStartSpeechToText = () => {
    startSpeechToText();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  };

  const handleCancelSpeechToText = () => {
    cancelSpeechToText();
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  return (
    <View style={styles.voiceInputContainer}>
      {!aiSpeaking ? (
        <>
          {!isSpeaking ? (
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={handleStartSpeechToText}
            >
              <FontAwesome name="microphone" size={50} color="#008080" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={handleCancelSpeechToText}
            >
              <WaveForm />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={handleStopSpeaking}
        >
          <MaterialCommunityIcons
            name="text-to-speech-off"
            size={50}
            color="#008080"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(VoiceInput);

const styles = StyleSheet.create({
  voiceInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  voiceButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#008080",
  },
});
