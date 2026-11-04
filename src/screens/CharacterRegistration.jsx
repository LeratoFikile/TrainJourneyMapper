import { useCallback, useEffect, useMemo, useState } from "react";
import "./CharacterRegistration.css";

import { savePlayerProfile } from "../firebasePlayer";
import LegalDocument from "./LegalDocument";
import LegalLinks from "./LegalLinks";
import parchmentScroll from "../assets/miniGame/blank-scroll-nobg.png";
import gameLogo from "../assets/elements/title_train_journey_logo.png";
import titleJoinTheJourney from "../assets/elements/title_join_the_journey.png";
import buttonContinue from "../assets/elements/button_continue.png";
import buttonCreateAccount from "../assets/elements/button_create_account.png";

import skin1 from "../assets/characters/players/skin1.png";
import skin2 from "../assets/characters/players/skin2.png";
import skin3 from "../assets/characters/players/skin3.png";
import skin4 from "../assets/characters/players/skin4.png";
import skin5 from "../assets/characters/players/skin5.png";
import skin6 from "../assets/characters/players/skin6.png";

import mamzo from "../assets/characters/guides/mamzo.png";
import malume from "../assets/characters/guides/malume.png";


/*
 * ============================================
 * SOUTH AFRICAN PROVINCES
 * ============================================
 */

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape"
];


/*
 * ============================================
 * TRAVELLER SKINS
 * ============================================
 *
 * These are appearances for the PLAYER.
 *
 * They are NOT characters.
 * They are NOT tour guides.
 */

const SKINS = [
  {
    id: "skin_01",
    name: "Traveller 1",
    image: skin1
  },
  {
    id: "skin_02",
    name: "Traveller 2",
    image: skin2
  },
  {
    id: "skin_03",
    name: "Traveller 3",
    image: skin3
  },
  {
    id: "skin_04",
    name: "Traveller 4",
    image: skin4
  },
  {
    id: "skin_05",
    name: "Traveller 5",
    image: skin5
  },
  {
    id: "skin_06",
    name: "Traveller 6",
    image: skin6
  }
];


/*
 * ============================================
 * TOUR GUIDES
 * ============================================
 *
 * These are completely separate characters
 * from the player's traveller.
 */

const GUIDES = [
  {
    id: "mamzo",
    name: "Mamzo",
    gender: "female",
    image: mamzo,
    description:
      "Sharp, witty and knows every station."
  },
  {
    id: "malume",
    name: "Malume",
    gender: "male",
    image: malume,
    description:
      "Warm, funny and full of stories."
  }
];


/*
 * ============================================
 * CALCULATE AGE
 * ============================================
 */

function calculateAge(dateOfBirth) {

  if (!dateOfBirth) {
    return "";
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}


/*
 * ============================================
 * RANDOM SKIN
 * ============================================
 */

function getRandomSkin() {

  const randomIndex =
    Math.floor(
      Math.random() * SKINS.length
    );

  return SKINS[randomIndex].id;
}


/*
 * ============================================
 * COMPONENT
 * ============================================
 */

export default function CharacterRegistration({
  onComplete,
  onSignIn
}) {

  /*
   * Current registration step.
   *
   * 1 = Player information
   * 2 = Traveller appearance
   * 3 = Tour guide
   */

  const [step, setStep] =
    useState(1);


  /*
   * PLAYER INFORMATION
   */

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isGuestRegistration, setIsGuestRegistration] =
    useState(false);

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  const [legalDocument, setLegalDocument] =
    useState(null);

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [province, setProvince] =
    useState("");


  /*
   * OPTIONAL SKIN
   */

  const [selectedSkin, setSelectedSkin] =
    useState(null);

  const [skinIndex, setSkinIndex] =
    useState(0);


  /*
   * REQUIRED TOUR GUIDE
   */

  const [selectedGuide, setSelectedGuide] =
    useState("");

  const [guideIndex, setGuideIndex] =
    useState(0);


  /*
   * UI STATE
   */

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  /*
   * AGE IS CALCULATED AUTOMATICALLY
   */

  const age = useMemo(
    () => calculateAge(dateOfBirth),
    [dateOfBirth]
  );


  /*
   * ============================================
   * STEP 1 VALIDATION
   * ============================================
   */

  const continueFromStepOne = () => {

    setError("");

    const trimmedName =
      name.trim();


    /*
     * NAME
     */

    if (!trimmedName) {

      setError(
        "Please tell us your name."
      );

      return;
    }


    if (trimmedName.length < 2) {

      setError(
        "Your name must be at least 2 characters."
      );

      return;
    }

    if (!isGuestRegistration) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address for account sign-in.");
        return;
      }

      if (password.length < 6) {
        setError("Your password must be at least 6 characters.");
        return;
      }
    }


    if (!isGuestRegistration) {
      if (!dateOfBirth) {
        setError("Please enter your date of birth.");
        return;
      }

      if (age === "" || age < 5) {
        setError("You need to be at least 5 years old to play.");
        return;
      }

      if (age > 120) {
        setError("Please check your date of birth.");
        return;
      }

      if (!province) {
        setError("Please choose your province.");
        return;
      }
    }


    /*
     * Everything is valid.
     */

    setStep(2);

  };


  /*
   * ============================================
   * STEP 2
   * ============================================
   *
   * Skin is OPTIONAL.
   */

  const continueFromStepTwo = () => {

    setError("");

    if (isGuestRegistration && !selectedSkin) {
      setError("Choose your traveller character to continue.");
      return;
    }

    setStep(3);

  };


  /*
   * ============================================
   * STEP 3
   * ============================================
   *
   * Guide IS required.
   */

  const finishRegistration = async () => {

    setError("");

    if (!isGuestRegistration && !termsAccepted) {
      setError("Please review and accept the Terms & Conditions to create your account.");
      return;
    }


    if (!selectedGuide) {

      setError(
        "Please choose your tour guide."
      );

      return;
    }


    setSaving(true);


    try {

      /*
       * If the player selected a skin,
       * use it.
       *
       * Otherwise randomly choose one.
       */

      const finalSkin =
        selectedSkin || getRandomSkin();


      const profile = {

        /*
         * PLAYER
         */

        name: name.trim(),

        dateOfBirth,

        gender,

        age,

        province,


        /*
         * PLAYER APPEARANCE
         */

        skin: finalSkin,

        /*
         * Lets us know whether the player
         * personally selected their skin.
         */

        skinSelected:
          Boolean(selectedSkin),


        /*
         * TOUR GUIDE
         */

        guide: selectedGuide

      };


      if (isGuestRegistration) {
        onComplete({
          ...profile,
          guest: true,
          currentLevel: 1,
          completedLevels: [],
          completedKnowledgeQuizzes: [],
          knowledgeQuizScores: {},
          passport: [],
          welcomeJourneyRead: false,
          journeyStarted: false,
          needs: { life: 100, hunger: 86, water: 92 },
          money: 250,
          inventory: [],
          pretoriaWelcomePackageClaimed: false,
          points: 0,
          stars: 0,
        });
      } else {
        const savedProfile = await savePlayerProfile(profile, { email, password });
        onComplete(savedProfile);
      }

    } catch (firebaseError) {

      console.error(
        "Firebase registration error:",
        firebaseError
      );


      setError(
        firebaseError.code === "auth/email-already-in-use"
          || firebaseError.code === "auth/credential-already-in-use"
          ? "This email already has an account. Choose “Already registered? Sign in” to restore that journey."
          : "We couldn't save your journey. Please check your internet connection and try again."
      );

    } finally {

      setSaving(false);

    }

  };


  /*
   * ============================================
   * BACK BUTTON
   * ============================================
   */

  const goBack = () => {

    setError("");

    if (step > 1) {
      setStep(step - 1);
    }

  };


  /*
   * ============================================
   * TODAY
   * ============================================
   *
   * Prevents future DOB.
   */

  const maximumDate =
    new Date()
      .toISOString()
      .split("T")[0];

  const activeSkin = SKINS[skinIndex];
  const activeGuide = GUIDES[guideIndex];

  const changeSkin = useCallback((direction) => {
    const nextIndex = (skinIndex + direction + SKINS.length) % SKINS.length;
    setSkinIndex(nextIndex);
    setSelectedSkin(SKINS[nextIndex].id);
  }, [skinIndex]);

  const changeGuide = (direction) => {
    setGuideIndex((currentIndex) => {
      const nextIndex =
        (currentIndex + direction + GUIDES.length) % GUIDES.length;

      return nextIndex;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (step !== 2 && step !== 3) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        if (step === 2) {
          changeSkin(-1);
        } else {
          changeGuide(-1);
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        if (step === 2) {
          changeSkin(1);
        } else {
          changeGuide(1);
        }
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (step === 2) {
          setSelectedSkin(activeSkin.id);
        } else {
          setSelectedGuide(activeGuide.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [step, activeSkin, activeGuide, changeSkin]);

  return (
    <main className="character-registration" aria-label="Join the journey">
      {legalDocument ? (
        <LegalDocument type={legalDocument} onBack={() => setLegalDocument(null)} />
      ) : (
        <section className="auth-scroll-frame">
          <img className="auth-scroll-art" src={parchmentScroll} alt="" />
          <div className="registration-card">
            <div className="registration-content">
              <img className="auth-game-logo" src={gameLogo} alt="Train Journey Mapper" />
              {step === 1 && (
                <img
                  className="registration-heading"
                  src={titleJoinTheJourney}
                  alt=""
                />
              )}


        {/* TRAIN */}

        <div className="registration-train">
          🚂
        </div>


        {/* STEP */}

        <div className="registration-step">
          STEP {step} OF 3
        </div>


        {/* ====================================
            PROGRESS
        ==================================== */}

        <div className="registration-progress">

          <div
            className={
              step >= 1
                ? "progress-dot active"
                : "progress-dot"
            }
          >
            1
          </div>

          <div
            className={
              step >= 2
                ? "progress-line active"
                : "progress-line"
            }
          />

          <div
            className={
              step >= 2
                ? "progress-dot active"
                : "progress-dot"
            }
          >
            2
          </div>

          <div
            className={
              step >= 3
                ? "progress-line active"
                : "progress-line"
            }
          />

          <div
            className={
              step >= 3
                ? "progress-dot active"
                : "progress-dot"
            }
          >
            3
          </div>

        </div>


        {/* ====================================
            STEP 1
        ==================================== */}

        {step === 1 && (

          <>

            <h1 className="registration-title">

              Join the Journey!

            </h1>


            <p className="registration-description">

              {isGuestRegistration
                ? "Choose a name to get started. You'll choose your traveller and tour guide next."
                : "Your South African adventure starts here! Create your traveller account and get ready to explore."}

            </p>

            {isGuestRegistration ? (
              <button
                type="button"
                className="registration-sign-in"
                onClick={() => {
                  setIsGuestRegistration(false);
                  setError("");
                }}
              >
                Create an account instead
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="registration-sign-in"
                  onClick={() => {
                    setIsGuestRegistration(true);
                    setError("");
                  }}
                >
                  Continue as Guest — no progress saved
                </button>
                {onSignIn && (
                  <button
                    type="button"
                    className="registration-sign-in"
                    onClick={onSignIn}
                  >
                    Already a traveller? Log in
                  </button>
                )}
              </>
            )}

            <div className="registration-form">


              {/* NAME */}

              <div className="registration-field">

                <label htmlFor="traveller-name">
                  What's your name?
                </label>

                <div className="image-input image-input-name">
                  <input
                    id="traveller-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="e.g. Thandi"
                    maxLength={30}
                    autoComplete="name"
                  />
                </div>
              </div>

              {!isGuestRegistration && (
                <>
                  <div className="registration-field">
                    <label htmlFor="traveller-email">Email for sign-in</label>
                    <div className="image-input">
                      <input
                        id="traveller-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                  </div>

                  <div className="registration-field">
                    <label htmlFor="traveller-password">Create a password</label>
                    <div className="image-input">
                      <input
                        id="traveller-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </>
              )}


              {!isGuestRegistration && (
                <>
              {/* DOB */}

              <div className="registration-field">

                <label htmlFor="traveller-dob">
                  When were you born?
                </label>

                <div className="image-input image-input-date">
                  <input
                    id="traveller-dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) =>
                      setDateOfBirth(event.target.value)
                    }
                    max={maximumDate}
                  />
                </div>

              </div>

              {/* AGE */}

              {age !== "" && age >= 0 && (

                <div className="registration-age">

                  <div className="registration-age-icon">
                    🎂
                  </div>

                  <div className="registration-age-text">

                    <span>
                      Your age
                    </span>

                    <strong>
                      {age}
                    </strong>

                  </div>

                </div>

              )}


              {/* GENDER */}

              <div className="registration-field">

                <label htmlFor="traveller-gender">
                  How do you identify?
                </label>

                <div className="image-input image-input-select">
                  <select
                    id="traveller-gender"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>

              </div>


              {/* PROVINCE */}

              <div className="registration-field">

                <label htmlFor="traveller-province">
                  Where are you from?
                </label>

                <div className="image-input image-input-select">
                  <select
                    id="traveller-province"
                    value={province}
                    onChange={(event) =>
                      setProvince(event.target.value)
                    }
                  >

                    <option value="">
                      Choose your province
                    </option>

                    {PROVINCES.map(
                      (provinceName) => (

                        <option
                          key={provinceName}
                          value={provinceName}
                        >
                          {provinceName}
                        </option>

                      )
                    )}

                  </select>
                </div>

              </div>

                </>
              )}

              {/* ERROR */}

              {error && (

                <div className="registration-error">
                  {error}
                </div>

              )}


              {/* CONTINUE */}

              <button
                type="button"
                className="registration-continue asset-button"
                onClick={continueFromStepOne}
                aria-label="Continue"
              >
                <img src={buttonContinue} alt="Continue" />
              </button>

            </div>

          </>

        )}


        {/* ====================================
            STEP 2
        ==================================== */}

        {step === 2 && (

          <>

            <h1 className="registration-title">

              Make It

              <span>
                Yours
              </span>

            </h1>


            <p className="registration-description">

              {isGuestRegistration
                ? "Choose your traveller character."
                : "Choose how your traveller looks. You can skip this and we'll choose one for you."}

            </p>


            <div className="skin-carousel" aria-label="Choose a traveller skin">

              <button
                type="button"
                className="carousel-arrow"
                aria-label="Previous skin"
                onClick={() => changeSkin(-1)}
              >
                ‹
              </button>

              <button
                type="button"
                key={activeSkin.id}
                className={
                  selectedSkin === activeSkin.id
                    ? "skin-option selected"
                    : "skin-option"
                }
                onClick={() => setSelectedSkin(activeSkin.id)}
                aria-pressed={selectedSkin === activeSkin.id}
              >

                <div className="skin-character">
                  <img
                    src={activeSkin.image}
                    alt={activeSkin.name}
                    className="skin-art"
                  />
                </div>

                <div className="skin-name">
                  {activeSkin.name}
                </div>

                {selectedSkin === activeSkin.id && (

                  <div className="skin-check">
                    ✓
                  </div>

                )}

              </button>

              <button
                type="button"
                className="carousel-arrow"
                aria-label="Next skin"
                onClick={() => changeSkin(1)}
              >
                ›
              </button>

            </div>

            <div className="carousel-indicators" aria-label="Skin choices">
              {SKINS.map((skin, index) => (
                <button
                  key={skin.id}
                  type="button"
                  className={
                    index === skinIndex
                      ? "carousel-dot active"
                      : "carousel-dot"
                  }
                  aria-label={`View ${skin.name}`}
                  onClick={() => {
                    setSkinIndex(index);
                    setSelectedSkin(skin.id);
                  }}
                />
              ))}
            </div>


            {!isGuestRegistration && (
            <div className="skin-skip">

              <span>
                ✨
              </span>

              <p>
                Don't want to choose?
                <strong>
                  We'll pick one for you.
                </strong>
              </p>

            </div>
            )}


            {error && (

              <div className="registration-error">
                {error}
              </div>

            )}

            <div className="registration-button-row">

              <button
                type="button"
                className="registration-back"
                onClick={goBack}
              >
                ← Back
              </button>

              <button
                type="button"
                className="registration-continue asset-button"
                onClick={continueFromStepTwo}
                aria-label="Continue"
              >
                <img src={buttonContinue} alt="Continue" />
              </button>

            </div>

          </>

        )}


        {/* ====================================
            STEP 3
        ==================================== */}

        {step === 3 && (

          <>

            <h1 className="registration-title">

              Choose Your

              <span>
                Guide
              </span>

            </h1>


            <p className="registration-description">

              Every traveller needs someone
              who knows the way.

            </p>


            <div className="guide-carousel" aria-label="Choose a tour guide">

              <button
                type="button"
                className="carousel-arrow"
                aria-label="Previous guide"
                onClick={() => changeGuide(-1)}
              >
                ‹
              </button>

              <div className="guide-selection-wrap">
                <button
                  type="button"
                  key={activeGuide.id}
                  className={
                    selectedGuide === activeGuide.id
                      ? "guide-card selected"
                      : "guide-card"
                  }
                  onClick={() => setSelectedGuide(activeGuide.id)}
                  aria-pressed={selectedGuide === activeGuide.id}
                >

                  <div className="guide-character">
                    <img
                      src={activeGuide.image}
                      alt={activeGuide.name}
                      className="guide-art"
                    />
                  </div>

                  <div
                    className={
                      selectedGuide === activeGuide.id
                        ? "guide-radio checked"
                        : "guide-radio"
                    }
                  >

                    {selectedGuide === activeGuide.id
                      ? "✓"
                      : ""}

                  </div>

                </button>

                <div className="guide-information">

                  <h2>
                    {activeGuide.name}
                  </h2>

                  <span>
                    Your tour guide
                  </span>

                  <p>
                    {activeGuide.description}
                  </p>

                </div>
              </div>

              <button
                type="button"
                className="carousel-arrow"
                aria-label="Next guide"
                onClick={() => changeGuide(1)}
              >
                ›
              </button>

            </div>

            <div className="carousel-indicators" aria-label="Guide choices">
              {GUIDES.map((guide, index) => (
                <button
                  key={guide.id}
                  type="button"
                  className={
                    index === guideIndex
                      ? "carousel-dot active"
                      : "carousel-dot"
                  }
                  aria-label={`View ${guide.name}`}
                  onClick={() => setGuideIndex(index)}
                />
              ))}
            </div>


            {error && (

              <div className="registration-error">
                {error}
              </div>

            )}

            {!isGuestRegistration && (
              <div className="registration-consent">
                <input
                  type="checkbox"
                  aria-label="Accept the Terms and Conditions"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  required
                />
                <span className="registration-consent-copy">
                  By creating an account, you acknowledge that you have read the{" "}
                  <button type="button" onClick={() => setLegalDocument("privacy")}>
                    Privacy Policy
                  </button>
                  {" "}and agree to the{" "}
                  <button type="button" onClick={() => setLegalDocument("terms")}>
                    Terms &amp; Conditions
                  </button>
                  .
                </span>
              </div>
            )}


            <div className="registration-button-row">

              <button
                type="button"
                className="registration-back"
                onClick={goBack}
                disabled={saving}
              >
                ← Back
              </button>

              <button
                type="button"
                className="registration-continue asset-button"
                onClick={finishRegistration}
                disabled={saving}
                aria-label={saving ? "Starting journey" : "Start journey"}
              >

                {saving
                  ? <span className="button-label">Starting journey...</span>
                  : <img src={buttonCreateAccount} alt="Create account" />
                }

              </button>

            </div>

          </>

        )}


              </div>
              <LegalLinks onOpen={setLegalDocument} />
            </div>
          </section>
      )}
    </main>
  );

}