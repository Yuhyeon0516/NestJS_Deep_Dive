import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  detail: string;

  @IsNotEmpty()
  directorId: number;

  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  genreIds: number[];
}
