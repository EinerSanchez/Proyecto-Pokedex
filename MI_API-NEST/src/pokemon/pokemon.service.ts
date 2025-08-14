import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  // 1. Inyectamos el modelo de Mongoose en el constructor
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  // 2. Método 'create' adaptado a Mongoose
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      // Intentamos crear el pokémon en la base de datos
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      // Manejo de error si el pokémon ya existe (asumiendo un índice único en el 'id' o 'name')
      if (error.code === 11000) {
        throw new BadRequestException(`El Pokémon con los datos proporcionados ya existe.`);
      }
      throw error;
    }
  }

  // 3. Método 'checkStatus' que usa 'findOne' de Mongoose
 async checkStatus(no: number): Promise<{ status: string }> {
  // Buscamos un documento que coincida con el campo 'no' de la PokeAPI
  const pokemonExistente = await this.pokemonModel.findOne({ no: no });

  if (pokemonExistente) {
    return { status: 'Capturado' };
  }
  
  return { status: 'No capturado' };
}

  findAll() {
    return this.pokemonModel.find().exec();
  }

  async findOne(id: number) {
    const pokemon = await this.pokemonModel.findOne({ id: id });
    if (!pokemon) {
      throw new NotFoundException(`Pokémon con ID "${id}" no encontrado.`);
    }
    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.pokemonModel.findOneAndUpdate({ id: id }, updatePokemonDto, { new: true });
    if (!pokemon) {
      throw new NotFoundException(`Pokémon con ID "${id}" no encontrado.`);
    }
    return pokemon;
  }

  async remove(id: number) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ id: id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokémon con ID "${id}" no encontrado.`);
    }
    return { message: `Pokémon con ID ${id} eliminado.` };
  }
}