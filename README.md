# NestJS_Deep_Dive

### NestJS Start Sequence(Not use CLI)

-   사실 NestJS CLI를 사용하면 금방 편하게 구축을 할 수 있지만, CLI가 동작하는 방식을 배우기 위해 비어있는 폴더 상태에서 시작하려고한다.
-   `mkdir 폴더명`명령어로 폴더를 생성한다.
-   `cd 폴더명`명령어를 통해 해당 폴더로 들어간다.
-   `npm init -y`로 NodeJS를 초기화 시켜준다.
-   `npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata typescript`명령어로 dependency를 설치한다.
    -   `@nestjs`이름이 붙어있는 dependency들은 버젼이 같아야한다.
    -   `@nestjs/common`에는 Nest에 필요한 function, class와 같은 대부분의 기능들이 들어있음
    -   `@nestjs/platform-express`에는 Nest에서 HTTP 요청 처리를 위해 기본적으로 Express의 기능을 사용하는데 Nest와 연결해주는 dependency임(Fastify와 같은 다른 HTTP 통신에 도움을 주는 depencency도 사용이 가능하나 Express가 대중적임)
    -   `reflect-metadata`는 Nest를 사용하는것에 있어 데코레이터가 작동하도록 도움을 주는 기능
-   `tsconfig.json` 파일을 생성 후 typescript를 아래와 같이 설정해준다.
    ```json
    {
        "compilerOptions": {
            "module": "CommonJS",
            "target": "ES2017",
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true
        }
    }
    ```
-   `src`폴더 생성 후 내부에 `main.ts`파일을 생성하여 아래와 같은 구조로 `Controller`, `Module`, `Bootstrap`을 생성함(보통 `main.ts`에는 bootsctrap만 위치하게되며 `Controller`와 `Module`은 다른 폴더에 두고 `main.ts`에서 `import`해서 가져오는 형태를 취하지만 일단 임시로 작성함)

    ```javascript
    import { Controller, Module, Get } from "@nestjs/common";
    import { NestFactory } from "@nestjs/core";

    // Root Route에 Controller를 생성
    @Controller()
    class AppController {
        // Root Route에 Get Request가 발생하게되면 "Hi There"을 돌려줌
        @Get()
        getRootRoute() {
            return "Hi There";
        }
    }

    // 작성한 AppController를 AppModule에 상속시킴
    @Module({
        controllers: [AppController],
    })
    class AppModule {}

    // NestJS에서 실행되는 App을 실행시켜주는 함수의 이름은 보통 bootstrap으로 작성함
    async function bootstrap() {
        const app = await NestFactory.create(AppModule);

        // 4000번 Port에 NestJS App을 실행시키겠다.
        await app.listen(4000);
    }

    bootstrap();
    ```

-   `npx ts-node-dev src/main.ts`명령어를 이용하여 작성한 server를 동작시키면 `http://localhost:4000`에 server가 동작하게된다.

### NestJS Start Sequence(Use CLI)

-   `npm install -g @nestjs/cli`명령어로 `@nestjs/cli`를 설치
-   `nest new 프로젝트명`명령어를 실행 후 사용 할 package manager를 선택해주면 약 1분 후 project setting이 완료됨
-   이후 `npm run start:dev`를 하면 dev server가 지정한 port로 동작됨

### NestJS Theory

-   NestJS는 class 기반으로 작성하게될 예정

    ***

-   NestJS의 내부 구성은 Controllers, Services, Modules, Pipes, Filters, Guards, Interceptors, Repositories로 이루어져있음
    -   Controllers: HTTP Request를 처리함
    -   Services: Data에 접근하거나 관련 비지니스 로직을 처리함
    -   Modules: Code를 그룹화 할 때 사용됨
    -   Pipes: HTTP Request로 들어온 Data의 유효성 검사를 진행함
    -   Filters: HTTP Request중 발생하는 Error를 처리함
    -   Guards: Auth와 같은 보안이 필요한 상황에 사용됨
    -   Interceptors: HTTP Request 또는 Response에 Logic을 추가하여 응답함
    -   Repositories: DB에 저장되어있는 Data를 처리함
    ***
-   NestJS에서는 파일 명명법이 있음(아래 예시 참고)
    -   `AppController`라는 controller class를 만들고자한다면 `app.controller.ts`
    -   `AppModule`라는 module class를 만들고자한다면 `app.module.ts`
    -   즉 `name.type_of_thing.ts`의 형태를 가지게 됨
    -   NestJS에서는 이 명명법을 지키기 위해 `generate`라는 기능을 제공해줌
        -   `nest generate (type_of_thing) (name)`명령어를 입력하게되면 `src` 폴더내에 `name`폴더와 입력한 `type_of_thing`과 명명법에 맞춰 파일을 생성해줌
            -   ex: `nest generate module messages`를 입력하면 `src`폴더 내에 `messages`폴더를 생성하고 `messages`폴더내에 `messages.module.ts`파일을 생성해줌
        -   추가로 생성해놓은 module과 연결을 자동으로 하고싶다면 `nest generate (type_of_thing) (folder/module name) --flat`명령어를 진행하면됨
            -   ex: `nest generate controller messages/messages --flat`을 진행하면 `messages.controller.ts`가 생성되고 `messages.module.ts`에 controller가 자동으로 연결이 된다.
            -   `--flat`옵션을 제거하게되면 입력한 폴더내에 controller라는 폴더가 생성되고 그 안에 `(name).controller.ts`파일이 생성되게 된다.
    ***
-   NestJS Decorator의 종류

    -   사용 전 `tsconfig.json`에서 하기 항목이 `true`로 되어있는지 꼭 확인!
        ```json
        {
            "experimentalDecorators": true
        }
        ```
    -   Method decorator
        -   `@Get`: HTTP Get Method
        -   `@Post`: HTTP Post Method
        -   `@Delete`: HTTP Delete Method
        -   `@Patch`: HTTP Patch Method
    -   Arguments decorator
        -   `@Param("id)`: Url에서 특정 위치의 값을 가져올때 사용
        -   `@Query()`: Url에서 query string을 가져올때 사용
        -   `@Headers()`: Request에 같이 온 headers를 가져올때 사용
        -   `@Body()`: Request에 같이 온 body를 가져올때 사용

    ***

-   Validation Pipe

    -   Validation Pipe란 request 시 도착한 data가 유효한 data인지 검증을 해주는 기능을 함
    -   해당 기능을 적용하기 위해서는 `class-transformer`와 `class-validator`를 설치하여야한다.(`npm install class-transformer class-validator`)
    -   `src/main.ts`에 `app.useGlobalPipes(new ValidationPipe())`구문을 추가

        ```javascript
        import { NestFactory } from "@nestjs/core";
        import { MessagesModule } from "./messages/messages.module";
        import { ValidationPipe } from "@nestjs/common"; // <= add

        async function bootstrap() {
            const app = await NestFactory.create(MessagesModule);
            app.useGlobalPipes(new ValidationPipe()); // <= add
            await app.listen(3000);
        }
        bootstrap();
        ```

    -   검증 규칙을 추가하는 방법으로는 DTO(Data Transfer Object)를 생성 후 해당 검증 규칙을 적용할 argument에 type으로 만든 DTO를 적용하면된다.(아래 예시 참고)

        -   `src/messages/dtos/create-message.dto.ts`파일을 생성 후 request body로 전달 될 `content`가 `string` type이 맞는지 검증하기 위해 아래와 같이 작성한다.

            ```javascript
            import { IsString } from "class-validator";

            export class CreateMessageDto {
                @IsString()
                content: string;
            }
            ```

        -   작성한 DTO를 적용 할 controller에 아래와 같이 적용한다.

            ```javascript
            @Post()
            createMessages(@Body() body: CreateMessageDto) {
                console.log(body);
            }
            ```

        -   Test 진행 시 아래와 같이 HTTP response가 발생하게된다.

            -   Status 200(정상)
                ```json
                HTTP/1.1 201 Created
                X-Powered-By: Express
                Date: Wed, 03 Jan 2024 10:00:25 GMT
                Connection: close
                Content-Length: 0
                ```
            -   Status 400(비정상)

                ```json
                HTTP/1.1 400 Bad Request
                X-Powered-By: Express
                Content-Type: application/json; charset=utf-8
                Content-Length: 79
                ETag: W/"4f-JeosnzYSS4di/3R1CZ9l58bJ9D0"
                Date: Wed, 03 Jan 2024 09:50:03 GMT
                Connection: close

                {
                    "message": [
                        "content must be a string"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                }
                ```

        -   Typescript가 실행될 때 Javascript로 변환되면서 선언된 모든 type이 삭제되는데 이때 DTO가 보존되는 이유는?

            -   `tsconfig.json`에서 `emitDecoratorMetadata`항목이 `true`이면 Javascript로 변환될 때 type의 정보가 `metadata`의 `paramtypes`로 전달되며 해당 `metadata`를 이용하여 Javascript로 변환되어도 type의 추론이 가능해지게 됨(하기 Code는 Typescript -> Javascript로 변환 된 후의 Code)

                ```javascript
                __decorate(
                    [
                        (0, common_1.Post)(),
                        __param(0, (0, common_1.Body)()),
                        __metadata("design:type", Function),

                        // 여기 아래가 Type이 Javascript에 반영된 부분
                        __metadata("design:paramtypes", [
                            create_message_dto_1.CreateMessageDto,
                        ]),
                        // 여기 위
                        __metadata("design:returntype", void 0),
                    ],
                    MessagesController.prototype,
                    "createMessages",
                    null
                );
                ```

    ***

-   Service와 Repository

    -   보통은 repository를 먼저 만들고 거기에 service의 logic을 연결하는 방식으로 진행하게 됨
    -   Service와 repository도 명령어로 간단하게 생성이 가능하나 처음은 백지에서 시작해보기
        -   명령어로 시작하게되면
    -   `src/(name)`폴더에 `(name).service.ts`와 `(name).repository.ts`를 생성
    -   `src/(name)/(name).repository.ts`에 DB와 연관된 로직을 구성함
    -   `src/(name)/(name).service.ts`에 위에 작성한 repository와 연결하는 비지니스 로직을 작성
    -   이렇게보면 repository와 service가 중복된 동작을 하게 될 경우가 많을거같은데 왜 둘 다 필요한가?에 대한 의문이 들수있음
        -   추후 의존성 주입에 대해 알게되면 service의 존재 이유에 대해 알게 될것이니 넘어감

    ***

-   예외 처리

    -   NestJS에는 내장된 HTTP exception 함수들이 많이 있음(https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
    -   사용 예시는 아래처럼 예외 상황에 `throw new (내장함수)`를 하면 됨

        ```javascript
        @Get("/:id")
        async getMessage(@Param("id") id: any) {
            const message = await this.messagesService.findOne(id);

            if (!message) {
                throw new NotFoundException("메시지를 찾을 수 없습니다.");
            }

            return message;
        }
        ```

    -   Custom한 exception도 `HttpException`함수를 이용하여 만들 수 있음(아래 예시 참조)
        ```javascript
        @Get()
        async findAll() {
            try {
                await this.service.findAll()
            } catch (error) {
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: '커스텀 예외 처리입니다.',
                    }, HttpStatus.FORBIDDEN, {
                    cause: error
                });
            }
        }
        ```

    ***

-   의존성 주입(Dependency injection)

    -   NestJS에 의존성 주입이 왜 존재할까?
    -   Pipe, Controller, Service, Repository 등 각각에 의존성이 존재함
        -   예시로 현재 코드 구조만 보더라도 repository가 없다면 service가 동작하지 못함
    -   NestJS에서는 위와 같은 현상을 막기 위해 제어 역전 원칙(Inversion of control principle)을 따라야한다고 하고있음
        -   제어 역전 원칙이란 간단히 말하자면 "재사용 가능한 코드를 가지고싶다면 class 자체가 의존성을 가지면 안된다"라는 원칙임
    -   아래 예시 코드처럼 service class에서 새로운 repository를 생성함으로 의존성을 가지게 하면 안된다고 NestJS에서는 말하고있음
        ```javascript
        constructor() {
            this.messagesRepo = new MessagesRepository();
        }
        ```
    -   NestJS에서 2가지 예시를 들어주고있는데

        1. 조금 더 나은 코드(service를 생성할때 매개변수로 respository를 받아오게 하는것이나 MessagesRepository에 대한 의존성이 아직 남아있음)

            ```javascript
            export class MessagesService {
                messagesRepo: MessagesRepository;

                constructor(repo: MessagesRepository) {
                    this.messagesRepo = repo;
                }
            }
            ```

        2. 최고의 코드(repository에 대한 새로운 interface를 생성하여 MessagesRepository에 대한 의존성을 없앰)

            ```javascript
            interface Repository {
                findOne(id: string);
                findAll();
                create(content: string);
            }

            export class MEssagesService {
                messagesRepo: Repository;

                constructor(repo: Repository) {
                    this.messagesRepo = repo
                }
            }
            ```

    -   결국 service에 미리 정의해놓은 interface에 맞춰 repository를 준다면 "service는 잘 동작하게 될거야"라는 말
    -   하지만 이런 제어 역전 원칙에도 코드의 양이 늘어나게된다는 단점이 존재함
    -   NestJS에서는 DI Container를 적용함으로 위와 같은 현상을 제거하려고함
        -   DI Container란 의존성 주입이 필요한 class를 모두 모아놓은 container라고 생각하면됨
        -   이 DI Container에 한번 선언해두고 의존성이 필요한 부분은 다시 생성하면서 의존성을 가지게하는것이 아닌 conatiner에서 꺼내와 재사용함으로써 의존성을 가지지 않게함
    -   DI Container에 등록하기 위해 NestJS에서는 `Injectable`이라는 데코레이터를 제공해줌
        -   `@Injectable`을 DI Container에 올릴 class에 데코레이터로 달아주고
        -   `module`에서 `provider`로 해당 class들을 서로 의존성 주입이 가능한 상태로 알아서 변경됨
        -   즉 `@Injectable` 데코레이터를 사용하면 "다른 클래스들을 위해 의존성으로 사용 될 수 있는것들"이라는 의미를 가지게됨
        -   이렇게 DI Container에 올려줌으로써 우리가 의존성에 대해 생각 할 것이 줄어들게됨
        -   그리고 대부분 프로젝트에서 controller를 제외하고 전부 의존성 주입이 필요하게 될것으로 보임
    -   DI Container가 적용되면서 NestJS가 자체적으로 code를 re-building하면서 class가 직접적으로 의존성을 가지지 않게되며 이렇게 제어 역전 원칙을 지키게됨
    -   Module간 의존성 주입

        -   Module간에 접근이 필요하여 의존성 주입이 필요한경우에는 `@Module` 데코레이터에 `exports`옵션으로 타 module에서 접근이 필요한 service를 넣어준다.
            -   `exports` 옵션으로 넣지않고 `provider` 옵션에만 service가 존재하는경우에는 module내부에서만 해당 service에 접근이 가능함
        -   그리고 사용할 module에서 `@Module` 데코레이터에 `imports`옵션으로 접근 할 module을 넣어준다.
            -   `imports` 옵션으로 넣어준 module이 `exports`하는 service는 전부 접근이 가능함
        -   아래 예시는 cpu module에서 power module에 있는 power service를 사용해야할 때

            ```javascript
            @Module({
                providers: [PowerService],
                exports: [PowerService],
            })
            export class PowerModule {}

            @Module({
                imports: [PowerModule],
                providers: [CpuService],
            })
            export class CpuModule {}

            export class CpuService {
                constructor(private powerService: PowerService) {}
            }
            ```

    ***

-   TypeORM

    -   Database 구축 간 TypeORM을 사용하면 NestJS와 궁합이 정말 좋다고 소개를 하고있다.
    -   물론 type이 없는 Mongoose와 같은 database도 사용이 가능하다.
    -   `npm install @nestjs/typeorm typeorm sqlite3`을 진행(database로 SQLite를 사용할경우)
    -   이후 `app.module.ts`에서 `@Module`데코레이터의 `imports`옵션에 아래와 같이 `TypeOrmModule.forRoot()`을 넣어준다
        ```javascript
        @Module({
            imports: [
                TypeOrmModule.forRoot({
                    type: "sqlite", // database의 종류
                    database: "db.sqlite", // project root에 생성할 database의 이름
                    entities: [], // project에 사용되는 entity
                    synchronize: true,
                }),
            ],
            ...
        })
        ```
    -   다음 `npm run start:dev`를 진행하게되 root path에 `db.sqlite`가 생성된다.
    -   Data에 대한 entity를 생성하게되면 NestJS와 TypeORM이 보이지 않는곳에서 합작하여 repository를 생성해줌

        -   Entity를 생성하는 과정

            1.  `(name).entity.ts`와 같은 구조로 entity 파일을 생성한다.(ex: `user.entity.ts`)
            2.  생성한 파일 안에 `@Enity`, `@PrimaryGeneratedColumn`, `@Column` 데코레이터를 이용하여 entity의 type들을 정의한다.(아래 예시 참고)

                ```javascript
                import {
                    Column,
                    Entity,
                    PrimaryGeneratedColumn,
                } from "typeorm";

                @Entity()
                export class User {
                    @PrimaryGeneratedColumn()
                    id: number;

                    @Column()
                    email: string;

                    @Column()
                    password: string;
                }
                ```

            3.  이제 생성한 entity를 부모 module에 연결하여야한다.(아래 예시 참고)

                -   부모 module에서 `@Module`데코레이터 `imports`구문에 `TypeOrmModule.forFeature([entity])`를 추가하여 module에 import 되게한다.

                    ```javascript
                    import { Module } from "@nestjs/common";
                    import { UsersService } from "./users.service";
                    import { UsersController } from "./users.controller";
                    import { TypeOrmModule } from "@nestjs/typeorm";
                    import { User } from "./user.entity";

                    @Module({
                        imports: [TypeOrmModule.forFeature([User])],
                        providers: [UsersService],
                        controllers: [UsersController],
                    })
                    export class UsersModule {}
                    ```

            4.  App module에 생성한 entity를 `TypeOrmModule.forRoot`의 `entity` 배열에 추가한다.

                ```javascript
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: "db.sqlite",
                    entities: [User],
                    synchronize: true,
                }),
                ```

            5.  파일을 save하고 NestJS를 동작시키면 위에 선언한 DB에 TypeORM이 알아서 type을 맞춰 선언해준다.

        -   그럼 보이지않는 곳에 repository를 생성해주는데 어떻게 접근할 수 있을까?
            -   TypeORM Docs를 보면 이미 여러개의 Method를 정의해 놓았다고한다.(https://typeorm.io/repository-api)
            -   위 링크를 확인해보면 CRUD 기능이 전부 구현이 되어있음
            -   그래서 직접적으로 repository의 기능을 건드릴 일이 없음
            -   그럼 이 보이지않는 repository를 어떻게 service에 연결할까?
                -   아래와 같이 `@InjectRepository` 데코레이터와 `User` entity, 그리고 `Repository` class를 이용하여 선언하면 service에 `repo`라는 이름으로 접근이 가능해진다.
                    ```javascript
                    @Injectable()
                    export class UsersService {
                        constructor(@InjectRepository(User) private repo: Repository<User>) {}
                    }
                    ```

-   데이터 직렬화

    -   데이터 직렬화를 하게되는 이유는 response로 보낼 data를 제한하기 위해 많이 사용하게된다.
    -   Data를 제한하는 방법은 `class-transformer`의 `@Exclude`데코레이터를 entity에 사용하게되면 해당 data는 response에서 제외되게된다.(보통 password처럼 보안이 필요한 부분에 많이 사용한다.)
        ```javascript
        @Column()
        @Exclude()
        password: string;
        ```
    -   이후 controller에서 `UseInterceptors`데코레이터와 `ClassSerializerInterceptor`를 이용하여 나가는 response를 가로채기하면 `Exclude`된 entity는 return이 되지않는다.

        ```javascript
        @UseInterceptors(ClassSerializerInterceptor)
        @Get("/:id")
        async findUser(@Param("id") id: string) {
            const user = await this.usersService.findOne(parseInt(id));
            if (!user) {
                throw new NotFoundException("유저를 찾을 수 없습니다.");
            }
            return user;
        }
        ```

    -   하지만 위와 같이 진행하면 관리자 페이지와 같은곳에서도 볼 수 없음
        -   그렇게되면 controller를 하나 더 구성하여 관리자용 routing을 새로 만들어야함
    -   그래서 NestJS에서는 `CustomInterceptor`를 제공해준다.
        -   이것의 명명법으로는`intercept(context: ExecutionContext, next: CallHandler)`라고 Docs에 명시되어있다.(어디서 많이 본 문법이라 확인해보니 Rx로 만들어졌다고함)
    -   사용법으로는

        1.  직렬화 후 보내고싶은 형태의 DTO를 `@Expose`데코레이터를 이용하여 생성한다.(`@Expose`데코레이터는 `@Exclude`와 반대되는 속성)

            ```javascript
            import { Expose } from "class-transformer";

            export class UserDto {
                @Expose()
                id: number;

                @Expose()
                email: string;
            }
            ```

        2.  `src`폴더 내에 `interceptors`폴더를 생성하고 그 내부에 `serialize.interceptor.ts`를 생성한다.
        3.  `serialize.interceptor.ts`에서 아래와 같이 작성한다.

            -   `plainToClass`함수를 이용하여 기존에 reponse로 돌려주던 `data`를 `UserDto`의 형태로 변환하고 `excludeExtraneousValues`에 true를 주면 DTO에서 `@Exclude`데코레이터가 포함된 entity는 return이 되지않는다.

            ```javascript
            import {
                NestInterceptor,
                ExecutionContext,
                CallHandler,
            } from "@nestjs/common";
            import { plainToInstance } from "class-transformer";
            import { Observable, map } from "rxjs";
            import { UserDto } from "src/users/dtos/user.dto";

            export class SerializeInterceptor implements NestInterceptor {
                intercept(
                    context: ExecutionContext,
                    next: CallHandler<any>
                ): Observable<any> {
                    // request가 들어오면 실행되는 부분
                    // url, method 등과 같은 정보가 context 들어있음
                    return next.handle().pipe(
                        map((data: any) => {
                            // response가 전송되기 전에 실행되는 부분
                            // response 될 data에 대한 정보가 data에 들어있음
                            return plainToInstance(UserDto, data, {
                                excludeExtraneousValues: true,
                            });
                        })
                    );
                }
            }
            ```

        4.  하지만 위와 같이 생성하게되면 DTO마다 각각의 interceptor를 생성해줘야해서 재사용을 위해 아래와 같이 DTO를 입력받아 오는 방식으로 변경

            ```javascript
            export class SerializeInterceptor implements NestInterceptor {
                constructor(private dto: any) {}

                intercept(
                    context: ExecutionContext,
                    next: CallHandler<any>,
                ): Observable<any> {
                    // request가 들어오면 실행되는 부분
                    // url, method 등과 같은 정보가 context 들어있음
                    return next.handle().pipe(
                        map((data: any) => {
                            // response가 전송되기 전에 실행되는 부분
                            // response 될 data에 대한 정보가 data에 들어있음
                            return plainToInstance(this.dto, data, {
                                excludeExtraneousValues: true,
                            });
                        }),
                    );
                }
            }
            ```

        5.  그 후 controller에서 아래와 같이 `SerializeInterceptor`에 `생성한 Dto`를 매개변수로 넣어줌
            ```javascript
            @UseInterceptors(new SerializeInterceptor(UserDto))
            @Get("/:id")
            async findUser(@Param("id") id: string) {
                const user = await this.usersService.findOne(parseInt(id));
                if (!user) {
                    throw new NotFoundException("유저를 찾을 수 없습니다.");
                }
                return user;
            }
            ```
        6.  그러나 또 위와 같이 진행하게되면 Code가 복잡해지면 복잡해질수록 보기 힘들어지는 단점이 생겨 `Serialize`라는 `Custom decorator`를 생성하여 아래와 같이 controller에 적용

            ```javascript
            export function Serialize(dto: any) {
                return UseInterceptors(new SerializeInterceptor(dto));
            }

            @Serialize(UserDto)
            @Get("/:id")
            async findUser(@Param("id") id: string) {
                const user = await this.usersService.findOne(parseInt(id));
                if (!user) {
                    throw new NotFoundException("유저를 찾을 수 없습니다.");
                }
                return user;
            }
            ```

        7.  추가로 해당 controller에 발생하는 response 전부 Serialize 후 보내고싶다면 아래와 같이 controller에 `@Serialize`데코레이터를 사용하면 해당 controller에서 발생하는 response는 `UserDto`의 형태로 serialize후 response된다.

            ```javascript
            @Controller("auth")
            @Serialize(UserDto)
            export class UsersController {
                ...
            }
            ```

        8.  마지막으로 현재 dto의 type을 any로 정의해두었는데 이러면 Typescript를 사용하는 이점이 사라지며 안정성이 떨어지고, 현재는 interceptor할떄 사용되는 NestJS의 데코레이터의 타입을 지원 안해주고 있음. 그래서 최소한의 방어 코드를 위해 any로 정의된 dto를 아래처럼 `ClassConstructor` interface를 생성 후 dto의 type으로 정의해주면 class를 제외한 나머지를 dto에 넣어주려고하면 error가 발생됨.

            ```javascript
            interface ClassConstructor {
                new(...args: any[]): object;
            }

            export function Serialize(dto: ClassConstructor) {
                return UseInterceptors(new SerializeInterceptor(dto));
            }
            ```

-   Authentication

    -   ` Auth Service`의 경우 `Users Service`에 합치는거보다 service는 별도로 분리하는게 확장성에 용이하다.
    -   그래서 보통은 `Auth Service`가 `Users Service`에 의존하는 방식으로 분리해서 사용한다.

        -   그래서 `Auth Service`에서 `Users Service`를 참고할 수 있도록 `Auth Service`를 구성한다.

            ```javascript
            import { Injectable } from "@nestjs/common";
            import { UsersService } from "./users.service";

            @Injectable()
            export class AuthService {
                constructor(private usersService: UsersService) {}
            }
            ```

    -   이제 `Users Module`에 `providers`에 `Auth Service`를 추가한다.

        ```javascript
        @Module({
            imports: [TypeOrmModule.forFeature([User])],
            providers: [UsersService, AuthService],
            controllers: [UsersController],
        })
        export class UsersModule {}
        ```

    -   이후 `Auth Service`에 인증과 관련된 작업들을 작성한다.(예시로 회원가입, 로그인, 비밀번호변경 등과 같은 작업)
    -   회원가입, 로그인 등 필요한 service를 작성 후 `Users Controller`와 연동
    -   회원가입이나 로그인 시퀀스를 진행 후 cookie를 넘겨주어야하는데, 이 cookie를 확인하고 전달하려면 NestJS Docs에서 설명해주는 아래의 package를 install해야한다.

        `npm install express-session cookie-parser`

        `npm install -D @types/express-session @types/cookie-parser`

    -   이후 app을 initialize하는 구문에서 `app.use`를 이용하여 모두 middleware로 등록해준다.

        ```javascript
        import * as cookieParser from "cookie-parser";
        import * as session from "express-session";

        async function bootstrap() {
            ...
            app.use(cookieParser());
            app.use(
                session({
                    secret: "instead", // 암호화 할때 사용하는 text(아무거나 사용해도됨)
                    resave: false, // resave를 true로 활성화하면 session이 변동되지 않았을때도 지속적으로 다시 저장해줌(변동될 때만 저장해주면되니까 false)
                    saveUninitialized: false, // saveUninitialized를 true로 활성화하면 초기화되지않은 session이 강제로 저장됨(로그인 session을 구현할때는 false)
                }),
            );
            ...
        }
        ```

    -   일단 session을 등록하고 조회하는방법부터 배우기 위해 아래와 같이 Test를 진행

        -   Session의 값을 설정하는 방법은 `@Session`데코레이터를 이용하여 session을 가져온 뒤 session에 값을 넣어주고 해당 routing에 `Get`을 하게되면 아래와 같은 `Set-Cookie`를 포함한 response가 발생되게된다.

            ```javascript
            @Get("/colors/:color")
            setColor(@Param("color") color: string, @Session() session: any) {
                session.color = color;
            }
            ```

            ```http
            HTTP/1.1 200 OK
            X-Powered-By: Express
            Set-Cookie: connect.sid=s%3ALF-8al6yiA46y2DcSFXNMTu3_HAbFgNe.xuLziApsTr8wv8bxZ7R9qYXCXFVsgDeLDY42HujQN18; Path=/; HttpOnly
            Date: Tue, 09 Jan 2024 09:40:19 GMT
            Connection: close
            Transfer-Encoding: chunked
            ```

        -   Session의 값을 가져오는 방법은 동일하기 `@Session`데코레이터를 이용하여 session을 가져온뒤 설정해준 session 값을 조회하여 return해주면 아래와 같이 response에서 값을 확인할 수 있다.

            ```javascript
            @Get("/colors")
            getColor(@Session() session: any) {
                return session.color;
            }
            ```

            ```http
            HTTP/1.1 200 OK
            X-Powered-By: Express
            Content-Type: text/html; charset=utf-8
            Content-Length: 3
            ETag: W/"3-eJiAELiQzm9NITZIHzknh+xtYQY"
            Date: Tue, 09 Jan 2024 09:45:40 GMT
            Connection: close

            red
            ```

    -   그럼 이제 이걸 회원가입 또는 로그인 시 userId, jwt와 같은 고유한 값을 session에 담아 아래와 같이 넘겨주면 response에서 `Set-Cookie`가 추가된 것을 확인할 수 있다. 만약 `Set-Cookie`가 보이지 않는다면 session에 변동이 있을때만 response에서 확인이 가능하기에 변동사항이 없다는 것을 뜻함(이번 study간에는 userId를 이용해봄)

        ```javascript
        @Post("/signup")
        async createUser(@Body() body: CreateUserDto, @Session() session: any) {
            const user = await this.authService.signup(body.email, body.password);
            session.userId = user.id;
            return user;
        }

        @Post("/signin")
        async signin(@Body() body: CreateUserDto, @Session() session: any) {
            const user = await this.authService.signin(body.email, body.password);
            session.userId = user.id;
            return user;
        }
        ```

        ```http
        HTTP/1.1 201 Created
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8
        Content-Length: 33
        ETag: W/"21-6eZt003uyql7urxWR6WSfFrJYUU"
        Set-Cookie: connect.sid=s%3AESfBIpgVcbi6aXjeERKYMVZeudJ-hBS7.c%2FNuyyzHwoYoxxSKIil%2FKD70CnUWRYLzFd9duhXC4NI; Path=/; HttpOnly
        Date: Tue, 09 Jan 2024 09:52:13 GMT
        Connection: close

        {
            "id": 4,
            "email": "test4@test.com"
        }
        ```

    -   이제 추후에 게시물 작성과 같은 기능을 추가하면 현재 사용자를 확인하고 어떤 user인지 확인하여야하는데 그것은 추후에 적용하겠지만 미리 Test해보면 아래와 같이 test용 routing을 만들어서 `session.userId`를 읽어오고 그 값으로 user를 조회하면 아래와 같은 response가 돌아오게된다.

        ```javascript
        @Get("/whoami")
        whoAmI(@Session() session: any) {
            return this.usersService.findOne(session.userId);
        }
        ```

        ```http
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Content-Type: application/json; charset=utf-8
        Content-Length: 33
        ETag: W/"21-6eZt003uyql7urxWR6WSfFrJYUU"
        Date: Tue, 09 Jan 2024 10:07:41 GMT
        Connection: close

        {
            "id": 4,
            "email": "test4@test.com"
        }
        ```

    -   이제 user를 signout 시키는 방법은 간단하면서도 복잡하다.

        -   아래와 같이 signout routing을 작성하고 `session.userId`에 `null`값을 넣어준다.
            ```javascript
            @Post("/signout")
            signOut(@Session() session: any) {
                session.userId = null;
            }
            ```
        -   그러나 위 작업만하면 `/whoami`에서 엉뚱한 user가 조회되는데 그 이유는 `SQLite`에서 찾고자 하는 id에 `null`을 넣어주면 해당 DB의 제일 첫번째값을 return하기 때문이다.
        -   그래서 `Users Service`에 방어코드로 입력된 id가 `null`이면 `null`을 반환해주면된다.
            ```javascript
            findOne(id: number) {
                if (!id) {
                    return null;
                }
                return this.repo.findOneBy({ id });
            }
            ```

    -   이제 위에 모든걸 적용하여 `Guard`로 권한이 없다면 request를 거부하는 시퀀스를 만들어야한다.

        -   이를 적용하기 위해서는 모든 route에서 현재 user를 항상 알고 있어야하는데 이 기능을 위해 `Interceptor` + `Decorator`의 조합을 만들어보려고한다.
        -   `Decorator`를 이용하여 `userId`를 얻기위해 아래처럼 `CurrentUser`를 `createParamDecorator`로 생성하면 `request.session.userId`를 통해 값을 얻어올 수 있다.

            ```javascript
            import {
                createParamDecorator,
                ExecutionContext,
            } from "@nestjs/common";

            export const CurrentUser = createParamDecorator(function (
                data: never,
                context: ExecutionContext
            ) {
                // data는 decorator를 사용할때 매개변수로 넘겨주는 값을 가지고있음
                // context는 통신과 관련된 모든 내용을 가지고있음

                const request = context.switchToHttp().getRequest();
            });
            ```

        -   그러나 `Decorator`는 DI 즉, 의존성 주입을 할 수 없어서 `User Service`에서 해당 user의 정보를 가져올 수 없다.

            -   이를 해결하려면 `Interceptor`를 생성하여 그 interceptor에서 `User Service`에 의존성을 주입받고 DB에 접근해 request에 user정보를 넣어준다.

                ```javascript
                import {
                    NestInterceptor,
                    ExecutionContext,
                    CallHandler,
                    Injectable,
                } from "@nestjs/common";
                import { UsersService } from "../users.service";

                @Injectable()
                export class CurrentUserInterceptor implements NestInterceptor {
                    constructor(private usersService: UsersService) {}

                    async intercept(context: ExecutionContext, handler: CallHandler) {
                        const request = context.switchToHttp().getRequest();
                        const { userId } = request.session || {};

                        if (userId) {
                            const user = await this.usersService.findOne(userId);
                            request.currentUser = user;
                        }

                        return handler.handle();
                    }
                }
                ```

            -   위에 생성한 `Interceptor`를 controller에 decorator로 달아주면 `UsersController`로 들어오는 request는 전부 currentUser의 값을 가지게된다.
                ```javascript
                @Controller("auth")
                @Serialize(UserDto)
                @UseInterceptors(CurrentUserInterceptor)
                export class UsersController {
                    ...
                }
                ```
            -   그 후 `Decorator`에서 request를 확인하면 위에서 넣어준 user정보가 생성되었고 해당 정보를 return해주면 `@CurrentUser` decorator를 통해 값에 접근할 수 있게 된다.

                ```javascript
                import {
                    createParamDecorator,
                    ExecutionContext,
                } from "@nestjs/common";

                export const CurrentUser = createParamDecorator(function (
                    data: never,
                    context: ExecutionContext
                ) {
                    // data는 decorator를 사용할때 매개변수로 넘겨주는 값을 가지고있음
                    // context는 통신과 관련된 모든 내용을 가지고있음

                    const request = context.switchToHttp().getRequest();
                    return request.currentUser;
                });
                ```

            -   이렇게하면 `Decorator`가 `User Service`에 DI를 할 필요가 없어진다.
            -   그러나 위와같이 설계를 하면 currentUser값이 필요한 controller마다 모두 interceptor를 달아줘야한다는 단점이 있다.

        -   그래서 나온 방법이 global interceptor이다.
        -   Global interceptor는 module 자체에 들어오는 모든 request에 interceptor를 걸 수 있도록하는것이다.
        -   아래와 같이 필요한 module에 provider로 넘겨주게되면 해당 module에 들어오는 request는 currentUser의 값을 가지게되나 필요없는경우에도 값을 처리하여 가지고있기 때문에 이 또한 단점이 될 수 있다.

            ```javascript
            import { Module } from "@nestjs/common";
            import { UsersService } from "./users.service";
            import { UsersController } from "./users.controller";
            import { TypeOrmModule } from "@nestjs/typeorm";
            import { User } from "./user.entity";
            import { AuthService } from "./auth.service";
            import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
            import { APP_INTERCEPTOR } from "@nestjs/core";

            @Module({
                imports: [TypeOrmModule.forFeature([User])],
                providers: [
                    UsersService,
                    AuthService,
                    {
                        useClass: CurrentUserInterceptor,
                        provide: APP_INTERCEPTOR,
                    },
                ],
                controllers: [UsersController],
            })
            export class UsersModule {}
            ```

        -   controller별로 interceptor를 적용하는것, global interceptor를 적용하는것 모두 장단점이 있고 개인의 취향이니 선택적으로 사용하면 될 듯

-   Guard

    -   권한이 없으면 request를 거부하는 `Guard`를 적용할 차례이다.
        -   `Guard`는 app의 모든 접근 전, controller 접근 전, handler 접근 전에 모두 적용할 수 있다.
    -   `AuthGuard`를 아래와 같이 `CanActivate`를 implement하는 class로 만들어주고, `canActivate`에 조건을 return해주면된다.(대체로 boolean을 return함)

        ```javascript
        import { CanActivate, ExecutionContext } from "@nestjs/common";

        export class AuthGuard implements CanActivate {
            canActivate(context: ExecutionContext) {
                const request = context.switchToHttp().getRequest();

                return request.session.userId;
            }
        }
        ```

    -   그 후 적용할 곳에서 `UseGuards` decorator를 이용하여 적용하면된다.

        -   controller에 적용 시

            ```javascript
            @Controller("auth")
            @Serialize(UserDto)
            @UseGuards(AuthGuard)
            export class UsersController {
                ...
            }
            ```

        -   handler에 적용 시

            ```javascript
            @Get("/whoami")
            @UseGuards(AuthGuard)
            whoAmI(@CurrentUser() user: User) {
                return user;
            }
            ```

        -   권한이 없는데 접근 시 아래와 같이 `403 Forbidden` error가 발생하게된다.

            ```http
            HTTP/1.1 403 Forbidden
            X-Powered-By: Express
            Content-Type: application/json; charset=utf-8
            Content-Length: 69
            ETag: W/"45-MZJWZc+Y+RUbHpnhz2B2Vipii24"
            Date: Tue, 09 Jan 2024 12:46:20 GMT
            Connection: close

            {
                "message": "Forbidden resource",
                "error": "Forbidden",
                "statusCode": 403
            }
            ```

-   Test

    -   App에 구현되어있는 모든 기능들의 test case를 작성하면 app의 신뢰도가 올라간다.
    -   Unit Test(단위 테스트)
        -   NestJS에서 unit test는 service와 controller 단위로 test가 이루어진다.
        -   Test 진행 전 `package.json`에서 `moduleNameMapper`에 대한 설정을 해줘야한다.
            -   Test 할때 NestJS에서는 절대경로로 치환되는 부분들이 있는데 이 경로를 인식하지 못하기때문에 이를 설정해주어야한다.
                ```json
                "jest": {
                    "moduleFileExtensions": [
                        "js",
                        "json",
                        "ts"
                    ],
                    "rootDir": "src",
                    "testRegex": ".*\\.spec\\.ts$",
                    "transform": {
                        "^.+\\.(t|j)s$": "ts-jest"
                    },
                    "collectCoverageFrom": [
                        "**/*.(t|j)s"
                    ],
                    "coverageDirectory": "../coverage",
                    "testEnvironment": "node",
                    "moduleNameMapper": {
                        "src/(.*)": "<rootDir>/$1",
                        "tests/(.*)": "<rootDir>/__tests__/$1"
                    },
                    "moduleDirectories": [
                        "node_modules",
                        "src"
                    ]
                }
                ```
        -   DI(의존성 주입) 되어있는 부분들은 모두 가상의 unit으로 구현 후 test module에 provider로 넣어줘야함
        -   Unit Test에서는 decorator를 사용할 수 없다.(decorator까지 test하기 위해서는 E2E Test를 진행하여야한다.)
    -   E2E Test(End to End Test)

        -   E2E Test 진행 전 unit test 할 때와 동일하게 `jest-e2e.json`에서 경로에 대한 설정을 해주어야한다.

            ```json
            {
                "moduleFileExtensions": ["js", "json", "ts"],
                "rootDir": ".",
                "testEnvironment": "node",
                "testRegex": ".e2e-spec.ts$",
                "transform": {
                    "^.+\\.(t|j)s$": "ts-jest"
                },
                "moduleNameMapper": {
                    "^src/(.*)$": "<rootDir>/../src/$1"
                }
            }
            ```

        -   추가로 `main.ts`에서 설정해준 middleware들도 동일하게 E2E Test app에서도 설정해주어야한다.

            -   그래서 아래 middleware를 설정하는 구문들을 별도 함수로 분리하여 적용해주는 첫번째 방법이 있다.(간편하게 구현이 가능함)

                -   `setup-app.ts`를 생성 후 아래와 같이 필요한 middleware를 적용

                    ```javascript
                    import { ValidationPipe } from "@nestjs/common";
                    import * as cookieParser from "cookie-parser";
                    import * as session from "express-session";

                    export function setupApp(app: any) {
                        app.use(cookieParser());
                        app.use(
                            session({
                                secret: "instead",
                                resave: false,
                                saveUninitialized: false,
                            })
                        );
                        app.useGlobalPipes(
                            new ValidationPipe({
                                whitelist: true, // DTO에 선언한 형식을 제외한 다른 속성은 들어와도 무시함
                            })
                        );
                    }
                    ```

                -   이후 `main.ts`에서 위 `setupApp`함수를 이용하여 middleware 적용

                    ```javascript
                    import { NestFactory } from "@nestjs/core";
                    import { AppModule } from "./app.module";
                    import { setupApp } from "./setup-app";

                    async function bootstrap() {
                        const app = await NestFactory.create(AppModule);
                        setupApp(app);
                        await app.listen(3000);
                    }
                    bootstrap();
                    ```

                -   마지막으로 진행하고있는 E2E Test app에도 동일하게 `setupApp`함수를 이용하여 적용

                    ```javascript
                    describe("Authentication System (e2e)", () => {
                        let app: INestApplication;

                        beforeEach(async () => {
                            const moduleFixture: TestingModule = await Test.createTestingModule({
                                imports: [AppModule],
                            }).compile();

                            app = moduleFixture.createNestApplication();
                            setupApp(app);
                            await app.init();
                        });
                    }
                    ```

            -   그러나 NestJS에서 알려주는 공식적인 방법은 다음과 같다.

                -   바로 `AppModule`에 `Global pipe`와 `Global middleware`를 적용하는 것이다.
                -   현재는 `main.ts`에서 `Global pipe`와 `middleware`를 적용해둔 상태이나 `AppModule`에 적용하면 E2E Test시 `AppModule`을 import하여 사용하기 때문에 E2E Test에서 따로 설정을 해 줄 필요가 없어진다.
                    -   TDD로 구현을 할 때는 처음부터 `AppModule`에 적용하는것이 좋을것 같다는 생각이 들었다.
                -   `Global pipe`는 아래와 같이 `@Module` decorator의 provider 제공자에 `APP_PIPE`와 함께 넣어주면 된다.
                    ```javascript
                    @Module({
                        imports: [
                            TypeOrmModule.forRoot({
                                type: "sqlite",
                                database: "db.sqlite",
                                entities: [User, Report],
                                synchronize: true,
                            }),
                            UsersModule,
                            ReportsModule,
                        ],
                        controllers: [AppController],
                        providers: [
                            AppService,
                            {
                                provide: APP_PIPE,
                                useValue: new ValidationPipe({
                                    whitelist: true,
                                }),
                            },
                        ],
                    })
                    export class AppModule {}
                    ```
                -   `Global middleware`는 `AppModule`class내에 `configure`함수로 아래와 같이 정의를 하여야한다.

                    ```javascript
                    export class AppModule {
                        configure(consumer: MiddlewareConsumer) {
                            consumer.apply(cookieParser()).forRoutes("*");
                            consumer
                                .apply(
                                    session({
                                        secret: "instead",
                                        resave: false,
                                        saveUninitialized: false,
                                    })
                                )
                                .forRoutes("*");
                        }
                    }
                    ```

                -   확실히 코드 시인성은 많이 떨어지긴하나 Test에는 편해진다..

        -   E2E Test를 진행하다보면 DB가 오염되기 쉽다.(Test를 진행하면서 지속적으로 바뀌기 때문)

            -   회원가입과 같이 중복된 email을 허용하지 않는경우에는 error가 발생한다.
            -   그럼 또 다음 Test를 할 때는 email의 값을 바꿔주고 Test해야하고 Test마다 값을 변경을 해줘야하는 번거로움이 생긴다.
            -   그래서 Test용 DB를 하나 새로 만들고 Test를 실행할 때마다 DB가 초기화되도록하고 Test를 진행하는 것이 좋다.
            -   이때 Dotenv를 활용하여 DB를 분리할 수 있다.

                -   NestJS에서는 Dotenv를 controller하기위한 library를 제공해준다.(@nestjs/config)

                    `npm install @nestjs/config`

                -   NestJS에서는 일반적인 Dotenv와는 다르게 여러개의 `.env`를 생성해도 된다고 말하고있다.(Dotenv는 무조건 `.env`가 하나만 있어야한다고 말한다.)
                -   그래서 NestJS에서는 현재 환경에 따라 나누어 다른 `.env`를 적용할 수 있다.
                -   예시를 들어보면
                    -   `root` 경로에 `.env.development`와 `.env.test`를 생성하고 각 환경의 따라 DB 이름을 아래와 같이 정의해준다.
                        -   `.env.development`
                            ```env
                            DB_NAME=db.sqlite
                            ```
                        -   `.env.test`
                            ```env
                            DB_NAME=test.sqlite
                            ```
                    -   이후 `@nestjs/config`에서 제공해주는 `ConfigModule`과 `ConfigService`를 이용하여 `AppModule`에 적용해준다.
                        -   `ConfigModule`은 상황에 따라 어떤 `.env`를 읽어야하는지를 알려주는 기능을 한다.
                            -   아래와 같이 `AppModule`의 `@Module` decorator에 import해준다.
                                ```javascript
                                @Module({
                                    imports: [
                                        ConfigModule.forRoot({
                                            isGlobal: true, // global하게 적용시킬것이기떄문
                                            envFilePath: `.env.${process.env.NODE_ENV}`, // 현재 환경에 맞게 .env를 가져오게함
                                        }),
                                        TypeOrmModule.forRoot({
                                            type: "sqlite",
                                            database: "db.sqlite",
                                            entities: [User, Report],
                                            synchronize: true,
                                        }),
                                        UsersModule,
                                        ReportsModule,
                                    ],
                                    controllers: [AppController],
                                    providers: [
                                        AppService,
                                        {
                                            provide: APP_PIPE,
                                            useValue: new ValidationPipe({
                                                whitelist: true,
                                            }),
                                        },
                                    ],
                                })
                                ```
                        -   `ConfigService`는 알려준 `.env`를 읽고 app에 제공해주는 기능을 한다.
                            -   아래와 같이 기존의 `TypeOrmModule.forRoot` 구문을 `TypeOrmModule.forRootAsync`로 변경하고 `ConfigService`를 사용할 수 있도록 리펙토링을 한다.
                                ```javascript
                                @Module({
                                    imports: [
                                        ConfigModule.forRoot({
                                            isGlobal: true, // global하게 적용시킬것이기떄문
                                            envFilePath: `.env.${process.env.NODE_ENV}`, // 현재 환경에 맞게 .env를 가져오게함
                                        }),
                                        TypeOrmModule.forRootAsync({
                                            inject: [ConfigService], // ConfigService를 DI 시킴
                                            useFactory: (config: ConfigService) => {
                                                // config에 읽어온 .env의 내용이 들어있음
                                                return {
                                                    type: "sqlite",
                                                    database: config.get<string>("DB_NAME"),
                                                    entities: [User, Report],
                                                    synchronize: true,
                                                };
                                            },
                                        }),
                                        UsersModule,
                                        ReportsModule,
                                    ],
                                    controllers: [AppController],
                                    providers: [
                                        AppService,
                                        {
                                            provide: APP_PIPE,
                                            useValue: new ValidationPipe({
                                                whitelist: true,
                                            }),
                                        },
                                    ],
                                })
                                ```
                    -   추가로 `process.env.NODE_ENV`의 값을 잘 읽어올 수 있도록 `package.json`에서 script에 `NODE_ENV`를 주입한다.
                        ```json
                        "scripts": {
                            "build": "nest build",
                            "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
                            "start": "nest start" ==> "NODE_ENV=development nest start",
                            "start:dev": "nest start --watch", ==> "NODE_ENV=development nest start --watch"
                            "start:debug": "nest start --debug --watch" ==> "NODE_ENV=development nest start --debug --watch",
                            "start:prod": "node dist/main",
                            "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
                            "test": "jest" ==> "NODE_ENV=test jest",
                            "test:watch": "jest --watch --maxWorkers=1"  ==> "NODE_ENV=test jest --watch --maxWorkers=1",
                            "test:cov": "jest --coverage" ==> "NODE_ENV=test jest --coverage",
                            "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand" ==> "NODE_ENV=test node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
                            "test:e2e": "jest --config ./test/jest-e2e.json" ==> "NODE_ENV=test jest --config ./test/jest-e2e.json"
                        },
                        ```

            -   그러나 이렇게 DB를 분리하고 E2E Test를 진행하면 `database is locked` error를 만날 수 있다.

                ```shell
                [Nest] 93475  - 2024. 01. 10. 오후 10:00:42   ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
                QueryFailedError: SQLITE_BUSY: database is locked
                    at Statement.handler (/Users/kim-yuhyeon/Desktop/NestJS_Depp_Dive/mycarvalue/src/driver/sqlite/SqliteQueryRunner.ts:134:29)
                    at Statement.replacement (/Users/kim-yuhyeon/Desktop/NestJS_Depp_Dive/mycarvalue/node_modules/sqlite3/lib/trace.js:25:27)
                    at Statement.replacement (/Users/kim-yuhyeon/Desktop/NestJS_Depp_Dive/mycarvalue/node_modules/sqlite3/lib/trace.js:25:27)
                ```

                -   위 error는 Jest에서는 1개의 DB만을 허용하고있으나 이전에 저장하던 DB와의 충돌이 첫번째 이유이고, 두번째 이유는 여러 test를 동시다발적으로 실행하려해서 나타나는 현상이다.
                -   이를 해결하기 위해서는 간단하게 Jest에 동시에 test를 진행하지말라고 `package.json`의 scripts에서 `--maxWorkers=1`을 정의해주면된다.

                    ```json
                    "test:e2e": "NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1"
                    ```

            -   그럼 이제 마지막으로 test를 실행할 때마다 DB를 어떻게 삭제할 수 있을까?

                -   이는 Jest의 기능을 이용해서 test가 실행되기 전에 삭제할 수 있다.
                -   `test` 폴더에 `setup.ts`를 생성하고 아래와 같이 `global.beforeEach`를 이용하여 `test.sqlite`를 삭제하는 기능을 작성한다.(DB가 없을수 있으니 `try-catch` 구문으로 작성)

                    ```javascript
                    import { rm } from "fs/promises";
                    import { join } from "path";

                    global.beforeEach(async () => {
                        try {
                            await rm(join(__dirname, "..", "test.sqlite"));
                        } catch (error) {
                            console.log("Test DB가 없습니다.");
                        }
                    });
                    ```

                -   이후 `jest-e2e.json`또는 `package.json`에서 아래 구문을 추가한다.(아래 내용을 env가 설정된 후에 `setup.ts`를 실행시키라는 의미이다.)
                    ```json
                    "setupFilesAfterEnv": ["<rootDir>/setup.ts"]
                    ```

            -   이렇게하면 DB 분리가 완료된다.

### REST Client 사용법(VSCode extension)

-   Root 폴더에 `requests.http`파일을 생성
-   아래와 같은 양식으로 작성 후 상단에 `Send Request`를 누르면 Test 결과를 확인 가능

    ```javascript
    ### List all messages
    GET http://localhost:3000/messages

    ### Create a new message
    POST http://localhost:3000/messages
    Content-Type: application/json

    {
        "content": "hi there"
    }

    ### get a particular message
    GET http://localhost:3000/messages/123
    ```

### Sample project(my car value)

-   중고차의 가격을 확인하고 판매할 수 있는 간단한 app을 만들어 볼 예정
-   API 설계
    |Method|Route|Body or QueryString|설명|
    |------|---|---|---|
    |Post|/auth/signup|Body - {email, password}|회원가입|
    |Post|/auth/signin|Body - {email, password}|로그인|
    |Get|/reports|QueryString - make, model, year, mileage, longitude, latitude|자동차의 정보를 받아 시세 확인|
    |Post|/reports|Body - {make, model, year, mileage, longitude, latitude, price}|자동차를 판매하기 위해 자동차 정보 및 가격 올리기|
    |Patch|/reports/:id|Body - {approved}|사용자가 제출한 자동차 정보를 검토하여 승인하거나, 반려처리함|

-   Module 설계

    -   API 설계 내용을 보면 Users, Reports 총 2개의 module이 필요함을 알 수 있음
    -   2개의 module 모두 controller, service, repository가 필요함

-   Database
    -   이번 프로젝트는 TypeORM을 한번 써보기위해 SQLite를 사용해보려고한다.
    -   추후에 Postgres로 변동 될 여지는 있음
