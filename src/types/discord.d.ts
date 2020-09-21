import { Message } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, Command>
    }

    export interface Command {
        name: string,
        description: string,
        enabled?: boolean
        allowedUsers?: string[],
        allowedGuilds?: string[],
        execute: (message: Message, args: string[]) => void
    }
}