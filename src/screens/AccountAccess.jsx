import { useState } from "react";
import {
  getPlayerProfile,
  isCurrentPlayerAccountLinked,
  linkCurrentPlayerAccount,
  signInPlayer,
  signOutPlayer,
} from "../firebasePlayer";
import LegalDocument from "./LegalDocument";
import LegalLinks from "./LegalLinks";
import parchmentScroll from "../assets/miniGame/blank-scroll-nobg.png";
import gameLogo from "../assets/elements/title_train_journey_logo.png";
import "./AccountAccess.css";

function getAccountError(error, mode) {
  if (error.code === "auth/email-already-in-use" || error.code === "auth/credential-already-in-use") {
    return "This email already has an account. Sign in to that account instead.";
  }
  if (error.code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }
  if (error.code === "auth/weak-password") {
    return "Choose a stronger password with at least 6 characters.";
  }
  if (error.code === "auth/operation-not-allowed") {
    return "Email and password sign-in is not enabled for this game yet. Please contact the game administrator.";
  }
  if (mode === "sign-in" && (
    error.code === "auth/invalid-credential"
    || error.code === "auth/user-not-found"
    || error.code === "auth/wrong-password"
  )) {
    return "We couldn't sign you in. Check your email and password, then try again.";
  }
  if (mode === "link" && error.message === "This player account already has sign-in details.") {
    return "This player already has sign-in details. Use Sign In on the welcome screen to access it.";
  }
  return mode === "sign-in"
    ? "We couldn't load your journey. Check your connection and try again."
    : "We couldn't link this account. Check your connection and try again.";
}

export default function AccountAccess({ mode, onSuccess, onCancel, embedded = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [accountLinked, setAccountLinked] = useState(isCurrentPlayerAccountLinked);
  const [legalDocument, setLegalDocument] = useState(null);
  const isSignIn = mode === "sign-in";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isSignIn && password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (isSignIn) {
        await signInPlayer(email, password);
        const profile = await getPlayerProfile();
        if (!profile) {
          await signOutPlayer();
          setError("This sign-in has no saved journey yet. Check that you used the account created for Train Journey Mapper.");
          return;
        }
        onSuccess(profile);
      } else {
        await linkCurrentPlayerAccount(email, password);
        setAccountLinked(true);
        setMessage("Account linked. Your progress is now available when you sign in on another device.");
      }
    } catch (accountError) {
      console.error(`Could not ${isSignIn ? "sign in" : "link player account"}:`, accountError);
      setError(getAccountError(accountError, mode));
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <section className={`account-card${embedded ? " account-card-embedded" : ""}`}>
      {!embedded && <img className="auth-game-logo" src={gameLogo} alt="Train Journey Mapper" />}
      <h1>{isSignIn ? "Welcome Back, Traveller!" : "Save your journey"}</h1>
      <p className="account-description">
        {isSignIn
          ? "Your adventure isn't over yet! Log in and continue where your journey left off."
          : "Link this player to an email and password so you can sign in and continue your progress on another device."}
      </p>

      {mode === "link" && accountLinked ? (
        <div className="account-success" role="status">
          {message || "This player account already has sign-in details."}
        </div>
      ) : (
        <form className="account-form" onSubmit={handleSubmit}>
          <label className="account-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              inputMode="email"
              required
            />
          </label>
          <label className="account-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          {message && <p className="account-success" role="status">{message}</p>}
          <button type="submit" className="account-submit" disabled={busy}>
            {busy
              ? (isSignIn ? "Signing in..." : "Linking account...")
              : (isSignIn ? "LOG IN" : "LINK ACCOUNT")}
          </button>
        </form>
      )}
      {onCancel && (
        <button type="button" className="account-cancel" onClick={onCancel} disabled={busy}>
          {isSignIn ? "New to the journey? Sign up." : "Close"}
        </button>
      )}
    </section>
  );

  if (embedded) {
    return form;
  }

  return (
    <main className="account-screen" aria-label={isSignIn ? "Log in" : "Link account"}>
      {legalDocument ? (
        <LegalDocument type={legalDocument} onBack={() => setLegalDocument(null)} />
      ) : (
        <section className="auth-scroll-frame">
          <img className="auth-scroll-art" src={parchmentScroll} alt="" />
          <div className="account-scroll-content">
            <div className="account-scroll-body">{form}</div>
            <LegalLinks onOpen={setLegalDocument} />
          </div>
        </section>
      )}
    </main>
  );
}
