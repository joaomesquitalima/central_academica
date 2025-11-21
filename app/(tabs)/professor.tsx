import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator
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

  // 🔥 Agora os dados da matéria e professor vêm da API
  const [materiaTitulo, setMateriaTitulo] = useState("");
  const [materiaSubtitulo, setMateriaSubtitulo] = useState("");
  const [professorNome, setProfessorNome] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔥 Buscar dados da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await fetch("http://ip:3000/professor/dados");
        const data = await res.json();

        setMateriaTitulo(data.materiaTitulo);
        setMateriaSubtitulo(data.materiaSubtitulo);
        setProfessorNome(data.professorNome);
        setComunicados(data.comunicados);

      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar dados da API");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // --- Criar ou editar comunicado ---
  const salvarComunicado = async () => {
    if (novoComunicado.trim() === "") {
      Alert.alert("Erro", "O comunicado não pode estar vazio.");
      return;
    }

    // ✏ Atualizar
    if (editId) {
      try {
        await fetch(`http://ip:3000/comunicados/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preview: novoComunicado }),
        });

        setComunicados((prev) =>
          prev.map((item) =>
            item.id === editId
              ? { ...item, preview: novoComunicado, data: new Date().toISOString() }
              : item
          )
        );
      } catch {
        Alert.alert("Erro", "Falha ao editar comunicado.");
      }

      setEditId(null);
    } 
    
    // 🆕 Criar
    else {
      try {
        const res = await fetch("http://SEU-IP:3000/comunicados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preview: novoComunicado,
            professor: professorNome,
          }),
        });

        const novo = await res.json();

        setComunicados((prev) => [novo, ...prev]);

      } catch {
        Alert.alert("Erro", "Falha ao criar comunicado.");
      }
    }

    setNovoComunicado("");
  };

  // --- Deletar ---
  const deletarComunicado = async (id: string) => {
    try {
      await fetch(`http://SEU-IP:3000/comunicados/${id}`, { method: "DELETE" });

      setComunicados((prev) => prev.filter((item) => item.id !== id));
    } catch {
      Alert.alert("Erro", "Falha ao deletar comunicado.");
    }
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
      {loading ? (
        <ActivityIndicator size={30} color={CLASSROOM_BLUE} style={{ marginTop: 50 }} />
      ) : (
        <>
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

          {/* Box da matéria -> agora dinâmico */}
          <View style={styles.materiaBox}>
            <Text style={styles.materiaTitulo}>{materiaTitulo}</Text>
            <Text style={styles.materiaSubtitulo}>{materiaSubtitulo}</Text>
          </View>

          {/* Criar comunicado */}
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

            <FlatList
              data={comunicados}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingTop: 10 }}
            />
          </View>
        </>
      )}
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
