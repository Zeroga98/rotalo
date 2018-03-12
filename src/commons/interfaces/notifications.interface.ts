import { ProductInterface } from "./product.interface";
import { UserInterface } from "./user.interface";
import { MessageInterface } from "./message.interface";
import { OfferInterface } from "./offer.interface";

export interface NotificationsInterface {
    'at': string;
    'id': string | number;
    'new': boolean | string;
    'message': MessageInterface;
    'notification-type': string;
    'offer': OfferInterface;
    'product': ProductInterface;
    'status': string;
    'user': UserInterface;

}