import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosService {
    create(createServicioDto: CreateServicioDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateServicioDto: UpdateServicioDto): string;
    remove(id: number): string;
}
