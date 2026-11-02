import {
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "./firebase";


/*
 * Get the current Firebase player.
 *
 * If the player already exists on this device,
 * Firebase will restore their authentication session.
 *
 * If there is no player yet, we create an anonymous
 * Firebase account.
 */
export async function getOrCreatePlayer() {

  let user = auth.currentUser;

  if (!user) {
    const result = await signInAnonymously(auth);
    user = result.user;
  }

  return user;
}

export function isCurrentPlayerAccountLinked() {
  return Boolean(auth.currentUser && !auth.currentUser.isAnonymous);
}

export async function linkCurrentPlayerAccount(email, password) {
  const user = await getOrCreatePlayer();

  if (!user.isAnonymous) {
    throw new Error("This player account already has sign-in details.");
  }

  const credential = EmailAuthProvider.credential(email.trim(), password);
  const result = await linkWithCredential(user, credential);
  return result.user;
}

export async function signInPlayer(email, password) {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return result.user;
}

export async function signOutPlayer() {
  await signOut(auth);
}


/*
 * Check whether the current player has already
 * completed character creation.
 */
export async function getPlayerProfile() {

  const user = await getOrCreatePlayer();

  const playerRef = doc(
    db,
    "players",
    user.uid
  );

  const playerSnapshot = await getDoc(playerRef);

  if (!playerSnapshot.exists()) {
    return null;
  }

  return {
    id: user.uid,
    ...playerSnapshot.data()
  };
}


/*
 * Save the player's character/profile.
 */
export async function savePlayerProfile(profile, credentials) {

  let user = await getOrCreatePlayer();

  if (credentials) {
    if (user.isAnonymous) {
      user = await linkCurrentPlayerAccount(credentials.email, credentials.password);
    } else if (user.email?.toLowerCase() !== credentials.email.trim().toLowerCase()) {
      throw new Error("The current player is linked to a different email address.");
    }
  }

  const playerRef = doc(
    db,
    "players",
    user.uid
  );

  const playerData = {
    ...profile,

    id: user.uid,

    createdAt: new Date().toISOString(),

    points: 0,

    stars: 0,

    currentLevel: 1,

    completedLevels: [],

    passport: [],

    welcomeJourneyRead: false,

    journeyStarted: true,

    needs: { life: 100, hunger: 86, water: 92 },

    money: 250,

    inventory: []
  };

  await setDoc(
    playerRef,
    playerData,
    {
      merge: true
    }
  );

  return playerData;
}

export async function markWelcomeJourneyRead() {
  const user = await getOrCreatePlayer();
  const playerRef = doc(db, "players", user.uid);

  await setDoc(
    playerRef,
    { welcomeJourneyRead: true },
    { merge: true }
  );
}

export async function savePlayerProgress(progress) {
  const user = await getOrCreatePlayer();
  const playerRef = doc(db, "players", user.uid);

  await setDoc(playerRef, progress, { merge: true });
}