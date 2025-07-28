import React from "react";
import './HeroSection.css';
function HeroSection({
  ville, setVille,
  type, setType,
  budgetMin, setBudgetMin,
  budgetMax, setBudgetMax,
  mode, setMode,
  onSearch,
  SearchBarComponent
}) {
  return (
    <section className="client-hero">
      <div className="client-hero-bg" />
      <div className="client-hero-content">
        <h1>Marrakech Tactics</h1>
        <p>Tous types de biens, et surtout le vôtre</p>
        {SearchBarComponent && (
          <SearchBarComponent
            ville={ville}
            setVille={setVille}
            type={type}
            setType={setType}
            budgetMin={budgetMin}
            setBudgetMin={setBudgetMin}
            budgetMax={budgetMax}
            setBudgetMax={setBudgetMax}
            mode={mode}
            setMode={setMode}
            onSearch={onSearch}
          />
        )}
      </div>
    </section>
  );
}

export default HeroSection; 