import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';

export class PaginatePostDto {
  // 이전 마지막 데이터의 id
  // 이 id보다 높은 id를 가져오기
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number = 0;

  // 정렬
  // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt?: FindOptionsOrderValue = 'ASC';

  // 몇개의 데이터를 가져올지
  @IsNumber()
  @IsOptional()
  take?: number = 20;
}
