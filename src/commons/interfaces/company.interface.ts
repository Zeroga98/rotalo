import { CommunityInterface } from './community.interface';
export interface CompanyInterface {
    'name': string;
    'colour': string;
    'community': CommunityInterface;
    'id': string;
}