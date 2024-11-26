import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectorDto } from './create-director.dto';

export class UpdateDirectorDto extends PartialType(CreateDirectorDto) {
  // @IsNotEmpty()
  // @IsOptional()
  // name?: string;
  // @IsNotEmpty()
  // @IsDateString()
  // @IsOptional()
  // dob?: Date;
  // @IsNotEmpty()
  // @IsOptional()
  // nationality?: string;
}
