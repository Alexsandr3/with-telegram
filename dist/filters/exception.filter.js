"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = exports.ErrorExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let ErrorExceptionFilter = class ErrorExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (process.env.envoirment !== `production`) {
            response
                .status(500)
                .send({ error: exception.toString(), stack: exception.stack });
        }
        else {
            response.status(500).send(`some error occurred`);
        }
    }
};
ErrorExceptionFilter = __decorate([
    (0, common_1.Catch)(Error)
], ErrorExceptionFilter);
exports.ErrorExceptionFilter = ErrorExceptionFilter;
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        if (status === 400) {
            const errorResponse = [];
            const responseBody = exception.getResponse();
            try {
                responseBody.message.forEach((m) => errorResponse.push(m));
                response.status(status).json({
                    errorsMessages: errorResponse,
                });
            }
            catch (e) {
                return response.status(status).send({
                    errorsMessages: [responseBody],
                });
            }
        }
        else {
            return response.status(status).send(exception.message);
        }
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=exception.filter.js.map