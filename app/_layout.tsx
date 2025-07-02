import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
// import React from 'react'; // This comment indicates you might have temporarily removed it

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const isAuthGroup = segments[0] === "(auth)";
    console.log({ user, isLoading, isAuthGroup, segments });
    if (isLoading) return;
    if (!user && !isAuthGroup) {
      router.replace("/(auth)");
    }
    if (user && isAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [segments, router, user, isLoading]);

  if (isLoading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}