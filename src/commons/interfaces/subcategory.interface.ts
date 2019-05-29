import { CategoryInterface } from './category.interface';

export interface SubcategoryInterface {
    category:CategoryInterface;
    id:string | number;
    name:string;
    url:string;
    generos: any;
}
