import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import useMessageStore from "@/components/Store";

interface Setting {
  location: string;
  type: "Focused" | "Emergency";
}

const SplashScreen = () => {
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const [isGearRotated, setIsGearRotated] = useState(false);
  const [settings, setSettings] = useState<Setting>({
    location: "",
    type: "Focused",
  });

  const rotationAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { addSetting } = useMessageStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      rotationAnim.stopAnimation(); // Avoid memory leaks
    };
  }, [rotationAnim]);

  // Handle gear rotation and bottom sheet toggle
  const handleGearPress = useCallback(() => {
    const newValue = isGearRotated ? 0 : 1;
    Animated.timing(rotationAnim, {
      toValue: newValue,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      setIsGearRotated((prev) => !prev);
    });

    if (isGearRotated) {
      bottomSheetModalRef.current?.dismiss();
    } else {
      bottomSheetModalRef.current?.present();
    }
  }, [isGearRotated, rotationAnim]);

  const rotateInterpolation = useMemo(
    () =>
      rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "60deg"],
      }),
    [rotationAnim]
  );

  const handleInputChange = useCallback(
    (field: keyof Setting, value: string) => {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleFormSubmit = useCallback(() => {
    if (settings.location.trim() !== "") {
      addSetting(settings);
      bottomSheetModalRef.current?.dismiss();
      setIsGearRotated(false);
    } else {
      Alert.alert(
        "Invalid Input",
        "Please select a valid location to proceed."
      );
    }
  }, [settings, addSetting]);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <LinearGradient colors={["#008080", "#fff"]} style={styles.background}>
          {/* Gear Icon */}
          <TouchableOpacity onPress={handleGearPress} style={styles.gearIcon}>
            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolation }] }}
            >
              <FontAwesome name="gear" size={30} color="#ffff" />
            </Animated.View>
          </TouchableOpacity>

          {/* White Crescent Shape */}
          <View style={styles.crescentShape}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/triage_logo.png")}
                style={styles.logoImage}
              />
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push("/(screens)/Chat")}
          >
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={isGearRotated ? 0 : -1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onDismiss={() => setIsGearRotated(false)}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <Text style={styles.formTitle}>Update Settings</Text>

            {/* Location Picker */}
            <Text style={styles.label}>Location</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.location}
                onValueChange={(value) => handleInputChange("location", value)}
                mode="dropdown"
              >
                <Picker.Item label="Select Location" value="" />
                <Picker.Item
                  label="Internal Medicine"
                  value="Internal Medicine"
                />
                <Picker.Item label="Surgery" value="Surgery" />
                <Picker.Item label="Paediatrics" value="Paediatrics" />
                <Picker.Item label="Obs&Gyn" value="Obs&Gyn" />
                <Picker.Item label="Family Planning" value="Family Planning" />
                <Picker.Item label="Mental Health" value="Mental Health" />
              </Picker>
            </View>

            {/* Type Picker */}
            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.type}
                onValueChange={(value) => handleInputChange("type", value)}
                mode="dropdown"
              >
                <Picker.Item label="Focused" value="Focused" />
                <Picker.Item label="Emergency" value="Emergency" />
              </Picker>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFormSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  gearIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  crescentShape: {
    position: "absolute",
    bottom: 0,
    width: "200%",
    height: "55%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 500,
    borderTopRightRadius: 400,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -0.25 }],
  },
  logoContainer: {
    position: "absolute",
    top: "20%",
    alignItems: "center",
  },
  logoImage: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  startButton: {
    backgroundColor: "#00857E",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 50,
    position: "absolute",
    bottom: 20,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "mons-black",
  },
  bottomSheetView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fafafa",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00857E",
  },
  label: {
    width: "100%",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
    color: "#00857E",
    fontFamily: "mons-sb",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#00857E",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "mons-black",
  },
});
