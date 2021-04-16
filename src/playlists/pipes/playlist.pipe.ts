import {
  ArgumentMetadata,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PlaylistCrudService } from '../playlists.service';

@Injectable()
export class CheckPlaylistExsist implements PipeTransform {
  constructor(
    @Inject('PlaylistCrudService')
    private readonly playlistService: PlaylistCrudService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    const playlist = await this.playlistService.findOne(
      value.parsed.paramsFilter[0].value,
    );
    if (!playlist) {
      throw new NotFoundException('playlist dont exsist');
    }
    return value;
  }
}
