import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const mockExchanges = [
  {
    id: "1",
    title: "Grocery Pickup",
    user: "Alex",
    status: "Pending",
    avatar: "A",
    type: "Delivery",
    time: "Today, 5pm",
  },
  {
    id: "2",
    title: "Dog Walking",
    user: "Sam",
    status: "Accepted",
    avatar: "S",
    type: "Errands",
    time: "Tomorrow, 10am",
  },
];

export default function ExchangesScreen() {
  const [exchanges, setExchanges] = useState(mockExchanges);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.header}>Chore Exchanges</Text>
      {exchanges.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No exchanges yet. Start by accepting or offering help on a chore!</Text>
        </View>
      ) : (
        <FlatList
          data={exchanges}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.row}>
                <Avatar.Text size={36} label={item.avatar} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>With: {item.user} • {item.time}</Text>
                  <Chip style={item.status === "Pending" ? styles.pending : styles.accepted}>
                    {item.status}
                  </Chip>
                </View>
              </View>
              <View style={styles.actions}>
                <Button mode="outlined" style={styles.actionBtn} onPress={() => Alert.alert('View Details', `Viewing details for ${item.title}`)}>View Details</Button>
                {item.status === "Pending" && (
                  <>
                    <Button mode="contained" style={styles.actionBtn} onPress={() => Alert.alert('Accepted', `You accepted ${item.title}`)}>Accept</Button>
                    <Button mode="text" style={styles.actionBtn} onPress={() => Alert.alert('Declined', `You declined ${item.title}`)}>Decline</Button>
                  </>
                )}
              </View>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#222" },
  card: { marginBottom: 16, borderRadius: 16, padding: 12, backgroundColor: "#fff" },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: "#4f8cff" },
  title: { fontWeight: "bold", fontSize: 16, color: "#222" },
  subtitle: { color: "#888", fontSize: 13, marginBottom: 4 },
  pending: { backgroundColor: "#ffe082", color: "#b26a00", marginTop: 4 },
  accepted: { backgroundColor: "#b9f6ca", color: "#00695c", marginTop: 4 },
  actions: { flexDirection: "row", marginTop: 8, justifyContent: "flex-end" },
  actionBtn: { marginLeft: 8 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16, textAlign: "center" },
}); 