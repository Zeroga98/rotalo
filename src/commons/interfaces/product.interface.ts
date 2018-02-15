import { SubcategoryInterface } from './subcategory.interface';
import { UserInterface } from './user.interface';
import { PhotoInterface } from './photo.interface';
export interface ProductInterface {
    'currency': string;
    'current-bid': number;
    'description': string;
    'id':string | number;
    'name':string;
    'negotiable':boolean;
    'photos': PhotoInterface;
    'price': number;
    'publish-until':string;
    'published-at':string;
    'received':boolean
    'received-at':null | boolean;
    'sell-type':string;
    'status':string;
    'subcategory'?: SubcategoryInterface;
    'used':boolean;
    'user'?: UserInterface;
    'visible':boolean;
};