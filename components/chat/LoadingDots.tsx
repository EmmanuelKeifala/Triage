import { Animated, StyleSheet, Text, View } from "react-native";

const LoadingDots = ({ dotAnimation }: { dotAnimation: Animated.Value }) => {
  const animatedDotStyle = {
    opacity: dotAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>AI is typing</Text>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, animatedDotStyle]} />
        <Animated.View style={[styles.dot, animatedDotStyle]} />
        <Animated.View style={[styles.dot, animatedDotStyle]} />
      </View>
    </View>
  );
};

export default LoadingDots;

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#005f73",
  },
  dotsContainer: {
    flexDirection: "row",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#005f73",
    marginHorizontal: 4,
  },
});
