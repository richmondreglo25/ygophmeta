# Firebase Migration Plan for YGOPhMeta

## Current Tech Stack Analysis

### Data Architecture

- **Static JSON files** stored in `public/data/` directory
  - Events: `public/data/events/*.json` (monthly files: 2025-01.json through 2026-02.json)
  - Players: `public/data/players.json`
  - Judges: `public/data/judges.json`
  - Shops: `public/data/shops.json`
  - Banlist: `public/data/banlist.json`
  - Featured: `public/data/featured.json`
  - Decks: `public/data/decks.json`
  - Home: `public/data/home.json`
  - About: `public/data/about.json`

### Current Data Fetching

- Custom hook `useJsonData<T>()` in `src/app/data/api.ts`
- `useEventsByYearMonthRange()` for time-based event queries
- Client-side data loading with loading states
- No authentication or user management

### Static Site Generation

- **Eleventy (11ty)** for static event pages
  - Config: `.eleventy.js`
  - Build: `npm run 11ty:build`
  - Deploy: GitHub Pages via `.github/workflows/eleventy-deploy.yml`
  - Templates: `_site/events.njk`, `_site/index.njk`

### Frontend Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **React 19** with hooks
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Recharts/Chart.js** for data visualization
- **Vaul** for drawers (profile, event forms)

### Key Features Currently

1. **Events Management**
   - Browse events with date range filtering
   - Event detail pages (static via Eleventy)
   - Upload deck images
   - Add event forms

2. **Community Features**
   - Player profiles with stats
   - Judge listings
   - Shop directory
   - Profile image uploads (currently client-side only)

3. **Meta Analysis**
   - Deck distribution charts
   - Top players rankings
   - Champion deck statistics

4. **User Interactions**
   - Profile drawers
   - Data tables with search/filter
   - Form submissions (currently no backend)

---

## Firebase Migration Strategy

### Phase 1: Project Setup & Authentication (Week 1)

#### 1.1 Firebase Project Initialization

```bash
# Install Firebase dependencies
npm install firebase firebase-admin
npm install --save-dev @firebase/app-types
```

#### 1.2 Firebase Configuration

Create `src/lib/firebase/config.ts`:

```typescript
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export { app };
```

#### 1.3 Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 1.4 Authentication Context

Create `src/contexts/AuthContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithFacebook, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### 1.5 Update Root Layout

Modify `src/app/layout.tsx`:

```tsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${varelaRound.variable} ${geistSans.variable} ${geistMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <div className="flex flex-col h-full min-h-screen">
              <Navigation />
              <Content>{children}</Content>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 1.6 Authentication UI Component

Create `src/components/auth-button.tsx`:

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />;
  }

  if (!user) {
    return (
      <Button
        onClick={signInWithGoogle}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <LogIn size={14} />
        <span className="hidden sm:inline">Sign In</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.photoURL || ""}
              alt={user.displayName || "User"}
            />
            <AvatarFallback>
              <User size={16} />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.displayName}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} className="text-red-600">
          <LogOut size={14} className="mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### Phase 2: Firestore Data Migration (Week 2-3)

#### 2.1 Firestore Collections Structure

```
/events/{eventId}
  - id: string
  - title: string
  - host: string
  - when: string
  - where: string
  - format: "OCG" | "AE" | "TCG"
  - official: boolean
  - rounds: number
  - images: string[]
  - winners: Array<{name, position, deck, deckImagePath}>
  - decks: Array<{name, count}>
  - notes: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - createdBy: string (user.uid)

/players/{playerId}
  - name: string
  - ign: string
  - imagePath: string
  - gender: "MALE" | "FEMALE"
  - city: string
  - team: string
  - deck: string[]
  - others: string
  - userId: string (optional, link to auth user)

/judges/{judgeId}
  - name: string
  - level: number
  - imagePath: string
  - gender: "MALE" | "FEMALE"
  - city: string

/shops/{shopId}
  - name: string
  - location: string
  - contact: string
  - description: string[]
  - imagePath: string
  - createdAt: timestamp
  - createdBy: string

/banlist/{format}
  - format: "ocg" | "ae" | "tcg"
  - lists: Array<{title, cards: Array<{name, type}>}>
  - lastUpdated: timestamp

/decks/{deckName}
  - name: string
  - imagePath: string
```

#### 2.2 Migration Script

Create `scripts/migrate-to-firestore.ts`:

```typescript
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateEvents() {
  const eventsDir = path.join(__dirname, "../public/data/events");
  const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(eventsDir, file);
    const events = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const event of events) {
      await db
        .collection("events")
        .doc(event.id)
        .set({
          ...event,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      console.log(`Migrated event: ${event.title}`);
    }
  }
}

async function migratePlayers() {
  const filePath = path.join(__dirname, "../public/data/players.json");
  const players = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const player of players) {
    const docId = player.name.toLowerCase().replace(/\s+/g, "-");
    await db.collection("players").doc(docId).set(player);
    console.log(`Migrated player: ${player.name}`);
  }
}

async function migrateShops() {
  const filePath = path.join(__dirname, "../public/data/shops.json");
  const shops = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const shop of shops) {
    const docId = shop.name.toLowerCase().replace(/\s+/g, "-");
    await db
      .collection("shops")
      .doc(docId)
      .set({
        ...shop,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    console.log(`Migrated shop: ${shop.name}`);
  }
}

async function migrate() {
  try {
    console.log("Starting migration...");
    await migrateEvents();
    await migratePlayers();
    await migrateShops();
    console.log("Migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrate();
```

Add to `package.json`:

```json
"scripts": {
  "migrate:firestore": "ts-node scripts/migrate-to-firestore.ts"
}
```

#### 2.3 Firestore Service Layer

Create `src/lib/firebase/firestore.ts`:

```typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Event } from "@/types/event";
import { Player } from "@/types/player";
import { Shop } from "@/types/shop";

// Events
export const getEvents = async (yearMonthRange?: {
  start: { year: number; month: number };
  end: { year: number; month: number };
}) => {
  const eventsRef = collection(db, "events");
  let q = query(eventsRef, orderBy("when", "desc"));

  const snapshot = await getDocs(q);
  const events = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];

  // Client-side filtering by date range if needed
  if (yearMonthRange) {
    return events.filter((event) => {
      const eventDate = new Date(event.when);
      const startDate = new Date(
        yearMonthRange.start.year,
        yearMonthRange.start.month - 1,
      );
      const endDate = new Date(
        yearMonthRange.end.year,
        yearMonthRange.end.month,
      );
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  return events;
};

export const getEventById = async (id: string): Promise<Event | null> => {
  const docRef = doc(db, "events", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Event)
    : null;
};

export const createEvent = async (event: Omit<Event, "id">, userId: string) => {
  const eventsRef = collection(db, "events");
  const docRef = await addDoc(eventsRef, {
    ...event,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: userId,
  });
  return docRef.id;
};

// Players
export const getPlayers = async (): Promise<Player[]> => {
  const playersRef = collection(db, "players");
  const snapshot = await getDocs(query(playersRef, orderBy("name")));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Player[];
};

export const getPlayerByName = async (name: string): Promise<Player | null> => {
  const playersRef = collection(db, "players");
  const q = query(playersRef, where("name", "==", name), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty
    ? null
    : ({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Player);
};

// Shops
export const getShops = async (): Promise<Shop[]> => {
  const shopsRef = collection(db, "shops");
  const snapshot = await getDocs(query(shopsRef, orderBy("name")));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Shop[];
};

export const createShop = async (shop: Omit<Shop, "id">, userId: string) => {
  const shopsRef = collection(db, "shops");
  const docRef = await addDoc(shopsRef, {
    ...shop,
    createdAt: Timestamp.now(),
    createdBy: userId,
  });
  return docRef.id;
};
```

#### 2.4 Update Data Fetching Hooks

Modify `src/app/data/api.ts`:

```typescript
import { useState, useEffect } from "react";
import { getEvents, getPlayers, getShops } from "@/lib/firebase/firestore";

export function useFirestoreData<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}

export function useEventsByYearMonthRange(
  start: { year: number; month: number },
  end: { year: number; month: number },
) {
  return useFirestoreData(
    () => getEvents({ start, end }),
    [start.year, start.month, end.year, end.month],
  );
}

export function usePlayers() {
  return useFirestoreData(getPlayers);
}

export function useShops() {
  return useFirestoreData(getShops);
}

// Keep legacy JSON hook for backward compatibility during transition
export function useJsonData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [path]);

  return { data, loading };
}
```

---

### Phase 3: Firebase Storage Integration (Week 4)

#### 3.1 Storage Service Layer

Create `src/lib/firebase/storage.ts`:

```typescript
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { storage } from "./config";

export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const storageRef = ref(storage, path);

  // Upload file
  const snapshot = await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export async function deleteImage(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Specific upload functions
export async function uploadProfileImage(
  file: File,
  userId: string,
): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const path = `profiles/${userId}/${fileName}`;
  return uploadImage(file, path);
}

export async function uploadDeckImage(
  file: File,
  eventId: string,
  position: number,
): Promise<string> {
  const fileName = `${position}.webp`;
  const path = `decks/${eventId}/${fileName}`;
  return uploadImage(file, path);
}

export async function uploadEventImage(
  file: File,
  eventId: string,
): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const path = `events/${eventId}/${fileName}`;
  return uploadImage(file, path);
}

export async function uploadShopLogo(
  file: File,
  shopId: string,
): Promise<string> {
  const fileName = `logo.webp`;
  const path = `shops/${shopId}/${fileName}`;
  return uploadImage(file, path);
}
```

#### 3.2 Update Upload Components

Modify `src/components/upload-profile-image-drawer.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadProfileImage } from "@/lib/firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "./ui/button";
import { Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function UploadProfileImageDrawer({
  onClose,
  playerId,
}: {
  onClose: () => void;
  playerId: string;
}) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setError("Please select a file and sign in");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload to Firebase Storage
      const downloadURL = await uploadProfileImage(file, user.uid);

      // Update Firestore document
      const playerRef = doc(db, "players", playerId);
      await updateDoc(playerRef, {
        imagePath: downloadURL,
        updatedAt: new Date(),
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
```

---

### Phase 4: Security & Deployment (Week 5)

#### 4.1 Firestore Security Rules

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Events - authenticated users can create, only owner can update/delete
    match /events/{eventId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && isOwner(resource.data.createdBy);
    }

    // Players - read by all, write by authenticated users
    match /players/{playerId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        isOwner(resource.data.userId) ||
        !resource.data.keys().hasAny(['userId'])
      );
      allow delete: if isSignedIn() && isOwner(resource.data.userId);
    }

    // Judges - read by all, write restricted
    match /judges/{judgeId} {
      allow read: if true;
      allow write: if false; // Admin only (handle via Cloud Functions)
    }

    // Shops - authenticated users can create, only owner can update/delete
    match /shops/{shopId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && isOwner(resource.data.createdBy);
    }

    // Banlist - read only
    match /banlist/{format} {
      allow read: if true;
      allow write: if false; // Admin only
    }

    // Decks - read only
    match /decks/{deckId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

#### 4.2 Storage Security Rules

Create `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isImageFile() {
      return request.resource.contentType.matches('image/.*');
    }

    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB
    }

    // Profile images
    match /profiles/{userId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() &&
                     request.auth.uid == userId &&
                     isImageFile() &&
                     isValidSize();
    }

    // Deck images
    match /decks/{eventId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() &&
                     isImageFile() &&
                     isValidSize();
    }

    // Event images
    match /events/{eventId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() &&
                     isImageFile() &&
                     isValidSize();
    }

    // Shop logos
    match /shops/{shopId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() &&
                     isImageFile() &&
                     isValidSize();
    }
  }
}
```

#### 4.3 Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting (optional)

# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

---

### Phase 5: Hybrid Approach - Keep Eleventy (Week 6)

#### 5.1 Strategy

- **Keep Eleventy for SEO**: Static event pages remain for SEO benefits
- **Firestore for Live Data**: Real-time updates via Firestore
- **Build Process**: Nightly build from Firestore → JSON → Eleventy

#### 5.2 Firestore to JSON Export Script

Create `scripts/export-firestore-to-json.ts`:

```typescript
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportEvents() {
  const eventsSnapshot = await db.collection("events").get();
  const eventsByMonth: Record<string, any[]> = {};

  eventsSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const date = new Date(data.when);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!eventsByMonth[key]) {
      eventsByMonth[key] = [];
    }

    eventsByMonth[key].push({ id: doc.id, ...data });
  });

  // Write to monthly JSON files
  const outputDir = path.join(__dirname, "../public/data/events");
  for (const [month, events] of Object.entries(eventsByMonth)) {
    const filePath = path.join(outputDir, `${month}.json`);
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
    console.log(`Exported ${events.length} events to ${month}.json`);
  }
}

async function exportPlayers() {
  const snapshot = await db.collection("players").get();
  const players = snapshot.docs.map((doc) => doc.data());

  const filePath = path.join(__dirname, "../public/data/players.json");
  fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
  console.log(`Exported ${players.length} players`);
}

async function exportAll() {
  await exportEvents();
  await exportPlayers();
  // Add other exports as needed
}

exportAll();
```

#### 5.3 GitHub Actions Workflow

Create `.github/workflows/firebase-export-deploy.yml`:

```yaml
name: Export Firestore and Deploy Eleventy

on:
  schedule:
    - cron: "0 0 * * *" # Daily at midnight
  workflow_dispatch: # Manual trigger

jobs:
  export-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Export Firestore to JSON
        env:
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        run: |
          echo "$FIREBASE_SERVICE_ACCOUNT" > scripts/serviceAccountKey.json
          npm run export:firestore

      - name: Build with Eleventy
        run: npm run 11ty:build

      - name: Create .nojekyll file
        run: touch ./_output/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_output

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

Add to `package.json`:

```json
"scripts": {
  "export:firestore": "ts-node scripts/export-firestore-to-json.ts"
}
```

---

## Migration Checklist

### Pre-Migration

- [ ] Create Firebase project
- [ ] Enable Authentication (Google, Facebook)
- [ ] Enable Firestore
- [ ] Enable Storage
- [ ] Set up billing (if needed)
- [ ] Download service account key

### Phase 1: Authentication

- [ ] Install Firebase SDK
- [ ] Configure Firebase in Next.js
- [ ] Create AuthContext and provider
- [ ] Add authentication UI (AuthButton)
- [ ] Update Navigation component
- [ ] Test sign in/sign out flows

### Phase 2: Firestore

- [ ] Design Firestore schema
- [ ] Create migration scripts
- [ ] Run migration for events
- [ ] Run migration for players
- [ ] Run migration for shops
- [ ] Create Firestore service layer
- [ ] Update data fetching hooks
- [ ] Test data queries in UI

### Phase 3: Storage

- [ ] Create storage service layer
- [ ] Update upload components
- [ ] Test profile image uploads
- [ ] Test deck image uploads
- [ ] Test event image uploads

### Phase 4: Security

- [ ] Write Firestore security rules
- [ ] Write Storage security rules
- [ ] Deploy rules
- [ ] Test permissions
- [ ] Audit security

### Phase 5: Hybrid Deployment

- [ ] Create Firestore → JSON export script
- [ ] Update GitHub Actions workflow
- [ ] Test automated export
- [ ] Verify Eleventy builds correctly
- [ ] Test deployment

### Post-Migration

- [ ] Monitor Firebase usage
- [ ] Set up error logging (Sentry/Firebase Crashlytics)
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Documentation updates

---

## Rollback Plan

If migration fails, we can rollback:

1. **Keep JSON files**: All existing JSON files remain untouched
2. **Feature flags**: Use environment variable to toggle Firebase/JSON
3. **Gradual migration**: Migrate one collection at a time
4. **Backup**: Export Firestore data regularly to JSON

---

## Cost Estimation (Free Tier Limits)

### Firestore

- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day
- **Storage**: 1 GB

### Storage

- **Storage**: 5 GB
- **Downloads**: 1 GB/day
- **Uploads**: 20 MB/day

### Authentication

- **Users**: Unlimited
- **Phone auth**: 10,000 verifications/month

**Estimated usage**: Well within free tier for current traffic.

---

## Timeline

| Week | Phase          | Tasks                            |
| ---- | -------------- | -------------------------------- |
| 1    | Authentication | Setup, Auth UI, Testing          |
| 2-3  | Firestore      | Schema, Migration, Service Layer |
| 4    | Storage        | Upload implementation, Testing   |
| 5    | Security       | Rules, Deployment                |
| 6    | Hybrid         | Export scripts, CI/CD            |

**Total**: 6 weeks for full migration

---

## Next Steps

1. **Review this plan** with the team
2. **Create Firebase project** and enable services
3. **Start with Phase 1** (Authentication) on a feature branch
4. **Test thoroughly** before merging
5. **Iterate** based on feedback

---

## Questions to Resolve

1. Should we keep static JSON as backup?
2. Do we need role-based access (admin, moderator, user)?
3. Should we add email verification?
4. Do we need real-time listeners or polling?
5. Should we implement pagination for large datasets?
