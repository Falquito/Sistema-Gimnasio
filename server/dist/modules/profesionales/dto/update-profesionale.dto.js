"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfesionaleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_profesionale_dto_1 = require("./create-profesionale.dto");
class UpdateProfesionaleDto extends (0, mapped_types_1.PartialType)(create_profesionale_dto_1.CreateProfesionaleDto) {
}
exports.UpdateProfesionaleDto = UpdateProfesionaleDto;
//# sourceMappingURL=update-profesionale.dto.js.map