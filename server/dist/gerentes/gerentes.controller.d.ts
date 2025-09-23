import { GerentesService } from './gerentes.service';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { Gerente } from './entities/gerente.entity';
export declare class GerentesController {
    private readonly gerentesService;
    constructor(gerentesService: GerentesService);
    create(createGerenteDto: CreateGerenteDto): Promise<Gerente>;
    findAll(): Promise<Gerente[]>;
    findOne(id: string): Promise<Gerente | null>;
}
