import gameLogo from "../assets/elements/title_train_journey_logo.png";
import parchmentScroll from "../assets/miniGame/blank-scroll-nobg.png";
import "./LegalDocument.css";

const PRIVACY_SECTIONS = [
  {
    title: "1. Introduction",
    paragraphs: [
      "Welcome to Train Journey Mapper. We respect your privacy and explain here how information is handled when you register for and use the game.",
      "This notice describes the current implementation and is intended to support responsible handling of personal information under applicable South African law, including POPIA.",
    ],
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "When you create a registered account, the game stores the profile information you provide: name, date of birth, calculated age, gender selection, province, traveller appearance and tour guide choice.",
      "Firebase Authentication processes your email address and password credentials for sign-in. The game does not write your password into the player profile in Firestore.",
      "The game profile in Cloud Firestore also stores gameplay progress and state, including points, stars, current and completed levels, quiz scores, passport stamps, inventory, money, needs and journey status.",
      "Game settings such as volume, notifications, vibration and language are stored in this browser's local storage. Guest gameplay state is held only in memory and is not saved as a player profile.",
      "On startup, the app may use Firebase Authentication to check for a saved player profile. Guest progress is not written to the player database, but the Firebase sign-in session used for that check may remain on the device.",
      "The app code initializes Firebase Authentication and Cloud Firestore. A measurement ID is present in the Firebase configuration, but the app does not initialize a Firebase Analytics SDK in its current implementation.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: [
      "Account and profile information is used to create and authenticate accounts, load the traveller profile, save registered-player progress and provide the game's features. Settings stored locally are used to apply your chosen preferences.",
    ],
  },
  {
    title: "4. Storage and Security",
    paragraphs: [
      "Registered player profile and progress data are stored in Cloud Firestore under the player's Firebase account ID. Sign-in credentials are handled by Firebase Authentication rather than saved in the player profile by the game.",
      "Google Firebase provides the authentication and database services used by the game. Information handled by these services is also subject to Google's applicable service terms and privacy information. No claim is made here that a particular security measure eliminates all risk.",
    ],
  },
  {
    title: "5. Sharing of Information",
    paragraphs: [
      "The game does not include a feature that sells player information. Information is processed by Google Firebase as needed to provide authentication and cloud database functionality. Firebase may process technical and service data under its own terms and privacy notices.",
    ],
  },
  {
    title: "6. Data Retention",
    paragraphs: [
      "The game currently has no self-service account or personal-data deletion feature. Registered profile and progress records remain in Firebase until they are deleted through the service by an authorized administrator. No fixed automatic deletion period is implemented.",
      "To request access, correction or deletion, contact the responsible party using the details below. Requests will be considered subject to applicable law and technical requirements.",
    ],
  },
  {
    title: "7. Your Privacy Rights",
    paragraphs: [
      "Subject to applicable law, you may request access to or correction or deletion of personal information, object to certain processing, or withdraw consent where processing is based on consent. You may also lodge a complaint with the Information Regulator of South Africa.",
      "Privacy Contact: leratomalatjie0614@gmail.com",
      "Game Developer / Responsible Party: Lerato Malatjie",
    ],
  },
  {
    title: "8. Children's Privacy",
    paragraphs: [
      "The registration form currently accepts players aged 5 and older and collects date of birth and calculated age. The game does not currently implement a parental-consent workflow. A parent or guardian with questions about a child's information may contact the responsible party.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    paragraphs: [
      "This Privacy Policy may be updated when the game or its information practices change. The latest version and its effective date will be made available to players.",
    ],
  },
  {
    title: "10. Contact",
    paragraphs: [
      "For privacy questions or requests, contact Lerato Malatjie at leratomalatjie0614@gmail.com.",
    ],
  },
];

const TERMS_SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "Welcome to Train Journey Mapper. By creating a registered account or using the game, you agree to these Terms and Conditions. If you do not agree, please do not use the game.",
    ],
  },
  {
    title: "2. About the Game",
    paragraphs: [
      "Train Journey Mapper is an educational adventure game introducing South African destinations, landmarks, history, culture, languages and natural heritage through an interactive railway journey. It includes discoveries, quizzes, mini-games, a travel passport and in-game resources.",
    ],
  },
  {
    title: "3. Player Accounts",
    paragraphs: [
      "Registered accounts use email and password sign-in. You are responsible for providing accurate registration information, keeping your credentials secure, using your account responsibly and not accessing another player's account without permission.",
      "Notify the game owner if you suspect unauthorized access to your account. Guest play is available without a registered account; guest progress is temporary and is not saved when the game session ends.",
    ],
  },
  {
    title: "4. Gameplay and Progress",
    paragraphs: [
      "Players can travel between destinations, complete discoveries, participate in quizzes and play mini-games. Registered progress, achievements and passport stamps are saved through the account and cloud database systems. Feature availability may depend on progress and in-game resources.",
    ],
  },
  {
    title: "5. In-Game Currency and Resources",
    paragraphs: [
      "The game includes virtual resources such as money, energy, hunger and thirst. In-game money may be earned through gameplay, including mini-games, and used for game-related purchases such as train tickets, food and water.",
      "In-game currency has no real-world monetary value, cannot be exchanged for real money, cannot be withdrawn or transferred outside the game, and exists only for gameplay. Train travel may require enough in-game currency to buy a ticket; players are responsible for managing their resources.",
    ],
  },
  {
    title: "6. Educational Content",
    paragraphs: [
      "The game provides educational information about South African places, history, culture, languages and heritage. Reasonable efforts are made to provide accurate information, but historical and cultural interpretations may change as research develops. The game is for education and entertainment and is not an authoritative academic or historical publication.",
    ],
  },
  {
    title: "7. Acceptable Use",
    paragraphs: [
      "You must not attempt to hack, exploit or disrupt the game; manipulate scores, rewards or currency through unauthorized methods; access restricted systems or another user's information; use the game unlawfully; or intentionally damage or interfere with the game's functionality.",
    ],
  },
  {
    title: "8. Intellectual Property",
    paragraphs: [
      "Unless otherwise stated, original game code, design, branding, written content and other original materials belong to their respective rights holders. Some imagery and media were generated using AI tools, and some assets are from third-party sources and remain subject to their applicable licences.",
      "Do not reproduce, distribute or commercially exploit protected game materials without appropriate permission.",
    ],
  },
  {
    title: "9. Third-Party Services",
    paragraphs: [
      "The game uses Google Firebase Authentication and Cloud Firestore for account authentication and player data storage. Use of these services is also subject to Google's applicable terms and privacy notices.",
    ],
  },
  {
    title: "10. Availability and Updates",
    paragraphs: [
      "The game may be updated, modified or improved. Uninterrupted availability cannot be guaranteed; technical issues, maintenance or third-party service interruptions may occur.",
    ],
  },
  {
    title: "11. Account Suspension and Termination",
    paragraphs: [
      "Accounts may be restricted or terminated where there is serious misuse, unauthorized activity or a violation of these terms, subject to applicable law. Contact the game owner about account-related concerns.",
    ],
  },
  {
    title: "12. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, the game owner is not responsible for losses arising from temporary interruptions, technical issues or circumstances beyond reasonable control. Nothing in these terms excludes liability that cannot legally be excluded under applicable law.",
    ],
  },
  {
    title: "13. Changes to These Terms",
    paragraphs: [
      "These Terms and Conditions may be updated as the game develops. The latest version and its effective date will be made available to players.",
    ],
  },
  {
    title: "14. Contact Information",
    paragraphs: [
      "For questions about these Terms and Conditions, contact Lerato Malatjie at leratomalatjie0614@gmail.com.",
    ],
  },
];

export default function LegalDocument({ type, onBack }) {
  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms & Conditions";
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <main className="legal-screen" aria-label={title}>
      <section className="legal-scroll-frame">
        <img className="legal-scroll-art" src={parchmentScroll} alt="" />
        <div className="legal-scroll-content">
          <button type="button" className="legal-back" onClick={onBack}>
            ← Back
          </button>
          <img className="legal-game-logo" src={gameLogo} alt="Train Journey Mapper" />
          <div className="legal-document-copy" tabIndex="0">
            <h1>{isPrivacy ? "TRAIN JOURNEY MAPPER – PRIVACY POLICY" : "TRAIN JOURNEY MAPPER – TERMS AND CONDITIONS"}</h1>
            <p className="legal-updated">Last Updated: 2 November 2026</p>
            {sections.map((section) => (
              <section className="legal-section" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {paragraph.includes("leratomalatjie0614@gmail.com")
                      ? paragraph.split("leratomalatjie0614@gmail.com").map((part, index, parts) => (
                        <span key={`${part}-${index}`}>
                          {part}
                          {index < parts.length - 1 && (
                            <a href="mailto:leratomalatjie0614@gmail.com">leratomalatjie0614@gmail.com</a>
                          )}
                        </span>
                      ))
                      : paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <button type="button" className="legal-back legal-back-bottom" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    </main>
  );
}
