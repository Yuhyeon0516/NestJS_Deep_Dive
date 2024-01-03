# NestJS_Deep_Dive

-   NestJS는 class 기반으로 작성하게될 예정
-   NestJS의 내부 구성은 Controllers, Services, Modules, Pipes, Filters, Guards, Interceptors, Repositories로 이루어져있음
    -   Controllers: HTTP Request를 처리함
    -   Services: Data에 접근하거나 관련 비지니스 로직을 처리함
    -   Modules: Code를 그룹화 할 때 사용됨
    -   Pipes: HTTP Request로 들어온 Data의 유효성 검사를 진행함
    -   Filters: HTTP Request중 발생하는 Error를 처리함
    -   Guards: Auth와 같은 보안이 필요한 상황에 사용됨
    -   Interceptors: HTTP Request 또는 Response에 Logic을 추가하여 응답함
    -   Repositories: DB에 저장되어있는 Data를 처리함
-   NestJS에서는 파일 명명법이 있음(아래 예시 참고)
    -   `AppController`라는 controller class를 만들고자한다면 `app.controller.ts`
    -   `AppModule`라는 module class를 만들고자한다면 `app.module.ts`
    -   `name.type_of_thing.ts`의 형태를 가지게 됨

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
