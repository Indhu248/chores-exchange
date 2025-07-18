import { Account, Client, Databases } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform("com.indhu.habit-tracking-app");

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID!;
export const PROFILES_COLLECTION_ID = process.env.EXPO_PUBLIC_PROFILES_COLLECTION_ID!;
