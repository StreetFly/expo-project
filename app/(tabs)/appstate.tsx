import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "assignment_state";

export default function AppStateDemo() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const appState = useRef(AppState.currentState);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [text, progress]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => subscription.remove();
  }, [progress]);

  function handleAppStateChange(nextState: AppStateStatus) {
    if (
      appState.current === "active" &&
      nextState.match(/inactive|background/)
    ) {
      pauseTask();
      setStatus("Paused (Background)");
      saveState();
    }

    if (
      appState.current.match(/inactive|background/) &&
      nextState === "active"
    ) {
      if (progress > 0 && progress < 100) {
        resumeTask();
      }

      setStatus("Active");
    }

    appState.current = nextState;
  }

  async function saveState() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          text,
          progress,
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function loadState() {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        const state = JSON.parse(saved);

        setText(state.text);
        setProgress(state.progress);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function startRequest() {
    if (interval.current) return;

    setStatus("Running");

    interval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval.current!);
          interval.current = null;
          setStatus("Completed");
          return 100;
        }

        return prev + 10;
      });
    }, 1000);
  }

  function pauseTask() {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  }

  function resumeTask() {
    startRequest();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AppState Assignment</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter some text"
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.text}>
        Saved Text: {text || "(empty)"}
      </Text>

      <Text style={styles.text}>
        Progress: {progress}%
      </Text>

      <Text style={styles.text}>
        Status: {status}
      </Text>

      <Button
        title="Start Mock Request"
        onPress={startRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
  },
});