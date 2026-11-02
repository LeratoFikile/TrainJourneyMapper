import capeTownArrivalImage from "../assets/Bellville/03_cape_town.png";

export default function CapeTownLevel({ onBack }) {
  return (
    <main className="bellville-level" aria-label="Cape Town level">
      <button className="bellville-level-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Journey map
      </button>
      <section className="bellville-arrival">
        <img src={capeTownArrivalImage} alt="Welcome to Cape Town" />
        <h1>Welcome to Cape Town</h1>
      </section>
    </main>
  );
}
