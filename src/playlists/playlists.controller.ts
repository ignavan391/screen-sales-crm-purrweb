import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { MoveIncludeContentDto } from 'src/content/dto/content.dto';
import { Content } from 'src/content/entity/content.entity';
import { User } from 'src/users/user.decorator';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto/playlists.dto';
import { Playlist } from './entity/playlist.entity';
import {
  CheckOrderInPlaylistGuard,
  PlaylistOwnerGuard,
} from './guards/playlist.guard';
import { PlaylistCrudService, PlaylistService } from './playlists.service';

@Crud({
  model: {
    type: Playlist,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    getOneBase: {
      decorators: [UseGuards(PlaylistOwnerGuard)],
    },
    updateOneBase: {
      decorators: [UseGuards(PlaylistOwnerGuard)],
      returnShallow: true,
    },
    deleteOneBase: {
      decorators: [UseGuards(PlaylistOwnerGuard)],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreatePlaylistDto,
    update: UpdatePlaylistDto,
  },
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiBearerAuth()
@ApiTags('playlists')
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController implements CrudController<Playlist> {
  constructor(
    public readonly service: PlaylistCrudService,
    private readonly playlistService: PlaylistService,
  ) {}

  @ApiOperation({ summary: 'create playlist' })
  @ApiBody({ type: CreatePlaylistDto })
  @Override()
  createOne(@Body() body: CreatePlaylistDto, @User('id') userId) {
    return this.playlistService.save(userId, body);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'get all playlist contents' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @UseGuards(PlaylistOwnerGuard)
  @Get('/:id/contents')
  getIncludeContents(@Param('id') playlistId: Playlist['id']) {
    return this.playlistService.findIncludeContent(playlistId);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'insert content into playlist' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiParam({ name: 'contentId', type: 'uuid' })
  @UseGuards(PlaylistOwnerGuard)
  @Post('/:id/contents/:contentId')
  insertContent(@Param('id') playlistId: Playlist['id'], @Param('contentId') contentId: Content['id']) {
    return this.playlistService.insertContent(playlistId, contentId);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'move content into playlists' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @ApiParam({ name: 'contentId', type: 'uuid' })
  @ApiBody({ type: MoveIncludeContentDto })
  @UseGuards(CheckOrderInPlaylistGuard, PlaylistOwnerGuard)
  @Post('/:id/contents/:contentId/move')
  moveIncludeContent(
    @Param('id') playlistId: Playlist['id'],
    @Param('contentId') contentId: Content['id'],
    @Body() body: MoveIncludeContentDto,
  ) {
    return this.playlistService.moveContent(playlistId, contentId, body);
  }
}
