import { Tabs } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [unreadComunicados, setUnreadComunicados] = useState(3);
  const [unreadProfessor, setUnreadProfessor] = useState(0);

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
