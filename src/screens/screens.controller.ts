import {
  Body,
  Controller,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CheckEventExsists } from 'src/events/pipes/event.pipe';
import {
  CreateScreenDto,
  FindByEventDto,
  UpdateScreenDto,
} from './dto/screen.dto';
import { Screen } from './entity/screen.entity';
import {
  ScreenOwnerByEventGuard,
  ScreenOwnerGuard,
} from './guards/owner.guard';
import { ScreensCrudService, ScreensService } from './screens.service';

@Crud({
  model: {
    type: Screen,
  },
  dto: {
    create: CreateScreenDto,
    update: UpdateScreenDto,
  },
  routes: {
    getOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
        ApiBody({ type: UpdateScreenDto }),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(ScreenOwnerGuard),
        ApiParam({ name: 'id', type: 'uuid' }),
      ],
    },
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('screens')
@UseGuards(JwtAuthGuard)
@Controller('screens')
export class ScreensController implements CrudController<Screen> {
  constructor(
    public readonly service: ScreensCrudService,
    public readonly screensService: ScreensService,
  ) {}

  @ApiResponse({
    status: 201,
    schema: {
      example: {
        playlistId: 'a4c401bb-048f-4bd1-a582-58f52168231b',
        description: 'description',
        userId: '29615bad-0209-47ca-81e9-4a0d73b98dc9',
        id: '6fb9a764-b455-4cf8-b103-c146e6541529',
      },
    },
  })
  @ApiBody({ type: CreateScreenDto })
  @Override('createOneBase')
  create(@Body(CheckEventExsists) body: CreateScreenDto) {
    return this.screensService.save(body);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'get all event screens' })
  @ApiBody({ type: FindByEventDto })
  @UseGuards(ScreenOwnerByEventGuard)
  @Override()
  async getMany(@Body(new ValidationPipe()) body: FindByEventDto) {
    return this.screensService.findMany(body.eventId);
  }
}
