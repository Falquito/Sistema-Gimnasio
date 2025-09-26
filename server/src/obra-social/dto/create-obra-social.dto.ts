import { IsString } from "class-validator";

export class CreateObraSocialDto {
    @IsString()
    nombre:string;
}
