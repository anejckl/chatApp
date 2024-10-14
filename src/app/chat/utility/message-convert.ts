import { Message } from "../../models/messages.models";

export function toMessage(role: 'system' | 'user' | 'assistant', content: string, system?: string) {
    return {
        role: role,
        content: content,
        system: system
    } as Message;
}
