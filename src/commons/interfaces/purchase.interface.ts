import { UserInterface } from './user.interface';
export interface PurchaseInterface {
    amount: number;
    'buyer-rate': null | number;
    'confirmed-at': null | string;
    id: string;
    'payment-type':string;
    'seller-rate': string | number
    user:UserInterface
}