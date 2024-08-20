import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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
import { UsersModel } from 'src/users/entities/users.entity';

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
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatsMessagesService,
  ) {}
  // websocket이 연결되었을때 server의 결과물을 반환
  @WebSocketServer()
  server: Server;

  // 연결 됐을때
  handleConnection(socket: Socket) {
    console.log(`on connect called : ${socket.id}`);
  }

  // event를 구성
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody()
    dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket,
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

    const message = await this.messagesService.createMessage(dto);

    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
  }

  // room에 들어감
  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
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
  @UseGuards(SocketBearerTokenGuard)
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chat = await this.chatsService.createChat(data);
  }
}
