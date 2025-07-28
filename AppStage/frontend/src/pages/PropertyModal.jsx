// src/components/PropertyModal.jsx
import { useState, useEffect } from 'react';
import './PropertyModal.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

function PropertyModal({ bienInitial, onClose, onSave }) {
  const [bien, setBien] = useState({});
  const [activeTab, setActiveTab] = useState('generales');
  const token = localStorage.getItem('authToken');
  const backendUrl = "http://localhost:5257";

  useEffect(() => {
    const initialState = bienInitial || {
      titre: '', description: '', prix: 0, adresse: '', ville: '', surface: 0,
      nombreDeChambres: 0, nombreDeSallesDeBain: 0, nombreDeSalons: 1, nombreDeCuisines: 1,
      latitude: 0, longitude: 0, typeDeBienId: 1, statutTransaction: 'À Vendre',
      amenagementIds: [], ImageUrls: []
    };
    
    // Si on modifie un bien existant, on prépare les données
    if (bienInitial) {
      initialState.amenagementIds = bienInitial.amenagements?.map(a => a.id) || [];
      initialState.ImageUrls = bienInitial.imagesBiens?.map(img => img.urlImage) || [];
    }
    
    setBien(initialState);
  }, [bienInitial]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setBien(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(bien); // Appelle la fonction de sauvegarde du parent
  };

  // Liste statique des aménagements (même que dans AdminDashboard)
  const AMENAGEMENTS = [
    { id: 1, nom: "Jardin" },
    { id: 2, nom: "Piscine" },
    { id: 3, nom: "Garage" },
    { id: 4, nom: "Balcon" },
    { id: 5, nom: "Terrasse" },
    { id: 6, nom: "Climatisation" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>{bien.id ? "Modifier le bien" : "Créer un nouveau bien immobilier"}</h2>
            <p className="modal-subtitle">Remplissez les informations du bien</p>
          </div>
          <button onClick={onClose} className="close-button">&times;</button>
        </header>
        <div className="modal-body">
          <div className="tabs">
            <button type="button" className={`tab ${activeTab === 'generales' ? 'active' : ''}`} onClick={() => setActiveTab('generales')}>Informations générales</button>
            <button type="button" className={`tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Détails</button>
            <button type="button" className={`tab ${activeTab === 'localisation' ? 'active' : ''}`} onClick={() => setActiveTab('localisation')}>Localisation</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="tab-content">
              {activeTab === 'generales' && (
                <div className="form-grid">
                  <div className="form-group"><label>Titre</label><input type="text" name="titre" placeholder="Titre du bien" value={bien.titre || ''} onChange={handleChange} /></div>
                  <div className="form-group"><label>Prix (€)</label><input type="number" name="prix" value={bien.prix || 0} onChange={handleChange} /></div>
                  <div className="form-group full-width"><label>Description</label><textarea name="description" placeholder="Description du bien" value={bien.description || ''} onChange={handleChange} rows="4"></textarea></div>
                  <div className="form-group"><label>Type de bien</label><select name="typeDeBienId" value={bien.typeDeBienId || 1} onChange={handleChange}><option value="1">Villa</option><option value="2">Appartement</option><option value="3">Maison</option><option value="4">Studio</option></select></div>
                  <div className="form-group"><label>Statut</label><select name="statutTransaction" value={bien.statutTransaction || 'À Vendre'} onChange={handleChange}><option value="À Vendre">À Vendre</option><option value="À Louer">À Louer</option></select></div>
                </div>
              )}
              {activeTab === 'details' && (
                <div className="form-grid">
                   <div className="form-group"><label>Surface (m²)</label><input type="number" name="surface" value={bien.surface || 0} onChange={handleChange} /></div>
                   <div className="form-group"><label>Chambres</label><input type="number" name="nombreDeChambres" value={bien.nombreDeChambres || 0} onChange={handleChange} /></div>
                   <div className="form-group"><label>Salles de bain</label><input type="number" name="nombreDeSallesDeBain" value={bien.nombreDeSallesDeBain || 0} onChange={handleChange} /></div>
                   <div className="form-group"><label>Salons</label><input type="number" name="nombreDeSalons" value={bien.nombreDeSalons || 0} onChange={handleChange} /></div>
                </div>
              )}
              {/* Ajout des aménagements dans l'onglet détails */}
              {activeTab === 'details' && (
                <div className="form-group full-width">
                  <label>Aménagements</label>
                  <div className="amenagements-checkboxes" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px 24px',
                    alignItems: 'center',
                    marginTop: 8
                  }}>
                    {AMENAGEMENTS.map(a => (
                      <label key={a.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontWeight: 500,
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          value={a.id}
                          checked={bien.amenagementIds?.includes(a.id) || false}
                          onChange={e => {
                            const id = a.id;
                            setBien(prev => ({
                              ...prev,
                              amenagementIds: e.target.checked
                                ? [...(prev.amenagementIds || []), id]
                                : (prev.amenagementIds || []).filter(x => x !== id)
                            }));
                          }}
                          style={{ accentColor: '#14b8a6', width: 18, height: 18 }}
                        />
                        {a.nom}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'localisation' && (
                <div className="form-grid">
                    <div className="form-group full-width"><label>Adresse</label><input type="text" name="adresse" placeholder="Adresse complète" value={bien.adresse || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>Ville</label><input type="text" name="ville" placeholder="Ville" value={bien.ville || ''} onChange={handleChange} /></div>
                </div>
              )}
              {/* Ajout de la carte dans l'onglet localisation */}
              {activeTab === 'localisation' && (
                <div style={{ margin: '16px 0' }}>
                  <label>Localisation sur la carte</label>
                  <MapContainer
                    center={[bien.latitude || 31.63, bien.longitude || -8.01]}
                    zoom={13}
                    style={{ height: 250, width: '100%', borderRadius: 8, marginTop: 8 }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <Marker
                      position={[bien.latitude || 31.63, bien.longitude || -8.01]}
                      draggable={true}
                      eventHandlers={{
                        dragend: (e) => {
                          const { lat, lng } = e.target.getLatLng();
                          setBien(prev => ({ ...prev, latitude: lat, longitude: lng }));
                        }
                      }}
                    />
                  </MapContainer>
                </div>
              )}
            </div>
            {/* Bloc gestion des images (toujours visible en bas du formulaire) */}
            <div className="form-group full-width">
              <label>Images du bien</label>
              {/* Affichage des images existantes en miniatures côte à côte */}
              <div className="images-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                {(bien.ImageUrls || []).map((url, idx) => {
                  const fullUrl = url.startsWith('http') ? url : backendUrl + url;
                  return (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={fullUrl} alt="img" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee', boxShadow: '0 1px 4px #0001' }} />
                      <button type="button" style={{ position: 'absolute', top: 2, right: 2, color: 'red', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                        title="Supprimer cette image"
                        onClick={() => setBien(prev => ({
                          ...prev,
                          ImageUrls: prev.ImageUrls.filter((_, i) => i !== idx)
                        }))}>
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* Upload de fichiers depuis le PC */}
              <div style={{ marginTop: 16, padding: 16, border: '2px dashed #ddd', borderRadius: 8, textAlign: 'center' }}>
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
                  <span style={{ color: '#666' }}>Cliquez ici pour choisir des images depuis votre PC</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const uploadToCloudinary = async (file) => {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("upload_preset", "default"); // Ton preset unsigned
                        const res = await fetch(
                          "https://api.cloudinary.com/v1_1/ds2h1vtel/image/upload",
                          { method: "POST", body: formData }
                        );
                        if (!res.ok) throw new Error("Erreur upload Cloudinary");
                        const data = await res.json();
                        return data.secure_url;
                      };
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;
                      try {
                        const uploadedUrls = [];
                        for (const file of files) {
                          const url = await uploadToCloudinary(file);
                          uploadedUrls.push(url);
                        }
                        setBien(prev => ({
                          ...prev,
                          ImageUrls: [...(prev.ImageUrls || []), ...uploadedUrls]
                        }));
                      } catch (error) {
                        console.error('Erreur upload:', error);
                        alert('Erreur lors de l\'upload des images');
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
            <footer className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
              <button type="submit" className="btn-primary">{bien.id ? "Sauvegarder" : "Créer le bien"}</button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PropertyModal;