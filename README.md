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
