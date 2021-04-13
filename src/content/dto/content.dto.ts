import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Playlist } from "src/playlists/entity/playlist.entity";
import { ContentType } from "../entity/content.entity";

export class CreateContentDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    contentType: ContentType

    @ApiProperty()
    @IsOptional()
    @IsArray()
    playlistsId: Playlist['id'][]
}

export class UpdateContentDto {
    @ApiProperty()
    @IsOptional()
    name?:string

    @ApiProperty()
    @IsOptional()
    contentType?: ContentType

    @ApiProperty()
    @IsOptional()
    @IsArray()
    playlistsId?: Playlist['id'][]

    @IsOptional()
    @IsPositive()
    @IsNumber()
    priority?:number
}