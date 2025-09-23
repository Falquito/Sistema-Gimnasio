"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGerenteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_gerente_dto_1 = require("./create-gerente.dto");
class UpdateGerenteDto extends (0, mapped_types_1.PartialType)(create_gerente_dto_1.CreateGerenteDto) {
}
exports.UpdateGerenteDto = UpdateGerenteDto;
//# sourceMappingURL=update-gerente.dto.js.map