import React from "react";
import { StyleSheet, View, Animated } from "react-native";

const WaveForm = () => {
  const scaleX = new Animated.Value(1);

  // Function to start the animation
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleX, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wave, { transform: [{ scaleX }] }]} />
      <Animated.View style={[styles.wave, { transform: [{ scaleX }] }]} />
      <Animated.View style={[styles.wave, { transform: [{ scaleX }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  wave: {
    width: 10,
    height: 60,
    backgroundColor: "#008080",
    marginHorizontal: 5,
    borderRadius: 5,
  },
});

export default WaveForm;
