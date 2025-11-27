import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Estrutura de comunicado
type Comunicado = {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  professorEmail: string;
};

/**
 * Função que busca a quantidade de comunicados no backend
 */
async function getQuantidadeComunicados(): Promise<number> {
  try {
    const response = await fetch("http://192.168.15.2:5000/comunicados/aluno");
    const data: Comunicado[] = await response.json();
    return data.length;
  } catch (err) {
    console.error("Erro ao buscar comunicados:", err);
    return 0;
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [unreadComunicados, setUnreadComunicados] = useState(0);
  const [unreadProfessor, setUnreadProfessor] = useState(0);

  // Busca a quantidade de comunicados quando o componente monta
  useEffect(() => {
    async function fetchQuantidade() {
      const quantidade = await getQuantidadeComunicados();
      setUnreadComunicados(quantidade);
    }
    fetchQuantidade();
  }, []);

  return (
    <Tabs
      initialRouteName="comunicados"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="comunicados"
        options={{
          title: "Comunicados",
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={28} name="megaphone.fill" color={color} />
              {unreadComunicados > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadComunicados}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="professor"
        options={{
          title: "CMD",
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={28} name="phone.and.waveform" color={color} />
              {unreadProfessor > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadProfessor}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
