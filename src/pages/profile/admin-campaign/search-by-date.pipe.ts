import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'searchByDate' })
export class SearchByNamePipe implements PipeTransform {
  transform(campaigns, searchText: string, selectState: string) {
    return campaigns.filter(campaign => {
       return campaign.date.indexOf(searchText) !== -1 && campaign.estado.indexOf(selectState) !== -1;
    });
  }
}
