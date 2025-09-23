"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawHeaders = void 0;
const common_1 = require("@nestjs/common");
exports.RawHeaders = (0, common_1.createParamDecorator)((data, ctx) => {
    const { rawHeaders } = ctx.switchToHttp().getRequest();
    return rawHeaders;
});
//# sourceMappingURL=raw-header.decorator.js.map