import {
  ID,
  Models,
  Permission,
  Query,
  Role,
} from "react-native-appwrite";
import {
  DATABASE_ID,
  databases,
  PROFILES_COLLECTION_ID,
} from "./appwrite";

// ✅ Define schema-approved fields
const allowedProfileFields = ["name", "bio"];

/**
 * Filters the input to only include allowed fields.
 */
function sanitizeData(data: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) =>
      allowedProfileFields.includes(key)
    )
  );
}

/**
 * 🔍 Fetch a user profile by their userId.
 */
export async function fetchUserProfile(userId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
    return response.documents[0] as Models.Document | undefined;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    return undefined;
  }
}

/**
 * 🆕 Create a new user profile with permissions.
 */
export async function createUserProfile(
  userId: string,
  data: Record<string, any>
) {
  try {
    const cleanData = {
      userId,
      ...sanitizeData(data),
    };

    const permissions = [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ];

    const doc = await databases.createDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      ID.unique(),
      cleanData,
      permissions
    );

    return doc;
  } catch (error) {
    console.error("❌ Error creating user profile:", error);
    throw error;
  }
}

/**
 * ✏️ Update an existing user profile.
 */
export async function updateUserProfile(
  documentId: string,
  data: Record<string, any>
) {
  try {
    const cleanData = sanitizeData(data);
    const doc = await databases.updateDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      documentId,
      cleanData
    );
    return doc;
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
}

/**
 * 💾 Save user profile — create if no doc exists, update if it does.
 */
export async function saveUserProfile(
  userId: string,
  data: Record<string, any>,
  documentId?: string
) {
  if (documentId) {
    return updateUserProfile(documentId, data);
  } else {
    return createUserProfile(userId, data);
  }
}
