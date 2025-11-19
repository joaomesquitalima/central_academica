import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Cor principal inspirada no Google Classroom
const CLASSROOM_BLUE = "#1874CD";
const TEXT_DARK = "#202124";
const TEXT_GRAY = "#5f6368";
const BG_LIGHT = "#f8f9fa"; // Cor de fundo mais clara

type Comunicado = {
  id: string;
  professor: string;
  data: string;
  materia: string;
  preview: string;
};

export default function ComunicadosScreen() {
  // const aluno = {
  //   nome: "João Vitor Mesquita",
  //   faltas: 24, // Assumindo que este é o percentual
  //   limiteFaltas: 25, // Assumindo que este é o percentual
  // }; 

  const [aluno, setAluno] = useState({
    nome: "João Vitor Mesquita",
    faltas: 0,
    limiteFaltas: 0
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

  const comunicados: Comunicado[] = [
    {
      id: "1",
      professor: "Professor Claudio",
      data: "11 de Nov - 09:40",
      materia: "Cálculo 1",
      preview: "A aula de amanhã será substituída...",
    },
    {
      id: "2",
      professor: "Professor Claudio",
      data: "10 de Nov - 15:20",
      materia: "Cálculo 1",
      preview: "Prova de recuperação disponível...",
    },
    {
      id: "3",
      professor: "Professor Claudio",
      data: "09 de Nov - 12:10",
      materia: "Cálculo 1",
      preview: "Material atualizado no portal...",
    },
  ];

  const renderItem = ({ item }: { item: Comunicado }) => (
    // Card de Comunicado
    <TouchableOpacity style={styles.card}>
      {/* Indicador de cor lateral */}
      <View style={styles.cardIndicator} />
      <View style={styles.cardContent}>
        <Text style={styles.professor}>{item.professor} - {item.materia}</Text>
        <Text style={styles.data}>{item.data}</Text>
        <Text style={styles.preview} numberOfLines={2}>{item.preview}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra superior azul (Estilo Classroom) */}
      <View style={styles.header}>
        <Text style={styles.headerText}>COMUNICADOS</Text>
      </View>

     {/* Bloco da matéria */}
<View style={styles.materiaBox}>
  <Text style={styles.materiaTitulo}>Cálculo 1</Text>
  <Text style={styles.materiaSubtitulo}>FUCAPI - 2025/1</Text>
</View>



      <View style={styles.contentArea}>
        {/* Card de Informações do Aluno (Simulando um item de aviso) */}
        <View style={styles.alunoCard}>
          <Text style={styles.alunoNome}>👋 Bem-vindo, {aluno.nome}</Text>
          <View style={styles.alunoFaltasContainer}>
            <Text style={styles.alunoFaltas}>
              Faltas: <Text style={aluno.faltas >= aluno.limiteFaltas * 0.9 ? styles.faltasRed : styles.faltasNormal}>
                {aluno.faltas}%
              </Text> de {aluno.limiteFaltas}% (Limite)
            </Text>
          </View>
        </View>

        {/* Separador de seção (Estilo título de seção no Classroom) */}
        <Text style={styles.sectionTitle}>Avisos Recentes</Text>

        {/* Lista de comunicados */}
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
    backgroundColor: BG_LIGHT, // Cor de fundo mais clara
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