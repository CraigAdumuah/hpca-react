// Screens/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface DashboardProps {
  user?: { name: string };
}

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.avatar}
        />
        <Text style={styles.heading}>
          {getTimeGreeting()} {user ? user.name : "Guest"}
        </Text>
        <Text style={styles.time}>Current Time: {currentTime}</Text>
        <Text style={styles.description}>
          This is your healthcare dashboard where you can view your health records.
        </Text>
      </View>

      {/* Wearable Integration (Later connect real component here) */}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  time: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
  },
});
