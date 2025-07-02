import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Avatar, Button, Chip, IconButton, Snackbar, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Fallback random location (e.g., Central Park, NY)
const fallbackLocation = {
  latitude: 40.785091,
  longitude: -73.968285,
};

// Mock chores with locations
const mockChores = [
  {
    id: "1",
    title: "Kitchen Deep Clean",
    latitude: 40.786091,
    longitude: -73.968285,
    type: "Cleaning",
    icon: "broom",
  },
  {
    id: "2",
    title: "Dog Walking",
    latitude: 40.784091,
    longitude: -73.969285,
    type: "Errands",
    icon: "dog",
  },
  {
    id: "3",
    title: "Grocery Shopping",
    latitude: 40.785091,
    longitude: -73.966285,
    type: "Shopping Assistant",
    icon: "cart-outline",
  },
  {
    id: "4",
    title: "Lawn Mowing",
    latitude: 40.786591,
    longitude: -73.970285,
    type: "Gardening",
    icon: "flower",
  },
];

const choreTypes = [
  "All",
  "Cleaning",
  "Errands",
  "Shopping Assistant",
  "Gardening",
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState(fallbackLocation);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [snackbar, setSnackbar] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationAllowed(true);
        let loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setSnackbar("Location permission granted. Showing your location.");
      } else {
        setLocationAllowed(false);
        setSnackbar("Location denied. Unable to show your location.");
      }
    })();
  }, []);

  const recenter = () => {
    mapRef.current?.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // Filter chores by type
  const filteredChores = selectedType === "All"
    ? mockChores
    : mockChores.filter((c) => c.type === selectedType);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.flex1} edges={["top", "left", "right"]}>
        {/* Header with back button and title */}
        <View style={styles.headerRow}>
          <IconButton icon="arrow-left" size={26} onPress={() => router.back()} style={styles.backBtn} />
          <Text style={styles.headerTitle}>Map</Text>
        </View>
        {/* Filter Chips */}
        <View style={styles.chipRowContainer}>
          {choreTypes.map(type => (
            <Chip
              key={type}
              selected={selectedType === type}
              onPress={() => setSelectedType(type)}
              style={[styles.chip, selectedType === type && styles.chipSelected]}
              textStyle={selectedType === type ? { color: '#fff', fontWeight: 'bold' } : { color: '#1976D2', fontWeight: '500' }}
              mode="outlined"
            >
              {type}
            </Chip>
          ))}
        </View>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              ...(locationAllowed === true ? userLocation : fallbackLocation),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={locationAllowed === true}
            showsMyLocationButton={false}
          >
            {/* User marker (customized) */}
            {locationAllowed === true && (
              <Marker coordinate={userLocation}>
                <Surface style={styles.userMarker} elevation={4}>
                  <Avatar.Icon size={36} icon="account" style={{ backgroundColor: "#4f8cff" }} />
                </Surface>
                <Callout>
                  <Text style={{ fontWeight: 'bold', color: '#222' }}>You are here</Text>
                </Callout>
              </Marker>
            )}
            {/* Chore markers */}
            {filteredChores.map((chore) => (
              <Marker
                key={chore.id}
                coordinate={{ latitude: chore.latitude, longitude: chore.longitude }}
                title={chore.title}
              >
                <Surface style={styles.choreMarker} elevation={4}>
                  <Avatar.Icon size={32} icon={chore.icon} style={{ backgroundColor: "#1976D2" }} />
                </Surface>
                <Callout>
                  <View style={{ minWidth: 120 }}>
                    <Text style={{ fontWeight: 'bold', color: '#222' }}>{chore.title}</Text>
                    <Text style={{ color: '#888', marginBottom: 6 }}>{chore.type}</Text>
                    <Button mode="contained" icon="navigation" compact onPress={() => {}}>
                      Get Directions
                    </Button>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* Floating speed/info badge */}
          {locationAllowed === true && (
            <Surface style={styles.speedBadge} elevation={4}>
              <Text style={styles.speedText}>You are here</Text>
            </Surface>
          )}

          {/* Floating recenter button */}
          <IconButton
            icon="crosshairs-gps"
            size={28}
            style={styles.recenterBtn}
            onPress={recenter}
          />

          {/* Bottom search bar overlay */}
          <Surface style={styles.searchBar} elevation={4}>
            <TextInput
              mode="flat"
              placeholder="Search nearby"
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
              // Uncomment the next line to add speech-to-text in the future
              // right={<TextInput.Icon icon="microphone" onPress={() => {/* speech-to-text logic */}} />}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#4f8cff"
            />
            <Button
              mode="contained"
              style={[styles.sendBtn, { backgroundColor: '#fff' }]}
              contentStyle={styles.sendBtnContent}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="arrow-right" size={22} color="#1976D2" style={{ alignSelf: 'center', margin: 0, padding: 0 }} />
              )}
              compact
            >
              {""}
            </Button>
          </Surface>
          {/* Snackbar for permission status */}
          <Snackbar
            visible={!!snackbar}
            onDismiss={() => setSnackbar("")}
            duration={3000}
            style={{ backgroundColor: locationAllowed === false ? '#D32F2F' : '#1976D2' }}
          >
            {snackbar}
          </Snackbar>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#fafbfc" },
  chipRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  chip: {
    marginRight: 8,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 16,
    height: 32,
  },
  chipSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  mapContainer: { flex: 1 },
  map: { width: width, height: height },
  userMarker: {
    borderRadius: 24,
    backgroundColor: "#fff",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  choreMarker: {
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  speedBadge: {
    position: "absolute",
    left: 20,
    bottom: 120,
    backgroundColor: "#4f8cff",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  speedText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  recenterBtn: {
    position: "absolute",
    right: 20,
    bottom: 120,
    backgroundColor: "#fff",
    borderRadius: 24,
    elevation: 4,
    zIndex: 10,
  },
  searchBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: "#fff",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    fontSize: 16,
    marginRight: 4,
  },
  sendBtn: {
    borderRadius: 20,
    marginLeft: 4,
    backgroundColor: "#4f8cff",
    minWidth: 40,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    overflow: 'hidden',
  },
  sendBtnContent: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 4,
  },
  backBtn: {
    marginRight: 4,
    backgroundColor: '#fff',
  },
}); 