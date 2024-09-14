import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import useMessageStore from "@/components/Store";
import getData from "@/lib/getFacilityData";
import { router } from "expo-router";

const LOGO_SIZE = 100;
const INPUT_PLACEHOLDER = "Facility Code";

const TriageScreen: React.FC = () => {
  const [facilityCode, setFacilityCodeInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setFacilityCode } = useMessageStore();

  const handleStartProcess = async () => {
    setLoading(true);

    try {
      const facilityData = await getData(facilityCode);

      if (facilityData?.length) {
        setFacilityCode(Number(facilityCode));
        router.push("/(screens)/ExportScreen");
      } else {
        Alert.alert("Error", "Incorrect facility code. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/triage_logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.welcomeText}>Welcome 👋</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={facilityCode}
          onChangeText={setFacilityCodeInput}
          placeholder={INPUT_PLACEHOLDER}
          keyboardType="numeric"
          secureTextEntry
          accessibilityLabel="Facility code input"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartProcess}
        disabled={loading}
        accessibilityLabel="Start Triage Process"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Start Triage Process</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default TriageScreen;
