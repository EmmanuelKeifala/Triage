import { Image, StyleSheet, View } from "react-native";

const LogoContainer = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("@/assets/images/triage_logo.png")}
        style={{ width: 128, height: 98, resizeMode: "contain" }}
      />
    </View>
  );
};

export default LogoContainer;

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#b0e0e6",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
  },
});
