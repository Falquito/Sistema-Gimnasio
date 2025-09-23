import { GerentesService } from './gerentes.service';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { UpdateGerenteDto } from './dto/update-gerente.dto';
export declare class GerentesController {
    private readonly gerentesService;
    constructor(gerentesService: GerentesService);
    create(createGerenteDto: CreateGerenteDto): Promise<import("./entities/gerente.entity").Gerente>;
    findAll(): Promise<import("./entities/gerente.entity").Gerente[]>;
    findOne(id: string): Promise<import("./entities/gerente.entity").Gerente | null>;
    update(id: string, updateGerenteDto: UpdateGerenteDto): string;
    remove(id: string): string;
}
