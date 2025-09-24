"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClienteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_cliente_dto_1 = require("./create-cliente.dto");
class UpdateClienteDto extends (0, swagger_1.PartialType)(create_cliente_dto_1.CreateClienteDto) {
}
exports.UpdateClienteDto = UpdateClienteDto;
//# sourceMappingURL=update-cliente.dto.js.map