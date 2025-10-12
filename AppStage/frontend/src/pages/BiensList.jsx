import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';
import { BienListHero, BienListGrid, BienListFilter } from '../components/BienList';
import { apiRequest } from '../config/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function BiensList() {
  const query = useQuery();
  const location = useLocation();
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(query.get('type') || '');
  const [budgetMin, setBudgetMin] = useState(query.get('budgetMin') || '');
  const [budgetMax, setBudgetMax] = useState(query.get('budgetMax') || '');
  const [search, setSearch] = useState(query.get('advancedSearch') || '');
  const [tri, setTri] = useState(query.get('triParPrix') || '');
  const statut = query.get('statut');
  const ville = query.get('ville') || 'Marrakech';
  const [quartier, setQuartier] = useState(query.get('quartier') || '');
  
  // Nouveaux états pour la sélection de dates
  const [selectedDates, setSelectedDates] = useState(null);
  const [dateFilterApplied, setDateFilterApplied] = useState(false);
  
  // Détecter le mode de transaction depuis l'URL
  const isLouerModeNuit = statut === 'À Louer (Nuit)';
  const isLouerModeMois = statut === 'À Louer (Mois)';

  // Initialiser les dates depuis l'URL au chargement
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');
    const nombreVoyageurs = parseInt(searchParams.get('nombreVoyageurs') || '1');
    
    if (dateDebut && dateFin) {
      setSelectedDates({
        dateDebut,
        dateFin,
        nombreVoyageurs
      });
      setDateFilterApplied(true);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchBiens = async () => {
      setLoading(true);
      let url = '/api/BiensImmobiliers?';
      if (ville) url += `ville=${encodeURIComponent(ville)}&`;
      if (type) url += `typeDeBienNom=${encodeURIComponent(type)}&`;
      if (budgetMin !== '' && !isNaN(Number(budgetMin))) url += `prixMin=${encodeURIComponent(budgetMin)}&`;
      if (budgetMax !== '' && !isNaN(Number(budgetMax))) url += `prixMax=${encodeURIComponent(budgetMax)}&`;
      if (search) url += `recherche=${encodeURIComponent(search)}&`;
      if (tri) url += `triParPrix=${tri}&`;
      if (statut) url += `statut=${encodeURIComponent(statut)}&`;
      if (quartier) url += `quartier=${encodeURIComponent(quartier)}&`;
      
      // Ajouter les paramètres de dates si sélectionnées ET si le mode est location par nuit
      if (selectedDates && dateFilterApplied && isLouerModeNuit) {
        url += `dateDebut=${encodeURIComponent(selectedDates.dateDebut)}&`;
        url += `dateFin=${encodeURIComponent(selectedDates.dateFin)}&`;
        url += `nombreVoyageurs=${selectedDates.nombreVoyageurs}&`;
      }
      
      try {
        const res = await apiRequest(url);
        if (res.ok) {
          const data = await res.json();
          setBiens(data);
        } else {
          console.error('Erreur lors de la récupération des biens');
          setBiens([]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setBiens([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBiens();
  }, [ville, type, budgetMin, budgetMax, search, tri, statut, quartier, selectedDates, dateFilterApplied, isLouerModeNuit]);

  const handleFilter = (e) => {
    e.preventDefault();
    console.log('🔍 [BiensList] handleFilter appelé');
    
    const newQuery = new URLSearchParams(location.search);
    if (type) newQuery.set('type', type);
    if (quartier) newQuery.set('quartier', quartier);
    if (budgetMin) newQuery.set('budgetMin', budgetMin);
    if (budgetMax) newQuery.set('budgetMax', budgetMax);
    if (search) newQuery.set('advancedSearch', search);
    if (tri) newQuery.set('triParPrix', tri);
    if (statut) newQuery.set('statut', statut);
    
    // Ajouter les dates si elles sont sélectionnées
    if (selectedDates && dateFilterApplied && isLouerModeNuit) {
      console.log('🔍 [BiensList] Ajout des dates au filtre:', selectedDates);
      newQuery.set('dateDebut', selectedDates.dateDebut);
      newQuery.set('dateFin', selectedDates.dateFin);
      newQuery.set('nombreVoyageurs', selectedDates.nombreVoyageurs);
    }
    
    const newUrl = `${location.pathname}?${newQuery.toString()}`;
    console.log('🔍 [BiensList] Navigation vers:', newUrl);
    navigate(newUrl, { replace: true });
  };

  const navigate = useNavigate();

  const handleDateSearch = (dates) => {
    console.log('🔍 [BiensList] handleDateSearch appelé avec:', dates);
    
    setSelectedDates(dates);
    setDateFilterApplied(true);
    
    // Mettre à jour l'URL avec les dates
    const newQuery = new URLSearchParams(location.search);
    newQuery.set('dateDebut', dates.dateDebut);
    newQuery.set('dateFin', dates.dateFin);
    newQuery.set('nombreVoyageurs', dates.nombreVoyageurs);
    
    // Utiliser navigate pour forcer une mise à jour de l'URL
    const newUrl = `${location.pathname}?${newQuery.toString()}`;
    console.log('🔍 [BiensList] Navigation vers:', newUrl);
    navigate(newUrl, { replace: true });
  };

  const resetDateFilter = () => {
    setSelectedDates(null);
    setDateFilterApplied(false);
    
    // Retirer les paramètres de dates de l'URL
    const newQuery = new URLSearchParams(useLocation().search);
    newQuery.delete('dateDebut');
    newQuery.delete('dateFin');
    newQuery.delete('nombreVoyageurs');
    window.history.pushState({}, '', `${window.location.pathname}?${newQuery.toString()}`);
  };

  return (
    <div className="bienslist-root">
      <Header />
      <BienListHero ville={ville} />
      
      
      <BienListFilter
        type={type} setType={setType}
        quartier={quartier} setQuartier={setQuartier}
        budgetMin={budgetMin} setBudgetMin={setBudgetMin}
        budgetMax={budgetMax} setBudgetMax={setBudgetMax}
        search={search} setSearch={setSearch}
        tri={tri} setTri={setTri}
        ville={ville}
        annoncesCount={biens.length}
        handleFilter={handleFilter}
        isLouerMode={isLouerModeNuit}
        onDateSearch={handleDateSearch}
        selectedDates={selectedDates ? [selectedDates.dateDebut, selectedDates.dateFin] : []}
      />
      <BienListGrid biens={biens} loading={loading} />
      <Footer />
    </div>
  );
}

export default BiensList; 