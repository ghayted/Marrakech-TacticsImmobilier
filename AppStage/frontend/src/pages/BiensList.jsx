import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';
import { BienListHero, BienListGrid, BienListFilter } from '../components/BienList';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function BiensList() {
  const query = useQuery();
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

  useEffect(() => {
    const fetchBiens = async () => {
      setLoading(true);
      let url = 'http://localhost:5257/api/BiensImmobiliers?';
      if (ville) url += `ville=${encodeURIComponent(ville)}&`;
      if (type) url += `typeDeBienNom=${encodeURIComponent(type)}&`;
      if (budgetMin !== '' && !isNaN(Number(budgetMin))) url += `prixMin=${encodeURIComponent(budgetMin)}&`;
      if (budgetMax !== '' && !isNaN(Number(budgetMax))) url += `prixMax=${encodeURIComponent(budgetMax)}&`;
      if (search) url += `recherche=${encodeURIComponent(search)}&`;
      if (tri) url += `triParPrix=${tri}&`;
      if (statut) url += `statut=${encodeURIComponent(statut)}&`;
      if (quartier) url += `quartier=${encodeURIComponent(quartier)}&`;
      const res = await fetch(url);
      const data = await res.json();
      setBiens(data);
      setLoading(false);
    };
    fetchBiens();
  }, [ville, type, budgetMin, budgetMax, search, tri, statut, quartier]);

  const handleFilter = (e) => {
    e.preventDefault();
    const newQuery = new URLSearchParams(useLocation().search);
    if (type) newQuery.set('type', type);
    if (quartier) newQuery.set('quartier', quartier);
    if (budgetMin) newQuery.set('budgetMin', budgetMin);
    if (budgetMax) newQuery.set('budgetMax', budgetMax);
    if (search) newQuery.set('advancedSearch', search);
    if (tri) newQuery.set('triParPrix', tri);
    if (statut) newQuery.set('statut', statut);
    window.history.pushState({}, '', `${window.location.pathname}?${newQuery.toString()}`);
    fetchBiens();
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
      />
      <BienListGrid biens={biens} loading={loading} />
      <Footer />
    </div>
  );
}

export default BiensList; 