import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TEXT_DARK = "#202124";
const TEXT_GRAY = "#5f6368";

// ---- TIPAGEM DAS PROPS ----
type MateriaBoxProps = {
  titulo: string;
  subtitulo: string;
};

export function MateriaBox({ titulo, subtitulo }: MateriaBoxProps) {
  return (
    <View style={styles.materiaBox}>
      <Text style={styles.materiaTitulo}>{titulo}</Text>
      <Text style={styles.materiaSubtitulo}>{subtitulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  materiaBox: {
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.2,
  },

  materiaTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 4,
  },

  materiaSubtitulo: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
});
