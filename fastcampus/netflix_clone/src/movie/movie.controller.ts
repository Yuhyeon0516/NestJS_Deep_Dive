import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Request,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/user/entity/user.entity';
import { GetMoviesDto } from './dto/get-movies.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MovieFilePipe } from './pipe/movie-file.pipe';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Public()
  getMovies(@Query() dto: GetMoviesDto) {
    return this.movieService.findAll(dto);
  }

  @Get(':id')
  @Public()
  getMovie(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.movieService.findOne(id);
  }

  @Post()
  @RBAC(Role.admin)
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'movie',
          maxCount: 1,
        },
        {
          name: 'poster',
          maxCount: 2,
        },
      ],
      {
        limits: {
          fileSize: 20000000,
        },
        fileFilter(req, file, callback) {
          if (file.mimetype !== 'video/mp4') {
            // false이면 파일 안받음
            return callback(
              new BadRequestException('mp4 형식의 파일만 업로드 가능합니다.'),
              false,
            );
          }
          return callback(null, true);
        },
      },
    ),
  )
  postMovie(
    @Body() body: CreateMovieDto,
    @Request() req,
    @UploadedFile(
      new MovieFilePipe({
        maxSize: 20,
        mimeType: 'video/mp4',
      }),
    )
    movie: Express.Multer.File,
  ) {
    return this.movieService.create(body, movie.filename, req.queryRunner);
  }

  @Patch(':id')
  @RBAC(Role.admin)
  patchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto,
    @Request() req,
  ) {
    return this.movieService.update(id, body, req.queryRunner);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }
}
