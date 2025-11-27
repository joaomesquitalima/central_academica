import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MateriaBox } from "../../components/MateriaBox";

const CLASSROOM_BLUE = "#1874CD";
const TEXT_DARK = "#202124";
const TEXT_GRAY = "#5f6368";
const BG_LIGHT = "#f8f9fa";

// Estrutura do comunicado vinda da API
type Comunicado = {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  professorEmail: string;
};

// Recebe a função do TabLayout para atualizar badge
type Props = {
  setUnreadComunicados?: (count: number) => void;
};

export default function ComunicadosScreen({ setUnreadComunicados }: Props) {
  const [aluno, setAluno] = useState({
    nome: "Aluno PlaceHolder",
    faltas: 0,
    limiteFaltas: 0
  });

  const [comunicados, setComunicados] = useState<Comunicado[]>([]);

  const [turmaInfo, setTurmaInfo] = useState({
    materia: "Carregando...",
    periodo: "----/--"
  });

  // Puxa faltas do aluno
  useEffect(() => {
    fetch("http://192.168.15.2:5000/faltas")
      .then(res => res.json())
      .then(data => {
        setAluno(prev => ({
          ...prev,
          faltas: data.faltas,
          limiteFaltas: data.limite
        }));
      })
      .catch(err => console.error(err));
  }, []);

  // Puxa comunicados da API
  useEffect(() => {
    fetch("http://192.168.15.2:5000/comunicados/aluno")
      .then(res => res.json())
      .then(data => {
        setComunicados(data);

        // Atualiza badge dinamicamente
        if (setUnreadComunicados) {
          setUnreadComunicados(data.length);
        }

        if (data.turma) {
          setTurmaInfo({
            materia: data.turma.materia,
            periodo: data.turma.periodo
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const renderItem = ({ item }: { item: Comunicado }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardIndicator} />
      <View style={styles.cardContent}>
        <Text style={styles.professor}>{item.titulo}</Text>
        <Text style={styles.data}>{new Date(item.dataPublicacao).toLocaleString("pt-BR")}</Text>
        <Text style={styles.preview} numberOfLines={2}>{item.conteudo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>COMUNICADOS</Text>
      </View>

      <MateriaBox 
        titulo={turmaInfo.materia}
        subtitulo={`FUCAPI — ${turmaInfo.periodo}`}
      />
    

      <View style={styles.contentArea}>
        <View style={styles.alunoCard}>
          <Text style={styles.alunoNome}>Bem-vindo, {aluno.nome}</Text>
          <View style={styles.alunoFaltasContainer}>
            <Text style={styles.alunoFaltas}>
              Faltas:{" "}
              <Text style={aluno.faltas >= aluno.limiteFaltas * 0.9 ? styles.faltasRed : styles.faltasNormal}>
                {aluno.faltas}%
              </Text>{" "}
              de {aluno.limiteFaltas}% (Limite)
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Avisos Recentes</Text>

        <FlatList
          data={comunicados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },
  header: { width: "100%", height: 140, backgroundColor: CLASSROOM_BLUE, justifyContent: "center", paddingTop: 40, elevation: 2 },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "600", textAlign: 'center' },
  contentArea: { flex: 1, paddingHorizontal: 15, paddingTop: 15 },
  alunoCard: { backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 15, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, borderLeftWidth: 5, borderLeftColor: CLASSROOM_BLUE },
  alunoNome: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: TEXT_DARK },
  alunoFaltasContainer: { paddingTop: 5, borderTopWidth: 1, borderTopColor: "#eee" },
  alunoFaltas: { fontSize: 14, color: TEXT_GRAY },
  faltasNormal: { color: CLASSROOM_BLUE, fontWeight: "bold" },
  faltasRed: { color: "red", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: TEXT_DARK, marginBottom: 10, marginTop: 5, paddingLeft: 5 },
  flatListContent: { paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, overflow: 'hidden' },
  cardIndicator: { width: 6, backgroundColor: CLASSROOM_BLUE },
  cardContent: { flex: 1, padding: 15 },
  professor: { fontSize: 15, fontWeight: "bold", color: TEXT_DARK, marginBottom: 2 },
  data: { fontSize: 12, color: TEXT_GRAY, marginBottom: 8 },
  preview: { fontSize: 14, color: TEXT_GRAY },
  materiaBox: { backgroundColor: "#fff", marginHorizontal: 15, marginTop: 12, marginBottom: 8, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 18, elevation: 3 },
  materiaTitulo: { fontSize: 20, fontWeight: "600", color: TEXT_DARK, marginBottom: 4 },
  materiaSubtitulo: { fontSize: 14, color: TEXT_GRAY },
});
