import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Avatar, Chip, Icon, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const mockStats = [
  { label: "Completed", value: 12, icon: "check-circle-outline" },
  { label: "Pending", value: 5, icon: "clock-outline" },
  { label: "Points", value: 340, icon: "star-outline" },
];

const initialChores = [
  {
    id: "1",
    title: "Kitchen Deep Clean",
    distance: 2.5,
    postedBy: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "Cleaning",
    description: "Need help with deep cleaning my kitchen. Will provide all supplies.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    title: "Dog Walking",
    distance: 1.2,
    postedBy: "Sarah Lee",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "Errands",
    description: "Looking for someone to walk my dog in the evening.",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    title: "Grocery Shopping",
    distance: 3.1,
    postedBy: "Carlos Rivera",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    type: "Shopping Assistant",
    description: "Need someone to pick up groceries from the local store.",
    image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    title: "Lawn Mowing",
    distance: 0.8,
    postedBy: "Emily Chen",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    type: "Gardening",
    description: "Looking for help mowing my lawn this weekend.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "5",
    title: "Math Tutoring Needed",
    distance: 4.2,
    postedBy: "Priya Patel",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    type: "Tutoring",
    description: "Looking for a math tutor for my high school son. Flexible timings.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "6",
    title: "Tech Help: Printer Setup",
    distance: 2.0,
    postedBy: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    type: "Tech Help",
    description: "Need help setting up a new printer at home. Should be quick!",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "7",
    title: "Child Care for Evening",
    distance: 3.7,
    postedBy: "Anna Müller",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    type: "Child Care",
    description: "Looking for someone to watch my 3-year-old for a few hours.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "8",
    title: "Cook Dinner for Family",
    distance: 1.9,
    postedBy: "Mohammed Ali",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    type: "Cooking",
    description: "Need a home-cooked meal for 5. Ingredients provided.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "9",
    title: "Laundry Pickup & Drop",
    distance: 2.8,
    postedBy: "Linda Brown",
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
    type: "Laundry",
    description: "Pick up laundry and drop it off at the cleaners. Will pay extra for quick service.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "10",
    title: "Car Wash Needed",
    distance: 0.5,
    postedBy: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/53.jpg",
    type: "Car Wash",
    description: "Looking for someone to wash my car this weekend. All supplies provided.",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80",
  },
];

const choreTypes = [
  { label: "All", icon: "check-all", color: "#e0e0e0" },
  { label: "Cleaning", icon: "broom", color: "#e3f2fd" },
  { label: "Delivery", icon: "truck-delivery-outline", color: "#fff3e0" },
  { label: "Errands", icon: "run", color: "#f3e5f5" },
  { label: "Pet Care", icon: "dog", color: "#ffe0b2" },
  { label: "Gardening", icon: "flower", color: "#e8f5e9" },
  { label: "Tutoring", icon: "school-outline", color: "#ede7f6" },
  { label: "Tech Help", icon: "laptop", color: "#e1f5fe" },
  { label: "Child Care", icon: "baby-face-outline", color: "#fff8e1" },
  { label: "Cooking", icon: "chef-hat", color: "#fbe9e7" },
  { label: "Laundry", icon: "tshirt-crew-outline", color: "#f3e5f5" },
  { label: "Event Help", icon: "calendar-star", color: "#f9fbe7" },
  { label: "Elderly Support", icon: "human-cane", color: "#fce4ec" },
  { label: "Car Wash", icon: "car-wash", color: "#e1f5fe" },
  { label: "Moving Help", icon: "truck-fast-outline", color: "#f1f8e9" },
  { label: "Shopping Assistant", icon: "cart-outline", color: "#fffde7" },
  { label: "Repair Services", icon: "tools", color: "#f3e5f5" },
  { label: "Fitness Buddy", icon: "dumbbell", color: "#e0f2f1" },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("All");
  const [snackbar, setSnackbar] = useState("");
  const [chores, setChores] = useState(initialChores);
  const theme = useTheme();
  const router = useRouter();

  // Greeting
  const greeting = "Good Morning";
  const userName = user?.name || user?.email || "User";

  return (
    <SafeAreaView style={styles.flex1}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Avatar.Image
          size={44}
          source={{ uri: "https://img.icons8.com/ios-filled/50/000000/user-male-circle.png" }}
          style={styles.headerAvatar}
          onTouchEnd={() => router.push("/(tabs)/profile")}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.greeting} onPress={() => router.push("/(tabs)/profile")}>{greeting}</Text>
          <Text style={styles.userName} onPress={() => router.push("/(tabs)/profile")}>{userName}</Text>
        </View>
        <IconButton icon="bell-outline" size={26} style={styles.headerIcon} onPress={() => router.push("/(tabs)/notifications")}/>
      </View>

      {/* Stats Row */}
      {/**
      <View style={styles.statsRow}>
        {mockStats.map((stat) => (
          <Surface key={stat.label} style={styles.statCard} elevation={2}>
            <IconButton icon={stat.icon} size={22} style={styles.statIcon} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Surface>
        ))}
      </View>
      */}

      {/* Filter Chips */}
      <View style={styles.chipRowContainer}>
        <FlatList
          data={choreTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item: type }) => (
            <Chip
              key={type.label}
              icon={({ size }) => (
                <Icon source={type.icon} size={size} color={selectedType === type.label ? '#fff' : '#6A1ED4'} />
              )}
              selected={selectedType === type.label}
              onPress={() => setSelectedType(type.label)}
              style={[styles.chip, selectedType === type.label && { backgroundColor: '#6A1ED4', borderColor: '#6A1ED4' }]}
              textStyle={selectedType === type.label ? { color: '#fff', fontWeight: 'bold' } : { color: '#6A1ED4', fontWeight: '500' }}
              mode="outlined"
            >
              {type.label}
            </Chip>
          )}
        />
      </View>

      {/* Chore Feed */}
      <FlatList
        data={chores.filter((c) => selectedType === "All" || c.type === selectedType)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.choresList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // Find color for this chore type
          const typeObj = choreTypes.find((t) => t.label === item.type) || choreTypes[0];
          // Convert hex to rgba with 0.5 opacity if hex, else fallback
          function hexToRgba(hex: string, alpha: number) {
            let c = hex.replace('#', '');
            if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            const num = parseInt(c, 16);
            return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${alpha})`;
          }
          const cardBg = typeObj.color && typeObj.color.startsWith('#') ? hexToRgba(typeObj.color, 0.5) : typeObj.color || '#fff';
          return (
            <View style={styles.choreBlock}>
              <View style={styles.choreCardModern}>
                {/* Top: Person details and actions */}
                <View style={styles.choreCardTopRowModern}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Avatar.Image size={44} source={{ uri: item.avatar }} style={styles.choreAvatarModern} />
                    <View style={styles.choreCardHeaderContentModern}>
                      <Text style={styles.chorePosterModern}>{item.postedBy}</Text>
                      <Text style={styles.choreMetaModern}> <Text style={{ fontSize: 13 }}>📍</Text> {item.distance} km away </Text>
                    </View>
                  </View>
                  <IconButton
                    icon="dots-vertical"
                    size={22}
                    onPress={() => {}}
                    style={{ margin: 0, padding: 0, alignSelf: 'flex-start' }}
                  />
                </View>
                {/* Image */}
                <View style={styles.choreImageWrapper}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.choreImageModern}
                    resizeMode="cover"
                  />
                </View>
                {/* Bottom: Title, Description, Chip */}
                <View style={styles.choreCardContentModern}>
                  <View style={styles.choreTitleChipRow}>
                    <Text style={styles.choreTitleModern} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                    <Chip
                      icon="broom"
                      style={[styles.choreTypeChipModern, { backgroundColor: typeObj.color, borderColor: typeObj.color, marginLeft: 10 }]}
                      textStyle={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}
                      ellipsizeMode="tail"
                    >
                      {item.type}
                    </Chip>
                  </View>
                  <Text style={styles.choreDescModern} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                  <View style={styles.choreActionsIconRowModernBottom}>
                    <View style={[styles.actionIconPill, { backgroundColor: 'rgba(25,118,210,0.12)' }]}> 
                      <IconButton
                        icon="check-circle-outline"
                        size={26}
                        iconColor="#1976D2"
                        style={styles.actionIconBtn}
                        onPress={() => setSnackbar("Accepted!")}
                      />
                    </View>
                    <View style={[styles.actionIconPill, { backgroundColor: 'rgba(255,160,0,0.12)' }]}> 
                      <IconButton
                        icon="swap-horizontal"
                        size={26}
                        iconColor="#FFA000"
                        style={styles.actionIconBtn}
                        onPress={() => setSnackbar("Exchange offered!")}
                      />
                    </View>
                    <View style={[styles.actionIconPill, { backgroundColor: 'rgba(211,47,47,0.12)' }]}> 
                      <IconButton
                        icon="close-circle-outline"
                        size={26}
                        iconColor="#D32F2F"
                        style={styles.actionIconBtn}
                        onPress={() => setChores(prev => prev.filter(c => c.id !== item.id))}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#fafbfc" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerAvatar: { backgroundColor: "#eaeaea" },
  greeting: { color: "#222", fontWeight: "bold", fontSize: 16 },
  userName: { color: "#888", fontSize: 13, marginTop: 2 },
  headerIcon: { backgroundColor: "#fff" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 4,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statIcon: { backgroundColor: "#f5f6fa", marginBottom: 2 },
  statValue: { fontWeight: "bold", fontSize: 18, color: "#222" },
  statLabel: { color: "#888", fontSize: 13 },
  chipRowContainer: {
    marginHorizontal: 0,
    marginVertical: 10,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
  },
  chip: {
    marginRight: 8,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 16,
    height: 32,
  },
  choresList: {
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  choreBlock: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  choreCardModern: {
    backgroundColor: '#fff',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#ececec',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    marginBottom: 0,
    overflow: 'hidden',
  },
  choreCardTopRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  choreAvatarModern: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  choreCardHeaderContentModern: {
    flex: 1,
    justifyContent: 'center',
  },
  chorePosterModern: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 0,
  },
  choreMetaModern: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  choreCardContentModern: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: 'transparent',
  },
  choreTitleModern: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  choreDescModern: {
    color: '#555',
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 20,
  },
  choreTypeChipModern: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 0,
  },
  choreTitleChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  actionIconPill: {
    borderRadius: 50,
    padding: 2,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBtn: {
    margin: 0,
    padding: 0,
  },
  choreImageWrapper: {
    width: '100%',
    height: 210,
    backgroundColor: '#eee',
  },
  choreImageModern: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  choreActionsIconRowModernBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
});
