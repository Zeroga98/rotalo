import { MessageInterface } from "./message.interface";

export interface ConversationInterface {
    'id'?: string;
    'messages': Array<MessageInterface>;
    'name': string;
    'prhoto'?: string;
    'preview'?: string;
    'product-name'?: string;
    'unread-count'?: string;
};