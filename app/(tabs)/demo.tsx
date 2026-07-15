import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function DemoScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">Demo Screen</ThemedText>
      <ThemedText>This is a demo screen.</ThemedText>
    </ThemedView>
  );
}
