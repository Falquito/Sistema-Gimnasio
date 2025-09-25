"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePacienteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_paciente_dto_1 = require("./create-paciente.dto");
class UpdatePacienteDto extends (0, swagger_1.PartialType)(create_paciente_dto_1.CreatePacienteDto) {
}
exports.UpdatePacienteDto = UpdatePacienteDto;
//# sourceMappingURL=update-paciente.dto.js.map