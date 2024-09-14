import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const NavButtons = ({
  cancelSpeechToText,
  clearMessages,
  stopSpeaking,
}: {
  cancelSpeechToText: () => void;
  clearMessages: () => void;
  stopSpeaking: () => void;
}) => {
  return (
    <View style={styles.navButtonsContainer}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => {
          stopSpeaking();
        }}
      >
        <FontAwesome name="undo" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton]}
        onPress={() => {
          clearMessages();
          stopSpeaking();
        }}
      >
        <MaterialCommunityIcons
          name="chat-remove-outline"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, styles.exportButton]}
        onPress={() => {
          router.navigate("/(screens)/FacilityLogin"), stopSpeaking();
        }}
      >
        <MaterialCommunityIcons name="export-variant" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default NavButtons;

const styles = StyleSheet.create({
  navButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 20,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#008080",
    justifyContent: "center",
    alignItems: "center",
  },
  exportButton: {
    backgroundColor: "#005f73", // Slightly different color for export button
  },
});
