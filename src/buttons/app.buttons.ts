import {Markup} from "telegraf";

export function actionButtons(){
    return Markup.keyboard(
        [
            Markup.button.callback('📜 Список дел','list'),
            Markup.button.callback('📌 Добавить','add'),
            Markup.button.callback('🖊 Редактировать','edit'),
            Markup.button.callback('🤪 Выполнено','done'),
            Markup.button.callback('❌ Удаление','delete'),
            Markup.button.callback('⏰ Время','time'),
            Markup.button.callback('📸 Random photo','random')
        ],
        {
            columns: 2
        }

    )
}