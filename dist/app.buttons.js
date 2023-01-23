"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionButtons = void 0;
const telegraf_1 = require("telegraf");
function actionButtons() {
    return telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.callback('📜 Список дел', 'list'),
        telegraf_1.Markup.button.callback('📌 Добавить', 'add'),
        telegraf_1.Markup.button.callback('🖊 Редактировать', 'edit'),
        telegraf_1.Markup.button.callback('🤪 Выполнено', 'done'),
        telegraf_1.Markup.button.callback('❌ Удаление', 'delete')
    ], {
        columns: 6
    });
}
exports.actionButtons = actionButtons;
//# sourceMappingURL=app.buttons.js.map