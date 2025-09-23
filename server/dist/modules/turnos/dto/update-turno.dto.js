"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTurnoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const crear_turno_dto_1 = require("./crear-turno.dto");
class UpdateTurnoDto extends (0, mapped_types_1.PartialType)(crear_turno_dto_1.CrearTurnoDto) {
}
exports.UpdateTurnoDto = UpdateTurnoDto;
//# sourceMappingURL=update-turno.dto.js.map