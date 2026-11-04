import {
  deleteUser,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  setDoc
} from "firebase/firestore";

import { auth, db } from "./firebase";
import {
  PRETORIA_WELCOME_PACKAGE_ITEMS,
  PRETORIA_WELCOME_PACKAGE_MONEY,
} from "./gameplay/pretoriaWelcomePackage";


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

export async function deleteCurrentPlayerAccount(password) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No signed-in player account was found.");
  }

  const supportsPasswordReauthentication = user.providerData.some(
    (provider) => provider.providerId === EmailAuthProvider.PROVIDER_ID
  );

  if (password !== undefined) {
    if (!user.email || !supportsPasswordReauthentication) {
      const error = new Error("This account cannot be reauthenticated with an email and password.");
      error.code = "auth/unsupported-reauthentication";
      throw error;
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } else {
    const token = await user.getIdTokenResult();
    const authenticatedAt = Date.parse(token.authTime);
    const recentLoginWindow = 5 * 60 * 1000;

    if (!Number.isFinite(authenticatedAt) || Date.now() - authenticatedAt > recentLoginWindow) {
      const error = new Error("Recent sign-in is required before this account can be deleted.");
      error.code = supportsPasswordReauthentication
        ? "auth/requires-recent-login"
        : "auth/requires-recent-login-unavailable";
      throw error;
    }
  }

  const playerRef = doc(db, "players", user.uid);
  const playerSnapshot = await getDoc(playerRef);

  if (playerSnapshot.exists()) {
    await deleteDoc(playerRef);
  }

  try {
    await deleteUser(user);
  } catch (error) {
    if (playerSnapshot.exists()) {
      try {
        await setDoc(playerRef, playerSnapshot.data());
      } catch (restoreError) {
        const deletionError = new Error(
          "Account deletion failed, and the saved player profile could not be restored. Contact support before trying again."
        );
        deletionError.code = "account/deletion-incomplete";
        deletionError.cause = restoreError;
        throw deletionError;
      }
    }

    if (error?.code === "auth/requires-recent-login" && !supportsPasswordReauthentication) {
      const recentLoginError = new Error(error.message);
      recentLoginError.code = "auth/requires-recent-login-unavailable";
      recentLoginError.cause = error;
      throw recentLoginError;
    }

    throw error;
  }
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
    ...playerSnapshot.data(),
    id: user.uid
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
    journeyStarted: false,
    needs: { life: 100, hunger: 86, water: 92 },
    heartLossTimestamps: [],
    deathRecoveryPending: false,
    money: 250,
    inventory: [],
    pretoriaWelcomePackageClaimed: false,
  };

  const savedPlayerData = await runTransaction(db, async (transaction) => {
    const playerSnapshot = await transaction.get(playerRef);
    if (playerSnapshot.exists()) return playerSnapshot.data();

    transaction.set(playerRef, playerData);
    return playerData;
  });

  return {
    ...savedPlayerData,
    id: user.uid
  };
}

export async function claimPretoriaWelcomePackage(expectedPlayerId) {
  const user = auth.currentUser;
  if (!user || !expectedPlayerId || user.uid !== expectedPlayerId) {
    throw new Error("The signed-in player changed before the Pretoria welcome package could be claimed.");
  }

  const playerRef = doc(db, "players", user.uid);
  return runTransaction(db, async (transaction) => {
    const playerSnapshot = await transaction.get(playerRef);
    if (!playerSnapshot.exists()) {
      throw new Error("The signed-in player's profile could not be found.");
    }

    const profile = playerSnapshot.data();
    if (profile.pretoriaWelcomePackageClaimed !== false) {
      if (profile.pretoriaWelcomePackageClaimed !== true) {
        transaction.update(playerRef, { pretoriaWelcomePackageClaimed: true });
      }
      return { ...profile, pretoriaWelcomePackageClaimed: true, id: user.uid };
    }

    const inventory = Array.isArray(profile.inventory) ? profile.inventory : [];
    const claimedProfile = {
      pretoriaWelcomePackageClaimed: true,
      inventory: [...new Set([...inventory, ...PRETORIA_WELCOME_PACKAGE_ITEMS])],
      money: (Number.isFinite(profile.money) ? profile.money : 250)
        + PRETORIA_WELCOME_PACKAGE_MONEY,
    };

    transaction.update(playerRef, claimedProfile);
    return { ...profile, ...claimedProfile, id: user.uid };
  });
}

export async function markWelcomeJourneyRead(expectedPlayerId) {
  const user = auth.currentUser;
  if (!user || !expectedPlayerId || user.uid !== expectedPlayerId) {
    throw new Error("The signed-in player changed before the introduction could be saved.");
  }

  const playerRef = doc(db, "players", user.uid);

  await setDoc(
    playerRef,
    { welcomeJourneyRead: true },
    { merge: true }
  );
}

export async function savePlayerProgress(progress, expectedPlayerId) {
  const user = auth.currentUser;
  if (!user || !expectedPlayerId || user.uid !== expectedPlayerId) {
    throw new Error("The signed-in player changed before progress could be saved.");
  }

  const playerRef = doc(db, "players", user.uid);

  await setDoc(playerRef, progress, { merge: true });
}