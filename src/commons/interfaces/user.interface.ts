import { CityInterface } from './city.interface';
import { CompanyInterface } from "./company.interface";

export interface UserInterface {
    'cellphone': string;
    'city': CityInterface;
    'city-id': number;
    'company': CompanyInterface;
    'email': string;
    'hobbies': string;
    'id': string;
    'id-number': string;
    'name': string;
    'notification-last-read-at':string;
    'selling': number;
    'staged': number;
    'sufi-credit-amount': string;
    'sufi-credit-available': string;
    'unread-notifications': number;
    'photo': string;
};
