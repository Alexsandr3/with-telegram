"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const process = require("process");
const getConfiguration = () => ({
    PORT: parseInt(process.env.PORT, 10),
    CURRENT_APP_BASE_URL: process.env.CURRENT_APP_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    tokens: {
        TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,
    },
    database: {
        PGSQL_ELEPHANT_URI: process.env.PGSQL_ELEPHANT_URI
    }
});
exports.getConfiguration = getConfiguration;
//# sourceMappingURL=configuration.js.map