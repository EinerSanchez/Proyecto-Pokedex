// src/components/PokemonCard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Pokemon, PokemonListResult } from '../types/pokemon';
import { extractPokemonId } from '../utils/extracId';

interface Props {
  pokemonInfo: PokemonListResult;
  onClick: (pokemon: Pokemon) => void;
}

const PokemonCard: React.FC<Props> = ({ pokemonInfo, onClick }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isCapturado, setIsCapturado] = useState(false);
  const [pokemonId, setPokemonId] = useState<number | null>(null);

  // Obtener los datos del Pokémon y verificar su estado
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        // Obtener datos del Pokémon desde PokeAPI
        const response = await axios.get<Pokemon>(pokemonInfo.url);
        setPokemon(response.data);
        
        const no = extractPokemonId(pokemonInfo.url);
        setPokemonId(no);
        
        // Verificar si ya está capturado
        await checkPokemonStatus(no);
      } catch (error) {
        console.error('Error al obtener datos del Pokémon:', error);
      }
    };
    fetchPokemonData();
  }, [pokemonInfo.url]);

  const checkPokemonStatus = async (no: number) => {
    try {
      const response = await axios.get<{status: string}>(`http://localhost:3000/api/v2/pokemon/status/${no}`);
      setIsCapturado(response.data.status === 'Capturado');
    } catch (error) {
      console.error('Error al verificar estado:', error);
      setIsCapturado(false);
    }
  };

  // Manejador de click: registra en BD Y navega al detalle
  const handleClick = async () => {
    if (!pokemon || !pokemonId) return;

    const dto = {
      no: pokemonId,
      name: pokemon.name,
    };

    try {
      // 1. Primero registra en la base de datos (solo si no está capturado)
      if (!isCapturado) {
        await axios.post('http://localhost:3000/api/v2/pokemon', dto, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log(`Registrado: #${dto.no} ${dto.name}`);
        setIsCapturado(true); // Actualizar estado local
      }
      
      // 2. Navegar al detalle
      onClick(pokemon);
      
    } catch (error) {
      console.error('Error al registrar en la base de datos:', error);
      // Aún así mostramos el detalle aunque falle el registro
      onClick(pokemon);
    }
  };

  if (!pokemon) {
    return <div className="pokemon-card">Cargando...</div>;
  }

  return (
    <div 
      className={`pokemon-card ${isCapturado ? 'capturado' : ''}`}
      onClick={handleClick}
    >
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      {isCapturado && <span className="status-badge">Capturado</span>}
    </div>
  );
};

export default PokemonCard;