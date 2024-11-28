import { Message } from "../models/messages.models";

export function toMessage(role: 'system' | 'user' | 'assistant', content: string) {
    return {
        role: role,
        content: content,
    } as Message;
}
