import { AppService } from "../app.service";
import { Ctx, Hears, InjectBot, Message, On, Start, Update } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { actionButtons } from "../buttons/app.buttons";
import { Context, TelegramUpdateMessage } from "../types/context.interface";
import { showTasks } from "../helpers/app.utilits";
import { User } from "../entities/user.entity";
import { UsersRepositories } from "./repositories/users-repositories";
import { Task } from "../entities/task.entity";

@Update()
export class AppUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>,
              private readonly appService: AppService,
              private readonly usersRepo: UsersRepositories) {
  }


  @Start()
  async startCommand(ctx: Context) {
    const idTelegram = ctx.from.id;
    const firstName = ctx.from.first_name;
    const lastName = ctx.from.last_name;

    const foundUser = await this.usersRepo.findUserById(idTelegram);
    if (foundUser.firstName === "Елена") {
      await ctx.reply("Привет дорогая моя 🦝,Добро похаловать в чат 🗿", actionButtons());
    }
    if (!foundUser) {
      await ctx.reply("Hi! My good Friend 🦝, Welcome to chat 🗿", actionButtons());
      const user = await User.createUser(idTelegram, firstName, lastName);
      await this.usersRepo.saveUser(user);
    } else {
      await ctx.replyWithHTML(`<b>Hi! 👋🏽</b> nice to meet you here: <b>${firstName}</b>`, actionButtons());
    }

  }

  @Hears("📜 Список дел")
  async listTask(ctx: Context) {
    const idTelegram = ctx.from.id;
    const listTasks = await this.usersRepo.findTask(idTelegram);
    if (!listTasks) {
      await ctx.replyWithHTML(`У тебя нет запланированных задач 📝`);
    } else {
      await ctx.replyWithHTML(showTasks(ctx, listTasks));
    }
  }

  @Hears("🤪 Выполнено")
  async doneTask(ctx: Context) {
    ctx.session.type = "done";
    await ctx.reply("Напиши ID задания:");
  }

  @Hears("🖊 Редактировать")
  async editTask(ctx: Context) {
    ctx.session.type = "edit";
    await ctx.deleteMessage();
    await ctx.replyWithHTML("Напиши ID задания: и новое название задачи: \n\n" +
      "В формате: <b>1_Новое название</b>");
  }

  @Hears("📌 Добавить")
  async addTask(ctx: Context) {
    ctx.session.type = "add";
    await ctx.deleteMessage();
    await ctx.replyWithHTML("Напиши ID задания: и новое название задачи: \n\n" +
      "В формате: <b>1_Новое название</b>");
  }

  @Hears("❌ Удаление")
  async deleteTask(ctx: Context) {
    ctx.session.type = "remove";
    await ctx.reply("Напиши ID задания:");
  }

  @Hears("⏰ Время")
  async getTime(ctx: Context) {
    ctx.session.type = "time";

    // console.log(await ctx.sendMessage())
    await ctx.replyWithHTML(`<b>${new Date().toTimeString().split(" ")[0]}</b>`);
  }

  @Hears("📸 Random photo")
  async randomPhoto(ctx: Context) {
    ctx.session.type = "random";
    await ctx.replyWithPhoto({
      url: "https://picsum.photos/500/600/?random",
      filename: "kitten.jpg"
    });
  }

  @On("text")
  async getMessage(@Message("text") message: string,
                   @Ctx() ctx: Context,
                   @Ctx() payload: TelegramUpdateMessage
  ) {
    if (!ctx.session.type) return;
    const idTelegram = ctx.from.id;
    // if (payload.message.text === "Сколько времени?") {
    //   await ctx.deleteMessage();
    //   await ctx.replyWithHTML(`<b>${new Date().toLocaleDateString().split("/").join(":")}</b>`);
    //   return
    // }
    // if (payload.message.text.toLowerCase() === "как меня зовут?") {
    //   await ctx.replyWithHTML(`Тебя зовут <b>${payload.message.from.first_name}</b>`);
    //   return
    // }
    // if (payload.message.text.toLowerCase() === "привет") {
    //   await ctx.replyWithHTML(`Hi! My good Friend -- <b>${payload.message.from.first_name}</b>`);
    //   return;
    // }
    // if (payload.message.text.toLowerCase() === "hi") {
    //   await ctx.replyWithHTML(`Hi! My good Friend -- <b>${payload.message.from.first_name}</b>`);
    //   return;
    // }
    // if (payload.message.text.toLowerCase() === "hello") {
    //   await ctx.replyWithHTML(`Hi! My good Friend -- <b>${payload.message.from.first_name}</b>`);
    //   return;
    // }
    const [taskId, title] = message.split("_");
    if (!taskId) {
      await ctx.deleteMessage();
      await ctx.replyWithHTML(`<b>Sorry</b>, я тупаватый бот 🤖. \n\n     Введите корректные данные`);
      return;
    }
    if (ctx.session.type === "remove") {
      const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
      if (!task) {
        await ctx.deleteMessage();
        await ctx.reply(`Not found with id: ${message}`);
        return;
      }
      await this.usersRepo.deleteTask(Number(taskId));
      const todos = await this.usersRepo.findTask(idTelegram);
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.replyWithHTML(`У тебя нет запланированных задач 📝`);
        return;
      }
      await ctx.replyWithHTML(showTasks(ctx, todos));
      return;
    }
    if (ctx.session.type === "done") {
      const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
      if (!task) {
        await ctx.deleteMessage();
        await ctx.reply(`Not found with id: ${message}`);
        return;
      }
      task.isCompletedTask();
      await this.usersRepo.saveTask(task);
      const todos = await this.usersRepo.findTask(idTelegram);
      await ctx.replyWithHTML(showTasks(ctx, todos));
      return;
    }
    if (!title) {
      await ctx.deleteMessage();
      await ctx.replyWithHTML(`<b>Sorry</b>, я тупаватый бот 🤖. \n\n     Введите корректные данные`);
      return;
    }
    if (ctx.session.type === "add") {
      const user = await this.usersRepo.findUserById(idTelegram);
      const task = Task.createTask(Number(taskId), idTelegram, title, user);
      await this.usersRepo.saveTask(task);
      const todo = await this.usersRepo.findTask(idTelegram);
      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply(`Not found with id: ${message}`);
        return;
      }
      await ctx.replyWithHTML(showTasks(ctx, todo));
      return;
    }

    if (ctx.session.type === "edit") {
      const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
      if (!task) {
        await ctx.deleteMessage();
        await ctx.reply(`Not found with id: ${message}`);
        return;
      }
      task.updateTask(title);
      await this.usersRepo.saveTask(task);
      const todos = await this.usersRepo.findTask(idTelegram);
      await ctx.replyWithHTML(showTasks(ctx, todos));
      return;
    }




    return



  }



}
