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
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat(data);
  }
}
