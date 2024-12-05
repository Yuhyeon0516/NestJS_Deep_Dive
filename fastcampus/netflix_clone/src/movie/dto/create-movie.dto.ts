import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @IsNumber()
  directorId: number;

  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  genreIds: number[];

  @IsString()
  @IsNotEmpty()
  movieFileName: string;
}
