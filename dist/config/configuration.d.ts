export declare const getConfiguration: () => {
    PORT: number;
    CURRENT_APP_BASE_URL: string;
    NODE_ENV: string;
    tokens: {
        TOKEN_TELEGRAM: string;
    };
    database: {
        PGSQL_ELEPHANT_URI: string;
    };
};
export type ConfigType = ReturnType<typeof getConfiguration>;
