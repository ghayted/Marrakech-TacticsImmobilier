import React from 'react';
import './StatsBlock.css'; // N'oubliez pas d'importer le CSS

function ContentBlock() {
  return (
    <div className="content-block-container">
      <h1 className="content-block-title">Agence Immobilière Marrakech TacTics</h1>
      <p className="content-block-subtitle">
      Installée depuis 2022 sur Marrakech, Marrakech Tactics vous accompagne désormais dans tous vos projets immobiliers dans la ville ocre.
      </p>
      <div className="content-block-main">
        <div className="content-block-text">
          <h2>Les propriétés de prestige à Marrakech</h2>
          <p>
          Votre<span className="highlight-text"> agence immobilière à Marrakech</span>, Marrakech TacTics vous propose une sélection de <span className="highlight-text">biens de prestige à vendre </span>dans les quartiers les plus prisés de la ville ocre au Maroc. Parmi les biens les plus recherchés pour un <span className="highlight-text">achat immobilier à Marrakech</span>, on retrouve :
          </p>
          <ul>
            <li><span className="highlight-text">les studios à vendre à Marrakech</span> dans le quartier de la Médina, traditionnels mais aussi modernes</li>
            <li><span className="highlight-text">les villas à vendre à Marrakech</span> situées à La Palmeraie, sur Golf Amelkis et sur Golf Royal Palm, avec piscine et grand jardin le plus souvent</li>
            <li><span className="highlight-text">les appartements à vendre à Marrakech</span> dans le centre-ville, notamment à Guéliz et à L'Hivernage</li>
            <li><span className="highlight-text">les terrains à vendre à Marrakech</span> dans les quartiers des plus belles villas évidemment, mais aussi Route de l'Ourika</li>
          </ul>
          <p>
            Perle du Maghreb, Marrakech est aujourd’hui un lieu extrêmement prisé, pour sa culture, son art de vivre, son architecture et son effervescence économique grandissante. Toute l'année, entre traditions et modernité, Marrakech est la promesse de sensations incomparables grâce à des manifestations qui animent les quartiers de la ville de jour comme de nuit.
          </p>
          <p>
            Cela explique pourquoi les acquéreurs français et internationaux avisés gardent régulièrement un œil sur les magnifiques propriétés de prestige qui y sont mises en vente en vue d'investir. Parmi elles, avec leurs vastes séjours et leurs grands extérieurs, les villas marocaines et les riads traditionnels illustrent à la perfection tout le cachet et le raffinement du Maroc.
          </p>
          <p>
            Dans notre <span className="highlight-text">agence immobilière de luxe à Marrakech</span>, les meilleurs agents immobiliers et professionnels du secteur vous feront découvrir tous ces biens de caractère. Grâce à leur parfaite connaissance du marché immobilier marocain et marrakchi, vous serez accompagnés lors de l'achat ou la vente de votre bien immobilier et conseillés sur tous les aspects juridiques, fiscaux, financiers et réglementaires.
          </p>
          <p>
            Nous vous proposons également une sélection de magnifiques appartements et villas en location longue durée à Marrakech, et de charmantes propriétés en location saisonnière à Marrakech pour passer des vacances de rêve avec piscine, sauna, jacuzzi, et grand jardin.
          </p>
        </div>
        <div className="content-block-image-wrapper">
          <img
            src="https://www.barnes-marrakech.com/images/intro.jpg"
            alt="Palais avec piscine à Marrakech"
            className="content-block-image"
          />
          <p className="image-caption">Marrakech, La Perle Du Maghreb</p>
        </div>
      </div>
    </div>
  );
}

export default ContentBlock;