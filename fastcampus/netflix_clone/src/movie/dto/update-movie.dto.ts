import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  // @IsNotEmpty()
  // @IsOptional()
  // title?: string;
  // @IsNotEmpty()
  // @IsOptional()
  // detail?: string;
  // @IsNotEmpty()
  // @IsOptional()
  // directorId?: number;
  // @ArrayNotEmpty()
  // @IsOptional()
  // @IsNumber({}, { each: true })
  // genreIds?: number[];
}
