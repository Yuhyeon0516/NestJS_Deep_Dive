import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PagePaginationDto } from './dto/page-pagination.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ObjectCannedACL, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { envVariablesKeys } from './const/env.const';

@Injectable()
export class CommonService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get<string>(envVariablesKeys.awsAccessKeyId),
        secretAccessKey: configService.get<string>(
          envVariablesKeys.awsSecretAccessKey,
        ),
      },

      region: configService.get<string>(envVariablesKeys.awsRegion),
    });
  }

  async createPresingedUrl(expiresIn = 300) {
    const params = {
      Bucket: this.configService.get<string>(envVariablesKeys.bucketName),
      Key: `public/temp/${uuid()}.mp4`,
      ACL: ObjectCannedACL.public_read,
    };

    try {
      const url = await getSignedUrl(this.s3, new PutObjectCommand(params), {
        expiresIn,
      });

      return url;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('S3 Presinged URL 생성 실패');
    }
  }

  async saveMovieToPermanentStorage(fileName: string) {
    try {
      const bucketName = this.configService.get<string>(
        envVariablesKeys.bucketName,
      );

      await this.s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/public/temp/${fileName}`,
        Key: `public/movie/${fileName}`,
        ACL: 'public-read',
      });

      await this.s3.deleteObject({
        Bucket: bucketName,
        Key: `public/temp/${fileName}`,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('S3 Error');
    }
  }

  applyPagePaginationParamsToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: PagePaginationDto,
  ) {
    const { take, page } = dto;

    if (take && page) {
      const skip = (page - 1) * take;

      qb.take(take);
      qb.skip(skip);
    }
  }

  async applyCursorPaginationParamsToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: CursorPaginationDto,
  ) {
    let { order, cursor, take } = dto;

    // if (id) {
    //   const direction = order === 'ASC' ? '>' : '<';

    //   qb.where(`${qb.alias}.id ${direction} :id`, { id });
    // }

    // qb.orderBy(`${qb.alias}.id`, order);

    if (cursor) {
      const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
      const cursorObject = JSON.parse(decodedCursor);

      order = cursorObject.order;

      const { values } = cursorObject;

      const columns = Object.keys(values);
      const comparisonOperator = order.some((o) => o.endsWith('DESC'))
        ? '<'
        : '>';

      const whereConditions = columns.map((c) => `${qb.alias}.${c}`).join(',');
      const whereParams = columns.map((c) => `:${c}`).join(',');

      qb.where(
        `(${whereConditions}) ${comparisonOperator} (${whereParams})`,
        values,
      );
    }

    for (let i = 0; i < order.length; i++) {
      const [column, direction] = order[i].split('_');

      if (direction !== 'ASC' && direction !== 'DESC') {
        throw new BadRequestException(
          'Order는 ASC 또는 DESC으로 입력해주세요.',
        );
      }

      if (i === 0) {
        qb.orderBy(`${qb.alias}.${column}`, direction);
      } else {
        qb.addOrderBy(`${qb.alias}.${column}`, direction);
      }
    }

    qb.take(take);

    const results = await qb.getMany();
    const nextCursor = this.generateNextCursor(results, order);

    return { qb, nextCursor };
  }

  generateNextCursor<T>(results: T[], order: string[]): string | null {
    if (results.length === 0) return null;

    const lastItem = results[results.length - 1];

    const values = {};

    order.forEach((columnOrder) => {
      const [column] = columnOrder.split('_');

      values[column] = lastItem[column];
    });

    const cursorObject = { values, order };
    const nextCursor = Buffer.from(JSON.stringify(cursorObject)).toString(
      'base64',
    );

    return nextCursor;
  }
}
