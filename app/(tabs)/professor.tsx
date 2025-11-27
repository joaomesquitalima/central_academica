import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const CLASSROOM_BLUE = "#1874CD";
const TEXT_DARK = "#202124";
const TEXT_GRAY = "#5f6368";
const BG_LIGHT = "#f8f9fa";

type Comunicado = {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  professorNome: string;
  professorEmail: string;
};

export default function ProfessorScreen() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoComunicado, setNovoComunicado] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [materiaTitulo] = useState("Matemática");
  const [materiaSubtitulo] = useState("Turma 301");
  const [professorNome] = useState("Professor João");
  const professorEmail = "seuemail@dominio.com";

  // --- Carregar comunicados ---
  const carregarComunicados = async () => {
    try {
      const res = await fetch(
        `http://192.168.15.2:5000/comunicados/professor/${encodeURIComponent(professorEmail)}`
      );
      if (!res.ok) throw new Error("Falha ao carregar comunicados");
      const data: Comunicado[] = await res.json();
      setComunicados(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao buscar comunicados.");
    }
  };

  useEffect(() => {
    const init = async () => {
      await carregarComunicados();
      setLoading(false);
    };
    init();
  }, []);

  // --- Criar ou editar comunicado ---
  const salvarComunicado = async () => {
    if (!novoTitulo.trim() || !novoComunicado.trim()) {
      Alert.alert("Erro", "O título e o comunicado não podem estar vazios.");
      return;
    }

    try {
      // ✏ Editar comunicado existente
      if (editId) {
        const res = await fetch(
          `http://192.168.15.2:5000/comunicados/${encodeURIComponent(editId)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: novoTitulo, conteudo: novoComunicado }),
          }
        );
        if (!res.ok) throw new Error("Erro ao editar comunicado");

        setEditId(null);
      } 
      // 🆕 Criar novo comunicado
      else {
        const res = await fetch("http://192.168.15.2:5000/comunicados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: novoTitulo,
            conteudo: novoComunicado,
            professorNome,
            professorEmail,
          }),
        });
        if (!res.ok) throw new Error("Erro ao criar comunicado");
      }

      // Atualiza lista e limpa campos
      await carregarComunicados();
      setNovoTitulo("");
      setNovoComunicado("");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao salvar comunicado.");
    }
  };

  // --- Deletar comunicado ---
  const deletarComunicado = async (id: string) => {
    try {
      const res = await fetch(`http://192.168.15.2:5000/comunicados/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar comunicado");

      await carregarComunicados();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao deletar comunicado.");
    }
  };

  // --- Carregar comunicado no input para edição ---
  const editarComunicado = (item: Comunicado) => {
    setNovoTitulo(item.titulo);
    setNovoComunicado(item.conteudo);
    setEditId(item.id);
  };

  // --- Renderizar cada card ---
  const renderItem = ({ item }: { item: Comunicado }) => (
    <View style={styles.card}>
      <View style={styles.cardIndicator} />
      <View style={{ flex: 1 }}>
        <Text style={styles.professor}>{item.titulo}</Text>
        <Text style={styles.data}>{item.dataPublicacao}</Text>
        <Text style={styles.preview}>{item.conteudo}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => editarComunicado(item)} style={styles.actionButton}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletarComunicado(item.id)} style={styles.actionButton}>
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
          <View style={styles.header}>
            <Text style={styles.headerText}>PAINEL DO PROFESSOR</Text>
            <IconSymbol name="person.circle.fill" size={30} color="#fff" style={styles.profileIcon} />
          </View>

          <View style={styles.materiaBox}>
            <Text style={styles.materiaTitulo}>{materiaTitulo}</Text>
            <Text style={styles.materiaSubtitulo}>{materiaSubtitulo}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.cursoText}>Criar comunicado</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite o título do comunicado..."
              value={novoTitulo}
              onChangeText={setNovoTitulo}
            />
            <TextInput
              style={styles.input}
              placeholder="Escreva um comunicado..."
              value={novoComunicado}
              onChangeText={setNovoComunicado}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={salvarComunicado}>
              <Text style={styles.buttonText}>{editId ? "Salvar Alteração" : "Criar Comunicado"}</Text>
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
  headerText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  profileIcon: { position: "absolute", right: 20, top: 25 },
  materiaBox: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    elevation: 3,
  },
  materiaTitulo: { fontSize: 20, fontWeight: "600", color: TEXT_DARK, marginBottom: 4 },
  materiaSubtitulo: { fontSize: 14, color: TEXT_GRAY },
  box: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 4,
    flex: 1,
  },
  cursoText: { fontSize: 18, fontWeight: "700", color: TEXT_DARK, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    minHeight: 40,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: { 
  backgroundColor: CLASSROOM_BLUE, 
  borderRadius: 10, 
  paddingVertical: 12, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, marginBottom: 12, elevation: 2, overflow: "hidden", paddingRight: 10 },
  cardIndicator: { width: 6, backgroundColor: CLASSROOM_BLUE },
  professor: { fontSize: 15, fontWeight: "700", color: TEXT_DARK },
  data: { fontSize: 12, color: TEXT_GRAY, marginBottom: 4 },
  preview: { fontSize: 14, color: TEXT_GRAY },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8, gap: 10 },
  actionButton: { backgroundColor: "#eee", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  actionText: { fontSize: 12, fontWeight: "700", color: "#000" },
});
