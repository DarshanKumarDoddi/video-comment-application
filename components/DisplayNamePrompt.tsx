import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface DisplayNamePromptProps {
  visible: boolean;
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

export default function DisplayNamePrompt({
  visible,
  onSubmit,
  onSkip,
}: DisplayNamePromptProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Choose a Display Name
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            This will be shown on your comments
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            placeholder="Your name"
            placeholderTextColor={colors.secondary}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onSkip}>
              <Text style={[styles.skip, { color: colors.textSecondary }]}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submit, { backgroundColor: colors.primary }]}
              onPress={() => name.trim() && onSubmit(name.trim())}
            >
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    width: "80%",
    padding: 24,
    borderRadius: 12,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center" },
  subtitle: { fontSize: 13, textAlign: "center", marginBottom: 8 },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  skip: { fontSize: 14 },
  submit: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
