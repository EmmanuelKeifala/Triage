import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextStyle,
  ViewStyle,
} from "react-native";
import Markdown from "react-native-markdown-display";

// Define props interface
interface MarkdownRendererProps {
  content: string;
}

// Define styles with explicit typing for better maintainability
const markdownStyles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    fontFamily: "mons",
  } as TextStyle,
  heading1: {
    fontSize: 28,
    fontFamily: "mons-black",
    marginVertical: 8,
  } as TextStyle,
  heading2: {
    fontSize: 24,
    fontFamily: "mons-bold",
    marginVertical: 6,
  } as TextStyle,
  heading3: {
    fontSize: 20,
    fontFamily: "mons-sb",
    marginVertical: 4,
  } as TextStyle,
  listItem: {
    fontSize: 16,
    fontFamily: "mons",
    marginVertical: 4,
  } as TextStyle,
  strong: {
    fontFamily: "mons-bold",
  } as TextStyle,
  em: {
    fontFamily: "mons",
    fontStyle: "italic",
  } as TextStyle,
  link: {
    color: "#1E90FF",
    fontFamily: "mons",
  } as TextStyle,
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#ddd",
    paddingLeft: 8,
    marginVertical: 16,
    fontStyle: "italic",
    color: "#666",
    fontFamily: "mons",
  } as TextStyle,
  codeInline: {
    backgroundColor: "#f4f4f4",
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: "monospace",
  } as TextStyle,
  codeBlock: {
    backgroundColor: "#f4f4f4",
    borderRadius: 4,
    padding: 8,
    fontFamily: "monospace",
    marginVertical: 16,
  } as TextStyle,
});

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Markdown style={markdownStyles}>
          {content || "No content available"}
        </Markdown>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  } as ViewStyle,
  scrollContainer: {
    flexGrow: 1,
  } as ViewStyle,
});

export default MarkdownRenderer;
