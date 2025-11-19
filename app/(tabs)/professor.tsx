import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const CLASSROOM_BLUE = "#1874CD";
const TEXT_DARK = "#202124";
const TEXT_GRAY = "#5f6368";
const BG_LIGHT = "#f8f9fa";

type Comunicado = {
  id: string;
  professor: string;
  data: string;
  preview: string;
};

export default function ProfessorScreen() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [novoComunicado, setNovoComunicado] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const salvarComunicado = () => {
    if (novoComunicado.trim() === "") {
      Alert.alert("Erro", "O comunicado não pode estar vazio.");
      return;
    }

    if (editId) {
      setComunicados((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                preview: novoComunicado,
                data: new Date().toLocaleString(),
              }
            : item
        )
      );
      setEditId(null);
    } else {
      const newItem: Comunicado = {
        id: (comunicados.length + 1).toString(),
        professor: "Professor Claudio",
        data: new Date().toLocaleString(),
        preview: novoComunicado,
      };
      setComunicados([newItem, ...comunicados]);
    }

    setNovoComunicado("");
  };

  const deletarComunicado = (id: string) => {
    setComunicados((prev) => prev.filter((item) => item.id !== id));
  };

  const editarComunicado = (item: Comunicado) => {
    setNovoComunicado(item.preview);
    setEditId(item.id);
  };

  const renderItem = ({ item }: { item: Comunicado }) => (
    <View style={styles.card}>
      <View style={styles.cardIndicator} />
      <View style={{ flex: 1 }}>
        <Text style={styles.professor}>{item.professor}</Text>
        <Text style={styles.data}>{item.data}</Text>
        <Text style={styles.preview}>{item.preview}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => editarComunicado(item)}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deletarComunicado(item.id)}
            style={styles.actionButton}
          >
            <Text style={[styles.actionText, { color: "red" }]}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PAINEL DO PROFESSOR</Text>
        <IconSymbol
          name="person.circle.fill"
          size={30}
          color="#fff"
          style={styles.profileIcon}
        />
      </View>

      {/* Caixa da matéria (igual ao aluno) */}
      <View style={styles.materiaBox}>
        <Text style={styles.materiaTitulo}>Cálculo 1</Text>
        <Text style={styles.materiaSubtitulo}>FUCAPI - 2025/1</Text>
      </View>

      {/* Card de criação */}
      <View style={styles.box}>
        <Text style={styles.cursoText}>Criar comunicado</Text>

        <TextInput
          style={styles.input}
          placeholder="Escreva um comunicado..."
          value={novoComunicado}
          onChangeText={setNovoComunicado}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={salvarComunicado}>
          <Text style={styles.buttonText}>
            {editId ? "Salvar Alteração" : "Criar Comunicado"}
          </Text>
        </TouchableOpacity>

        {/* Lista */}
        <FlatList
          data={comunicados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },

  header: {
    width: "100%",
    height: 140,
    backgroundColor: CLASSROOM_BLUE,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    elevation: 3,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileIcon: {
    position: "absolute",
    right: 20,
    top: 25,
  },

  // --- Box da matéria (igual ao aluno) ---
  materiaBox: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 12,
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

  // --- Card de criação ---
  box: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 4,
    flex: 1,
  },
  cursoText: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 10,
  },

  button: {
    backgroundColor: CLASSROOM_BLUE,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // --- Card de comunicado ---
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
    paddingRight: 10,
  },
  cardIndicator: {
    width: 6,
    backgroundColor: CLASSROOM_BLUE,
  },
  professor: { fontSize: 15, fontWeight: "700", color: TEXT_DARK },
  data: { fontSize: 12, color: TEXT_GRAY, marginBottom: 4 },
  preview: { fontSize: 14, color: TEXT_GRAY },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: { fontSize: 12, fontWeight: "700", color: "#000" },
});
