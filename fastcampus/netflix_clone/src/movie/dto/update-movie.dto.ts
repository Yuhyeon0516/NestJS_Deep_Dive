import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @IsNotEmpty()
  @IsOptional()
  directorId?: number;

  @ArrayNotEmpty()
  @IsOptional()
  @IsNumber({}, { each: true })
  genreIds?: number[];
}
