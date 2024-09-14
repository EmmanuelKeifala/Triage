import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  InteractionManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import useMessageStore, { Message } from "@/components/Store";
import { usePathname } from "expo-router";
import {
  VoiceInput,
  MessageBubble,
  NavButtons,
  LoadingDots,
  LogoContainer,
} from "@/components/chat";

import * as Haptics from "expo-haptics";

import { fetchApi } from "@/lib/fetchApi";
import { router } from "expo-router";

const endpoint = "chat";

const Chat = () => {
  const {
    messages,
    addMessage,
    clearMessages,
    settings,
    addFileToCache,
    checkFileCache,
  } = useMessageStore();

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiSpeaking, setAiSpeaking] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const dotAnimation = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentPath = usePathname();

  // Initialize Voice event listeners
  useEffect(() => {
    Voice.onSpeechError = onSpeechErrorHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;

    return () => {
      Voice.removeAllListeners();
      Voice.destroy();
    };
  }, []);

  // Voice event handlers
  const onSpeechStartHandler = () => {
    setIsSpeaking(true);
  };

  const onSpeechEndHandler = () => {
    setIsSpeaking(false);
  };

  const onSpeechResultsHandler = (event: SpeechResultsEvent) => {
    const text = event.value?.[0];
    if (text) {
      addMessage({ role: "user", content: text });
      sendMessageToAPI();
    } else {
      Alert.alert("No Speech Detected", "Please try speaking again.");
    }
  };

  const onSpeechErrorHandler = (event: SpeechErrorEvent) => {
    const errorCode = event.error?.code;
    const errorMessage = event.error?.message;

    if (
      errorCode === "7" ||
      (errorMessage && errorMessage.includes("No speech input"))
    ) {
      Alert.alert("No Speech Detected", "Please try speaking again.");
    } else {
      Alert.alert(
        "Speech Recognition Error",
        "Something went wrong. Please try again."
      );
    }
    setIsSpeaking(false);
  };

  // Text-to-Speech function
  const speak = (message: string) => {
    if (currentPath === "/Chat") {
      setAiSpeaking(true);
      Speech.speak(message, {
        onDone: () => {
          setAiSpeaking(false);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
        onError: (error) => {
          console.error("Speech Synthesis Error:", error);
          setAiSpeaking(false);
        },
        language: "en-US",
      });
    }
  };

  const stopSpeaking = async () => {
    await Speech.stop();
    setAiSpeaking(false);
  };

  // Function to handle sending messages to the API
  const sendMessageToAPI = async () => {
    setLoading(true);
    try {
      const currentMessages = useMessageStore.getState().messages;
      const cachedFiles = checkFileCache(settings[0].location);

      const response = await fetchApi({
        messagesData: currentMessages,
        settings,
        endpoint,
        cachedFiles,
      });
      const data = response;

      if (data && data.data && data.data.content) {
        addMessage({
          role: "assistant",
          content: data.data.content,
        });
        addFileToCache(settings[0].location, {
          fileUri: data.cache.fileUri,
          mimeType: data.cache.mimeType,
        });
      } else {
        Alert.alert("API Error", "Failed to fetch response from the AI.");
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "An error occurred while sending your message."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle speech-to-text initiation
  const startSpeechToText = async () => {
    if (aiSpeaking) {
      Alert.alert("AI is Speaking", "Please wait until AI finishes speaking.");
      return;
    }

    try {
      await Voice.start("en-US");
    } catch (error: any) {
      Alert.alert("Speech Recognition Error", error.message);
    }
  };

  // Stop speech-to-text
  const cancelSpeechToText = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      Alert.alert("Cancel Error", "Error canceling speech recognition.");
    }
  };

  // Scroll to the bottom on new message
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "assistant") {
      speak(latestMessage.content);
    }

    return () => {
      task.cancel();
    };
  }, [messages]);

  // Dot animation for loading
  useEffect(() => {
    if (loading) {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      dotAnimation.setValue(0);
    }
  }, [loading, dotAnimation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#cceff0", "#dbf2f2", "#eef7f7"]}
        style={styles.background}
      >
        <LogoContainer />
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          {messages.map((message: Message, index: number) => (
            <MessageBubble
              key={`${message.role}-${index}`}
              message={message.content}
              role={message.role}
            />
          ))}
          {loading && <LoadingDots dotAnimation={dotAnimation} />}
        </ScrollView>

        <VoiceInput
          isSpeaking={isSpeaking}
          aiSpeaking={aiSpeaking}
          startSpeechToText={startSpeechToText}
          stopSpeaking={stopSpeaking}
          cancelSpeechToText={cancelSpeechToText}
        />

        <NavButtons
          cancelSpeechToText={cancelSpeechToText}
          clearMessages={clearMessages}
          stopSpeaking={stopSpeaking}
          router={router}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cceff0",
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  chatContainer: {
    flex: 1,
    width: "90%",
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default Chat;
