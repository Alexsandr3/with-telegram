"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showList = void 0;
const showList = (ctx, todos) => `<b>${ctx.from.first_name}</b> у тебя есть вот такое задание:` + '\n\n' +
    `${todos.map((t) => (t.isCompleted ? '✅' : '☞') + ' ' + `<b>${t.id} - ${t.title}</b>` + '\n\n').join('')}`;
exports.showList = showList;
//# sourceMappingURL=app.utilits.js.map