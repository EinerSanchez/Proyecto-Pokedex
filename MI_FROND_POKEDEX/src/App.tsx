import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import type { Pokemon, PokemonListResponse } from './types/pokemon.ts';
import './App.css';

const App: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonListResponse['results']>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get<PokemonListResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');
        setPokemonList(response.data.results);
      } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
      }
    };
    
    fetchPokemonList();
  }, []);

  const handleCardClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleBackClick = () => {
    setSelectedPokemon(null);
  };

  // Filtrar pokémon por nombre
  const filteredList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Mi Pokédex</h1>

      {!selectedPokemon && (
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            marginBottom: '20px',
            width: '100%',
            maxWidth: '400px'
          }}
        />
      )}

      {selectedPokemon ? (
        <PokemonDetail pokemon={selectedPokemon} onBack={handleBackClick} />
      ) : (
        <div className="pokemon-grid">
          {filteredList.map(pokemon => (
            <PokemonCard 
              key={pokemon.name} 
              pokemonInfo={pokemon} 
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
