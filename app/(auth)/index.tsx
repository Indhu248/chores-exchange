import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const theme = useTheme();  
  const router = useRouter();

  const {signIn, signUp } = useAuth();

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please enter all the fields");
      return;
    }
    if(password.length < 8){
      setError("Password must be at least 8 characters long");
      return;
    }
    setError(null);
    if(isSignUp) {
      const error = await signUp(email, password);
      if(error){
        setError(error);
        return;
      }
      router.replace("/(tabs)");
    } else {
      const error = await signIn(email, password);
      if(error){
        setError(error);
        return;
      }
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome"}
        </Text>
        <TextInput
          style={styles.input}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          label="password"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="password"
          mode="outlined"
          secureTextEntry
          onChangeText={setPassword}
        />
        {error && <Text>{error}</Text>}
        <Button style={styles.button} mode="contained" onPress={handleAuth} >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button style={styles.switchModeButton} mode="text" onPress={handleSwitchMode}>
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
}); 