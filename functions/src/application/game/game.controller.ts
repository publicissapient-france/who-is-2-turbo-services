import {Controller, Get, Post} from '@nestjs/common';

@Controller('games')
export class GameController {
  @Get()
  hello() {
    return "hello world"
  }

  @Post()
  createNewGame() {

  }
}
