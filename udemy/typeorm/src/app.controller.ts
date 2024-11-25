import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
  IsNull,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('sample')
  async sample() {
    // ---------- create ----------
    // 모델에 해당되는 객체 생성(저장은 안함)
    // const user1 = this.userRepository.create({ email: 'asdf@google.com' });
    // ---------- save ----------
    // 모델에 해당되는 객체를 저장함
    // const user2 = await this.userRepository.save({ email: 'asdf@google.com' });
    // ---------- preload ----------
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함(저장은 안함)
    // const user3 = await this.userRepository.preload({
    //   id: 1,
    //   email: 'zxcv@google.com',
    // });
    // ---------- delete ----------
    // PrimaryColumn에 해당하는 값을 넘겨주면 해당 row가 삭제됨
    // await this.userRepository.delete(1);
    // ---------- increment ----------
    // 원하는 row에 원하는 값을 상승시킴
    // increment(filterObject, 상승시킬 column, 상승시킬 값)
    // 아래 예시는 id가 2인 row에 count를 2만큼 상승
    // await this.userRepository.increment(
    //   {
    //     id: 2,
    //   },
    //   'count',
    //   2,
    // );
    // ---------- decrment ----------
    // increment와 반대로 값을 감소시킴
    // await this.userRepository.decrement(
    //   {
    //     id: 2,
    //   },
    //   'count',
    //   1,
    // );
    // ---------- count ----------
    // 조건에 부합하는 row가 몇개인지 확인
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });
    // ---------- sum ----------
    // 값의 합을 구함
    // sum(합을 구할 column, filterObject)
    // 아래 예시는 email에 '0'이 들어가는 row들의 count 합을 구함
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });
    // ---------- average ----------
    // 값의 평균을 구함
    // average(평균을 구할 column, filterObject)
    // 아래 예시는 id가 4보다 작은 row들의 count 값으 평균을 구함
    // const average = await this.userRepository.average('count', {
    //   id: LessThan(4)
    // })
    // ---------- minimum ----------
    // 값의 최소값을 구함
    // minimum(최소갑을 구할 column, filterObject)
    // 아래 예시는 id가 4보다 작은 row 중 count의 최소값
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4)
    // })
    // ---------- maximum ----------
    // 값의 최대값을 구함
    // maximum(최대갑을 구할 column, filterObject)
    // 아래 예시는 id가 4보다 작은 row 중 count의 최대값
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });
    // ---------- findAndCount ----------
    // 원하는 개수만큼의 값과 전체 개수가 몇개인지도 같이 전달해줌
    // 아래 예시는 만약 100개의 users가 있다면 3개의 user 정보를 전달해주면서 마지막에 user 전체의 개수도 전달해줌
    // 주로 Pagination에 사용됨
    // const usersAndCount = await this.userRepository.findAndCount({
    //   take: 3,
    // });
  }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
  }

  @Get('users')
  getUser() {
    return this.userRepository.find({
      order: {
        id: 'ASC',
      },
      // ------------- relations -------------
      // 가져오고 싶은 relation을 입력
      // relations: {
      //   profile: true,
      //   posts: true,
      // },
      // ------------- select -------------
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져옴
      // select를 정의하게되면 정의한 프로퍼티만 가져옴
      // select: {
      //   id: true,
      //   createdAt: true,
      //   updatedAt: true,
      // },
      // ------------- where -------------
      // 필터링할 조건을 입력
      // 아래와 같이 객체에 여러 조건을 입력하면 and조건으로 모두 일치할때만 가져옴
      // where: {
      //   id: 2,
      // },
      // 그래서 아래와 같이 배열에 객체의 조건을 입력하면 or조건으로 하나라도 일치하면 가져옴
      // where: [
      //   {
      //     id: 2,
      //   },
      //   {
      //     version: 1,
      //   },
      // ],
      // 아래와 같이 typeorm의 util을 사용도 할 수 있음
      // where: {
      // ---------- 아닌 경우 ----------
      // id가 1이 아닌 값
      // id: Not(1),
      // ---------- 작은 경우 ----------
      // id 30보다 작은 경우
      // id: LessThan(30)
      // ---------- 작거나 같은 경우 ----------
      // id가 30보다 작거나 같은 경우
      // id: LessThanOrEqual(30)
      // ---------- 큰 경우 ----------
      // id가 30보다 큰 경우
      // id: MoreThan(30)
      // ---------- 크거나 같은 경우 ----------
      // id가 30보다 크거나 같은 경우
      // id: MoreThanOrEqual(30),
      // ---------- 같은 경우 ----------
      // id가 30과 같은 경우(일반적으로 숫자 넣는것과 같음)
      // id: Equal(30)
      // ---------- 유사값 ----------
      // 대소문자를 구분하여 ~google~과 유사한 값을 찾음(%는 어떤 글자가 와도 상관없다는 뜻)
      // email: Like('%google%'),
      // 대소문자 구분없이 ~GOOGLE~과 유사한 값을 찾음)
      // email: ILike('%GOOGLE%'),
      // ---------- 사이 값 ----------
      // 10~15에 해당하는 값만
      // id: Between(10, 15),
      // ---------- 해당하는 여러 값 ----------
      // 배열에 있는 값에 해당되는 여러 값만
      // id: In([1, 3, 5, 7, 9]),
      // ---------- 값이 null인 경우 ----------
      // id: IsNull(),
      // },
      // ------------- order -------------
      // DESC(내림차), ASC(오름차)를 정할수있음
      // order: {
      //   id: 'ASC',
      // },
      // ------------- skip -------------
      // 처음 몇개를 제외할지
      // skip: 1,
      // ------------- take -------------
      // 몇개를 가져올지
      // 기본값은 0이고 테이블의 전체를 가져옴
      // take: 1,
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    // cascade가 false이면 아래와 같이 model별로 따로 생성하여 relation을 연동해야함
    const user = await this.userRepository.save({
      email: 'asdf@google.com',
    });

    await this.profileRepository.save({
      profileImg: 'asdf.jpg',
      user,
    });

    // cascade가 true라면 아래와 같이 relation까지 동시에 생성 가능함
    // const user = await this.userRepository.save({
    //   email: 'asdf@google.com',
    //   profile: {
    //     profileImg: 'asdf.jpg',
    //   }
    // });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@google.com',
    });

    await this.postRepository.save({
      title: 'post 1',
      author: user,
    });

    await this.postRepository.save({
      title: 'post 2',
      author: user,
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    // ManyToMany는 양쪽에서 어떻게든 생성 가능함
    const post1 = await this.postRepository.save({
      title: 'NestJS',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post1],
    });

    await this.postRepository.save({
      title: 'NextJS',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
