import { UserInterface } from "./user.interface";

export interface OfferInterface{
    'accepted': boolean | string;
    'amount': number | string;
    'id': number | string;
    'regretted': boolean | string;
    'responsed-at': string;
    'user': UserInterface;
}