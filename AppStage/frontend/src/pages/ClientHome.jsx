
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home/Header";
import HeroSection from "../components/Home/HeroSection";
import AboutBlock from "../components/Home/AboutBlock";
import CategoriesBlock from "../components/Home/CategoriesBlock";
import ServicesBlock from "../components/Home/ServicesBlock";
import ContactUs from "../components/Home/ContactUs";
import StatsBlock from "../components/Home/StatsBlock";
import Footer from "../components/Home/Footer";
import SearchBar from "../components/SearchBar";
import AdminAccessLink from "../components/AdminAccessLink";
import { apiRequest } from "../config/api";
import "./ClientHome.css";

function ClientHome() {
  const [ville, setVille] = useState("");
  const [type, setType] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [mode, setMode] = useState("acheter");
  const navigate = useNavigate();

  useEffect(() => {
    // Track a site view when the home page loads
    apiRequest('/api/Analytics/site-view', {
      method: 'POST',
      body: { path: '/' }
    }).catch(() => {});
  }, []);

  // Filtres prédéfinis
  const predefinedFilters = [
    {
      label: "Appartement Marrakech",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
      type: "Appartement",
      ville: "Marrakech",
    },
    {
      label: "Villa Prestigia",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      type: "Villa",
      ville: "Prestigia",
    },
    {
      label: "Riad Médina",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80",
      type: "Riad",
      ville: "Médina",
    },
    {
      label: "Maison Route de l'Ourika",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80",
      type: "Maison",
      ville: "Route de l'Ourika",
    },
  ];

  // Services
  const services = [
    {
      icon: "🏠",
      title: "Achat & Vente",
      description: "Accompagnement personnalisé pour tous vos projets d'achat et de vente immobilière",
    },
    {
      icon: "🔑",
      title: "Location & Gestion",
      description: "Gestion locative complète et recherche de biens en location",
    },
    {
      icon: "💰",
      title: "Estimation Gratuite",
      description: "Évaluation précise de votre bien par nos experts du marché local",
    },
    {
      icon: "⚖️",
      title: "Conseil Juridique",
      description: "Accompagnement juridique et administratif pour sécuriser vos transactions",
    },
  ];

  // Témoignages
  const testimonials = [
    {
      name: "Sophie Martin",
      text: "Excellent service ! L'équipe BARNES m'a aidée à trouver la villa parfaite à Marrakech. Professionnalisme et écoute au rendez-vous.",
      rating: 5,
    },
    {
      name: "Ahmed Benali",
      text: "Une agence de confiance avec une parfaite connaissance du marché local. Je recommande vivement leurs services.",
      rating: 5,
    },
    {
      name: "Marie Dubois",
      text: "Accompagnement exceptionnel de A à Z. L'équipe a su comprendre mes besoins et m'a proposé des biens de qualité.",
      rating: 5,
    },
  ];

  // Statistiques
  const stats = [
    { value: "500+", label: "Biens vendus" },
    { value: "8", label: "Années d'expérience" },
    { value: "95%", label: "Clients satisfaits" },
    { value: "24h", label: "Temps de réponse" },
  ];

  // Soumission du formulaire de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ville) params.append("ville", ville);
    if (type) params.append("type", type);
    if (budgetMin) params.append("budgetMin", budgetMin);
    if (budgetMax) params.append("budgetMax", budgetMax);
    if (mode === "acheter") params.append("statut", "À Vendre");
    if (mode === "louer") params.append("statut", "À Louer (Nuit)");
    if (mode === "louer_mois") params.append("statut", "À Louer (Mois)");
    navigate(`/biens?${params.toString()}`);
  };

  // Clic sur une catégorie
  const handleCategoryClick = (filter) => {
    const params = new URLSearchParams();
    if (filter.ville) params.append("ville", filter.ville);
    if (filter.type) params.append("type", filter.type);
    navigate(`/biens?${params.toString()}`);
  };

  return (
    <div className="client-home">
      <Header />
      <HeroSection
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
        onSearch={handleSearch}
        SearchBarComponent={SearchBar}
      />
      <StatsBlock stats={stats} />
      <AboutBlock />
      <CategoriesBlock filters={predefinedFilters} onCategoryClick={handleCategoryClick} />
      <ServicesBlock />
      <ContactUs testimonials={testimonials} />
      <Footer />
      <AdminAccessLink />
    </div>
  );
}

export default ClientHome;
