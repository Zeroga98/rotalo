import { SubcategoryInterface } from './subcategory.interface';

export interface CategoryInterface {
    id: string | number;
    icon?: string;
    color?: string;
    url: string;
    name:string;
    subcategories?:Array<SubcategoryInterface>;
}