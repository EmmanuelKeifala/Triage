import { View, StyleSheet, Text } from "react-native";
import MarkdownRenderer from "./MarkdownToText";

const MessageBubble = ({
  message,
  role,
}: {
  message: string;
  role: "user" | "assistant";
}) => {
  return (
    <View
      style={[
        styles.messageBubble,
        role === "user" ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      {message.includes("*") || message.includes("#") ? (
        <MarkdownRenderer content={message} />
      ) : (
        <Text
          style={
            role === "user"
              ? styles.userMessageText
              : styles.assistantMessageText
          }
        >
          {message}
        </Text>
      )}
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#008080",
    alignSelf: "flex-end",
    fontFamily: "mons-sb",
  },
  assistantMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderColor: "#005f73",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userMessageText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "mons-sb",
  },
  assistantMessageText: {
    color: "#005f73",
    fontSize: 16,
    fontFamily: "mons-sb",
  },
});
