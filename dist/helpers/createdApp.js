"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createdApp = void 0;
const common_1 = require("@nestjs/common");
const cookie_parser_1 = require("cookie-parser");
const exception_filter_1 = require("../filters/exception.filter");
const class_validator_1 = require("class-validator");
const app_module_1 = require("../app.module");
const createdApp = (app) => {
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
            const errorsForRes = [];
            errors.forEach((e) => {
                const constrainKeys = Object.keys(e.constraints);
                constrainKeys.forEach((ckey) => {
                    errorsForRes.push({
                        message: e.constraints[ckey],
                        field: e.property
                    });
                });
            });
            throw new common_1.BadRequestException(errorsForRes);
        }
    }));
    app.enableCors({});
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new exception_filter_1.ErrorExceptionFilter(), new exception_filter_1.HttpExceptionFilter());
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    return app;
};
exports.createdApp = createdApp;
//# sourceMappingURL=createdApp.js.map