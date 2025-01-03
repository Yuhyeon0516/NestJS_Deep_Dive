import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';
import { Movie } from 'src/movie/entity/movie.entity';
import { Repository } from 'typeorm';
import { DefaultLogger } from './logger/default.logger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TasksService {
  // private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly schedulerRegistry: SchedulerRegistry,
    // private readonly logger: DefaultLogger,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  // @Cron('* * * * * *')
  logEverySecond() {
    // fatal < - > verbose
    // verbose로 갈 수록 중요도가 낮음
    this.logger.fatal('Fatal', null, TasksService.name);
    this.logger.error('Error', null, TasksService.name);
    this.logger.warn('Warn', TasksService.name);
    this.logger.log('Log', TasksService.name);
    this.logger.debug('Debug', TasksService.name);
    this.logger.verbose('Verbose', TasksService.name);
  }

  // @Cron('* * * * * *')
  async eraseOrphanFiles() {
    const files = await readdir(join(process.cwd(), 'public', 'temp'));

    const deleteFilesTargets = files.filter((file) => {
      const fileName = parse(file).name;

      const split = fileName.split('_');

      if (split.length !== 2) {
        return true;
      }

      try {
        const date = +new Date(parseInt(split[split.length - 1]));
        const aDayInMiliSec = 24 * 60 * 60 * 1000;

        const now = +new Date();

        return now - date > aDayInMiliSec;
      } catch (error) {
        return true;
      }
    });

    await Promise.all([
      deleteFilesTargets.map((x) =>
        unlink(join(process.cwd(), 'public', 'temp', x)),
      ),
    ]);
  }

  // @Cron('0 * * * * *')
  async calculateMovieLikeCounts() {
    await this.movieRepository.query(`
UPDATE movie m
SET "likeCount" = (
	SELECT count(*) FROM movie_user_like mul
	WHERE m.id = mul."movieId" AND mul."isLike" = true
)`);
    await this.movieRepository.query(
      `
UPDATE movie m
SET "dislikeCount" = (
SELECT count(*) FROM movie_user_like mul
WHERE m.id = mul."movieId" AND mul."isLike" = false
)
`,
    );
  }

  // @Cron('* * * * * *', {
  //   name: 'printer',
  // })
  printer() {
    console.log('print every seconds');
  }

  // @Cron('*/5 * * * * *')
  stopper() {
    console.log('---stoppper run---');

    const job = this.schedulerRegistry.getCronJob('printer');

    console.log('# Last Date');
    console.log(job.lastDate());
    console.log('# Next Date');
    console.log(job.nextDate());
    console.log('# Next Dates');
    console.log(job.nextDates(5));

    if (job.running) {
      job.stop();
    } else {
      job.start();
    }
  }
}
