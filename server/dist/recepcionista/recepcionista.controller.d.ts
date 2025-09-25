import { RecepcionistaService } from './recepcionista.service';
import { CreateRecepcionistaDto } from './dto/create-recepcionista.dto';
export declare class RecepcionistaController {
    private readonly recepcionistaService;
    constructor(recepcionistaService: RecepcionistaService);
    create(createRecepcionistaDto: CreateRecepcionistaDto): Promise<import("../entities/entities/Recepcionista.entity").Recepcionista>;
    findAll(): Promise<import("../entities/entities/Recepcionista.entity").Recepcionista[]>;
    findOne(id: string): Promise<import("../entities/entities/Recepcionista.entity").Recepcionista | null>;
}
