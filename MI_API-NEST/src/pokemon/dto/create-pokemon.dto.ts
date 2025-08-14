import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
  // isInt, isPositive, min 1
  @IsInt()
  @IsPositive()
  @Min(1) // comprueba si el número dado es mayor o igual al número que pasamos
  no: number;

  // isString, MinLength 1
  @IsString({ message: "El campo name debe ser un string" })
  @MinLength(2)
  name: string;
}
