import { Context as ContextTelegraf } from "telegraf";
export interface Context extends ContextTelegraf {
    session: {
        type?: 'done' | 'edit' | 'remove' | 'add' | 'time' | "random";
    };
}
export interface TelegramUpdateMessage {
    message: {
        from: {
            id: number;
            first_name: string;
        };
        text: string;
    };
}
