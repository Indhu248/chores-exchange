import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite"; // Ensure this path is correct

// Define the type for the authentication context's value
type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean; // <--- Correctly added isLoading here
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>; // <--- Added signOut for completeness
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage authentication state and provide it
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <--- Initialized isLoading as true

  // Function to fetch the current user
  const getUser = async () => {
    try {
      const currentUser = await account.get(); // Get the currently logged-in user
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null); // No user logged in or session expired
      return null;
    }
  };

  // Effect to check for an active session on initial component mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true); // Start loading before checking
      await getUser();    // Attempt to fetch user
      setIsLoading(false); // Stop loading after check is complete
    };
    checkSession();
  }, []); // Run only once on mount

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      const signInError = await signIn(email, password); // Attempt to sign in after account creation
      if (signInError) {
        return signInError; // Propagate sign-in error if it occurs
      }
      // getUser() is called inside signIn, so no need to call it again here.
      return null; // Success
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred while signing up";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await getUser(); // <--- CRUCIAL: Update user state after successful sign-in
      return null; // Success
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred while signing in";
    }
  };

  // Added signOut function
  const signOut = async () => {
    try {
      await account.deleteSession("current"); // Delete the current session
      setUser(null); // Clear the user state
      return null; // Success
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred while signing out";
    }
  };

  // The value provided to consumers of this context
  const contextValue = {
    user,
    isLoading, // <--- Correctly provided isLoading in the context value
    signUp,
    signIn,
    signOut, // <--- Provided signOut in the context value
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}