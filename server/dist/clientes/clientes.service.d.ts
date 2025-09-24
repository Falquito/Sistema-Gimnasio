import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { DataSource } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
export declare class ClientesService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    create(createClienteDto: CreateClienteDto): Promise<Cliente>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateClienteDto: UpdateClienteDto): string;
    remove(id: number): string;
}
