import { Message } from "discord.js";

type CommandArgs = {
    name: string;
    description?: string;
}

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, Command>
    }

    export interface Command {
        name: string,
        description: string,
        args?: CommandArgs[], 
        enabled?: boolean,
        allowedUsers?: string[],
        allowedGuilds?: string[],
        execute: (message: Message, args: string[]) => Promise<unknown>
    }
}