import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    NotFoundException,
} from "@nestjs/common";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
    constructor(public messagesService: MessagesService) {}

    @Get()
    listMessages() {
        return this.messagesService.findAll();
    }

    @Post()
    createMessages(@Body() body: CreateMessageDto) {
        return this.messagesService.create(body.content);
    }

    @Get("/:id")
    async getMessage(@Param("id") id: any) {
        const message = await this.messagesService.findOne(id);

        if (!message) {
            throw new NotFoundException("메시지를 찾을 수 없습니다.");
        }

        return message;
    }
}
