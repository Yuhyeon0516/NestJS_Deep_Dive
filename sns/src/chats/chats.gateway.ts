import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-message.dto';
import { ChatsMessagesService } from './messages/messages.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/exception-filter/socket-catch-http.exception-filter';
import { SocketBearerTokenGuard } from 'src/auth/guard/socket/socket-bearer-token.guard';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@UsePipes(
  new ValidationPipe({
    // data의 변환을 허용
    transform: true,
    transformOptions: {
      // transform이 될 때 class-validator를 기반으로 변환
      enableImplicitConversion: true,
    },
    // validation decorator가 없는 property는 생략
    // 즉 미리 정의한 dto에 해당되는 것만 입력되게 됨
    whitelist: true,
    // whitelist에 해당되지 않는 값이 있다면 error를 발생시킴
    forbidNonWhitelisted: true,
  }),
)
@UseFilters(SocketCatchHttpExceptionFilter)
@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatsMessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  // websocket이 연결되었을때 server의 결과물을 반환
  @WebSocketServer()
  server: Server;

  // gateway가 생성된 후에 하고싶은 동작을 정의
  afterInit(server: any) {
    console.log(`after gateway init`);
  }

  // socket에 연결이 끊겼을때 하고싶은 동작을 정의
  handleDisconnect(socket: Socket) {
    console.log(`on disconnect called : ${socket.id}`);
  }

  // 연결 됐을때
  async handleConnection(
    socket: Socket & { user: UsersModel; token: string; tokenType: string },
  ) {
    console.log(`on connect called : ${socket.id}`);

    const headers = socket.handshake.headers;

    const rawToken = headers['authorization'];

    if (!rawToken) {
      // 에러가 발생하면 socket과 연결을 끊기
      socket.disconnect();
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const payload = this.authService.verifyToken(token);

      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;
      socket.token = token;
      socket.tokenType = payload.tokenType;

      return true;
    } catch (error) {
      // 에러가 발생하면 socket과 연결을 끊기
      socket.disconnect();
    }
  }

  // event를 구성
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody()
    dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    // room에 접속되어있는 모든 사용자에게 메세지를 보냄
    // this.server
    //   .in(data.chatId.toString())
    //   .emit('receive_message', data.message);

    // room에 접속되어있는 사용자 중 보낸 사람을 제외한 모든 사용자에게 메세지를 보냄
    // socket.to(data.chatId.toString()).emit('receive_message', data.message);

    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists) {
      throw new WsException({
        message: `존재하지 않는 chat 입니다. chatIds: ${dto.chatId}`,
      });
    }

    const message = await this.messagesService.createMessage(
      dto,
      socket.user.id,
    );

    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
  }

  // room에 들어감
  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          message: `존재하지 않는 chat 입니다. chatIds: ${chatId}`,
        });
      }

      socket.join(chatId.toString());
    }
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chat = await this.chatsService.createChat(data);
  }
}
