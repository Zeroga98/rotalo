
import { PhotoInterface } from './photo.interface';

export interface ProductInterface {
    'description': string;
    'id'?: string | number;
    'name': string;
    'photos'?: PhotoInterface;
    'price': number | string;
    'stock': number | string;
}
