"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showTasks = void 0;
const showTasks = (ctx, todos) => `<b>${ctx.from.first_name}</b> у тебя есть вот такое задание:` + '\n\n' +
    `${todos.map((t) => (t.isCompleted ? '✅' : '☞') + ' ' + `<b>${t.id} - ${t.title}</b>` + '\n\n').join('')}`;
exports.showTasks = showTasks;
//# sourceMappingURL=app.utilits.js.map