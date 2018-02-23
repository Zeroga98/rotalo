import { SubcategoryInterface } from './subcategory.interface';
export interface CategoryInterface {
    id: string | number;
    url: string;
    name:string;
    subcategories?:Array<SubcategoryInterface>;
}