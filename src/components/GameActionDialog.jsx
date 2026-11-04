import { useRef, useState } from "react";
import parchmentScroll from "../assets/miniGame/blank-scroll-nobg.png";
import "./GameActionDialog.css";

const ACTION_COPY = {
  reset: {
    title: "RESET GAME PROGRESS?",
    message: (
      <>
        <p>Are you sure you want to restart your journey from Pretoria?</p>
        <p>
          Completed levels, unlocked destinations, discoveries, quiz results and passport stamps will be reset.
          You will need to replay the journey to unlock destinations again.
        </p>
        <p>
          Your money, hearts and regeneration timers, food, water, inventory, character, guide, settings,
          onboarding and Pretoria welcome-package claim will be preserved.
        </p>
        <p>Are you sure you want to continue?</p>
      </>
    ),
    confirmLabel: "Yes, Reset Progress",
    pendingLabel: "Resetting...",
  },
  logout: {
    title: "LOG OUT?",
    message: (
      <>
        <p>Are you sure you want to log out of Train Journey Mapper?</p>
        <p>Your game progress will remain saved, and you can continue your adventure when you log back in.</p>
      </>
    ),
    confirmLabel: "Yes, Log Out",
    pendingLabel: "Logging out...",
  },
  delete: {
    title: "DELETE YOUR ACCOUNT?",
    message: (
      <>
        <p>Are you sure you want to permanently delete your account?</p>
        <p>
          This will permanently remove your account and all associated game data, including your journey
          progress, completed levels, discoveries, passport stamps, quiz scores, achievements and saved rewards.
        </p>
        <p><strong>This action cannot be undone.</strong></p>
        <p>Are you sure you wish to continue?</p>
      </>
    ),
    confirmLabel: "Yes, Delete Account",
    pendingLabel: "Deleting account...",
  },
};

function getErrorMessage(error, action, reauthenticationRequested) {
  if (error?.code === "auth/requires-recent-login") {
    return reauthenticationRequested
      ? "Firebase still requires a recent sign-in. Please log out, sign in again, then retry account deletion."
      : "For your security, sign in again before deleting your account. Enter your current password below.";
  }
  if (error?.code === "auth/requires-recent-login-unavailable") {
    return "This guest account needs a fresh sign-in before it can be deleted. Link it with Sync Account, then sign in again and retry.";
  }
  if (error?.code === "auth/unsupported-reauthentication") {
    return "This account cannot be verified with a password here. Sign in again with your account provider, then retry deletion.";
  }
  if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password") {
    return "That password could not verify this account. Check it and try again.";
  }
  if (error?.code === "account/deletion-incomplete") {
    return error.message;
  }
  if (action === "delete") {
    return "Your account could not be deleted. Your saved profile was preserved; check your connection and try again.";
  }
  if (action === "reset") {
    return "Progress could not be reset. Your saved game was not changed; check your connection and try again.";
  }
  return "You could not be logged out. Check your connection and try again.";
}

export default function GameActionDialog({
  action,
  onCancel,
  onConfirm,
  onReauthenticationChange,
}) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reauthenticationRequested, setReauthenticationRequested] = useState(false);
  const [password, setPassword] = useState("");
  const copy = ACTION_COPY[action];
  const isDelete = action === "delete";

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (busyRef.current) return;

    busyRef.current = true;
    setBusy(true);
    setErrorMessage("");
    try {
      await onConfirm({ password: reauthenticationRequested ? password : undefined });
    } catch (error) {
      console.error(`Could not complete ${action} action:`, error);
      if (error?.code === "auth/requires-recent-login") {
        setReauthenticationRequested(true);
        onReauthenticationChange?.(true);
      }
      setErrorMessage(getErrorMessage(error, action, reauthenticationRequested));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (!busy && event.target === event.currentTarget) onCancel();
  };

  const dialogContent = (
    <>
      <h2 id="game-action-title">{copy.title}</h2>
      <div className="game-action-message">{copy.message}</div>
      {reauthenticationRequested && (
        <label className="game-action-password">
          <span>Current account password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={busy}
            required
          />
        </label>
      )}
      {errorMessage && <p className="game-action-error" role="alert">{errorMessage}</p>}
      <div className="game-action-buttons">
        <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>
        <button
          className={isDelete ? "game-action-destructive" : ""}
          type="submit"
          disabled={busy || (reauthenticationRequested && !password)}
        >
          {busy ? copy.pendingLabel : copy.confirmLabel}
        </button>
      </div>
    </>
  );

  return (
    <div className="game-action-backdrop" onClick={handleBackdropClick}>
      {isDelete ? (
        <form
          className="game-action-scroll"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="game-action-title"
          onSubmit={handleConfirm}
        >
          <img className="game-action-scroll-art" src={parchmentScroll} alt="" />
          <div className="game-action-scroll-content">{dialogContent}</div>
        </form>
      ) : (
        <form
          className="game-action-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="game-action-title"
          onSubmit={handleConfirm}
        >
          {dialogContent}
        </form>
      )}
    </div>
  );
}
