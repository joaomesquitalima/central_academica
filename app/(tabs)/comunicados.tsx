import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

export default function ComunicadosScreen() {

  
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
  fetch("http://192.168.15.3:5000/comunicados/aluno")
    .then(res => res.json())
    .then(data => {
      
      setComunicados(data);

    
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
      <Text style={styles.professor}>
        {item.titulo}
      </Text>

      <Text style={styles.data}>
        {new Date(item.dataPublicacao).toLocaleString("pt-BR")}
      </Text>

      <Text style={styles.preview} numberOfLines={2}>
        {item.conteudo}
      </Text>
    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>COMUNICADOS</Text>
      </View>

      {/* Bloco da matéria */}
      <View style={styles.materiaBox}>
        <Text style={styles.materiaTitulo}>{turmaInfo.materia}</Text>
        <Text style={styles.materiaSubtitulo}>FUCAPI — {turmaInfo.periodo}</Text>
      </View>

      <View style={styles.contentArea}>

        {/* Card do aluno */}
        <View style={styles.alunoCard}>
          <Text style={styles.alunoNome}>Bem-vindo, {aluno.nome}</Text>
          <View style={styles.alunoFaltasContainer}>
            <Text style={styles.alunoFaltas}>
              Faltas:{" "}
              <Text
                style={
                  aluno.faltas >= aluno.limiteFaltas * 0.9
                    ? styles.faltasRed
                    : styles.faltasNormal
                }
              >
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
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT, 
  },
  // --- Header ---
  header: {
    width: "100%",
    height: 140,
    backgroundColor: CLASSROOM_BLUE,
    justifyContent: "center",
    paddingTop: 40, // Espaço para barra de status
    elevation: 2,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: 'center',
  },
  // --- Área de Conteúdo ---
  contentArea: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  // --- Card Aluno ---
  alunoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2, // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderLeftWidth: 5,
    borderLeftColor: CLASSROOM_BLUE, // Borda azul para destaque
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: TEXT_DARK,
  },
  alunoFaltasContainer: {
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  alunoFaltas: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  faltasNormal: {
    color: CLASSROOM_BLUE,
    fontWeight: "bold",
  },
  faltasRed: {
    color: "red",
    fontWeight: "bold",
  },
  // --- Título de Seção ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 10,
    marginTop: 5,
    paddingLeft: 5,
  },
  // --- Lista ---
  flatListContent: {
    paddingBottom: 20,
  },
  // --- Card de Comunicado (Aviso) ---
  card: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    overflow: 'hidden', // Para a borda lateral
  },
  cardIndicator: {
    width: 6,
    backgroundColor: CLASSROOM_BLUE, // Simula a cor do ícone
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  professor: {
    fontSize: 15,
    fontWeight: "bold",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  data: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: TEXT_GRAY,
  },

  // --- Caixa da matéria ---
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