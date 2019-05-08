import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import * as moment from 'moment';
import { MatTableDataSource, MatSort, MatTabChangeEvent } from '@angular/material';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  searchText = '';
  selectState = '';
  edit: string = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.UPLOAD}/`;
  dataSource;
  displayedColumns = ['id', 'name', 'idNumber', 'email',
  'lastSignInAt', 'signInCount', 'createdAt',
  'deletedAt', 'city', 'country', 'company', 'contentAdmin', 'state', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  private currentFilter: Object = {
    'size': 5,
    'number': 1,
    'active': true
  };

  constructor(private router: Router,  private userService: UserService) { }

  ngOnInit() {
   this.getUserList(this.currentFilter);
  }

  ngAfterViewInit (){

  }

  async getUserList(params: Object = {}) {
    try {
      let listUsers;
      listUsers = await this.userService.getUsers(params);
      if (listUsers.usuarios) {

        listUsers.usuarios.map((item) => {
          if (item['lastSignInAt']) {
            const dateMoment: any = moment(item['lastSignInAt']);
            item['lastSignInAt'] = dateMoment.format('DD/MM/YYYY');
          }

          if (item['createdAt']) {
            const dateMoment: any = moment(item['createdAt']);
            item['createdAt'] = dateMoment.format('DD/MM/YYYY');
          }

          if (item['deletedAt']) {
            const dateMoment: any = moment(item['deletedAt']);
            item['deletedAt'] = dateMoment.format('DD/MM/YYYY');
          }

          if (item['deletedAt']) {
            item['state'] = false;
          } else {
            item['state'] = true;
          }

        });

        this.dataSource = new MatTableDataSource(listUsers.usuarios);
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'city': return item.city.name;
            case 'country': return item.city.state.country.name;
            case 'company': return item.company.name;
            default: return item[property];
          }
        };
        this.dataSource.sort = this.sort;
        console.log(listUsers);
      }

    } catch (error) {
      console.log(error);
    }
  }



  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
  }

}
