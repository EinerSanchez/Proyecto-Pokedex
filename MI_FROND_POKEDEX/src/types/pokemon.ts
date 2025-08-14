// src/types/pokemon.ts (VERSIÓN CORRECTA)

// Asegúrate de que 'export' esté aquí
export interface PokemonListResult {
  name: string;
  url:string;
}

// Y aquí también
export interface PokemonListResponse {
  results: PokemonListResult[];
}

// Y lo más importante, aquí
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
}