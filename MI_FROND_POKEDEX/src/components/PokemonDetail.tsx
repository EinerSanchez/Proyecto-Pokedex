// src/components/PokemonDetail.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Pokemon } from '../types/pokemon.ts';

interface Props {
  pokemon: Pokemon;
  onBack: () => void;
}

const PokemonDetail: React.FC<Props> = ({ pokemon, onBack }) => {
  const [isCapturado, setIsCapturado] = useState(false);

  useEffect(() => {
    checkPokemonStatus();
  }, [pokemon.id]);

  const checkPokemonStatus = async () => {
    try {
      const response = await axios.get<{status: string}>(`http://localhost:3000/api/v2/pokemon/status/${pokemon.id}`);
      setIsCapturado(response.data.status === 'Capturado');
    } catch (error) {
      console.error('Error al verificar estado:', error);
      setIsCapturado(false);
    }
  };

  return (
    <div className={`pokemon-detail ${isCapturado ? 'capturado' : ''}`}>
      <button onClick={onBack}>&larr; Volver</button>
      <div className="pokemon-header">
        <h2>{pokemon.name}</h2>
        {isCapturado && <span className="status-badge-large">✓ Capturado</span>}
      </div>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h3>Información Esencial</h3>
      <p><strong>ID:</strong> {pokemon.id}</p>
      <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
      <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
      <p><strong>Tipos:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p><strong>Habilidades:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
      <p><strong>Estado:</strong> {isCapturado ? '✓ Capturado' : '○ No capturado'}</p>
    </div>
  );
};

export default PokemonDetail;