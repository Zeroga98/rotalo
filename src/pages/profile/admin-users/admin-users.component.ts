import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import * as moment from 'moment';
import { MatTableDataSource, MatSort, MatTabChangeEvent, MatTabGroup, MatPaginator } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { UtilsService } from './../../../util/utils.service';
import { SettingsService } from '../../../services/settings.service';


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  name = '';
  idNumber = '';
  since = '';
  until = '';
  email = '';
  @ViewChild('tabs') tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  edit: string = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.EDITUSERS}/`;

  dataSource;
  displayedColumns = ['id', 'name', 'idNumber', 'email',
  'lastSignInAt', 'signInCount', 'createdAt',
  'deletedAt', 'city', 'country', 'company', 'contentAdmin', 'status', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  itemsPerPage = 10;
  public currentFilter: Object = {
    'size': this.itemsPerPage,
    'number': 1,
    'active': true
  };
  public totalUsers = 0;
  constructor(private utilService: UtilsService, private userService: UserService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.getUserList(this.currentFilter);
  }

  ngAfterViewInit() {

  }

  getFormatDate(date) {
    if (date) {
      const dateMoment: any = moment(date);
      return dateMoment.format('DD/MM/YYYY');
    }
    return '';
  }

  async getUserList(params: Object = {}) {
    try {
      let listUsers;
      listUsers = await this.userService.getUsers(params);
      this.totalUsers = listUsers.totalUsuarios;

      if (listUsers.usuarios) {

        listUsers.usuarios.map((item) => {
          if (item['deletedAt']) {
            item['status'] = false;
          } else {
            item['status'] = true;
          }
        });

        this.dataSource = new MatTableDataSource(listUsers.usuarios);
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'city': return item.city.name;
            case 'country': return item.city.state.country.name;
            case 'company': return item.company.name;
            default: return item[property];
          }
        };
        this.dataSource.sort = this.sort;
      }

    } catch (error) {
      console.log(error);
    }
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.setInitialValues();
    switch (tabChangeEvent.index) {
      case 0:
        this.currentFilter = {
          'size': this.itemsPerPage,
          'number': 1,
          'active': true
        };
        break;
      case 1:
        this.currentFilter = {
          'size': this.itemsPerPage,
          'number': 1,
          'active': false
        };
        break;
      case 2:
        this.currentFilter = {
          'size': this.itemsPerPage,
          'number': 1,
          'content_admin': true
        };
        break;
      default:
        this.currentFilter = {
          'size': this.itemsPerPage,
          'number': 1,
          'active': true
        };
        break;
    }
    this.getUserList(this.currentFilter);
  }

  setFilter() {
   this.resetPaginator () ;
   this.name = this.name.replace(/\s/g, '');
   this.idNumber = this.idNumber.replace(/\s/g, '');
   this.email = this.email.replace(/\s/g, '');
   this.since = this.since.replace(/\s/g, '');
   this.until = this.until.replace(/\s/g, '');

   const filter = {
      name: this.name ? `/${this.name}/`  : '' ,
      id_number: this.idNumber ? `/${ this.idNumber}/` : '',
      email: this.email ? `/${this.email}/`  : '' ,
      created_at_from: this.since ? this.since : '',
      created_at_until: this.until ? this.until : ''
    };
    this.currentFilter = Object.assign({}, this.currentFilter, filter);
    this.currentFilter = this.utilService.removeEmptyValues(this.currentFilter);
    this.getUserList(this.currentFilter);
  }

  setInitialValues() {
    this.name = '';
    this.idNumber = '';
    this.since = '';
    this.until = '';
    this.email = '';
    this.resetPaginator () ;
  }

  resetPaginator () {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.itemsPerPage;
  }

  removeFilter() {
    this.setInitialValues();
    this.currentFilter = {
      'size': this.itemsPerPage,
      'number': 1,
      'active': true
    };
    this.tabGroup.selectedIndex = 0;
    this.getUserList(this.currentFilter);
  }

  changeStatus(check, idUser) {
    check = !check;
    const param =  {
      activar: check,
      idUsuario: idUser
    };
    this.userService.changeStatusUserAdmin(param).subscribe((response) => {
      this.getUserList(this.currentFilter);
    }, (error) => {
      if (error.error) {
        this.getUserList(this.currentFilter);
        alert(error.error.message);
      }
      console.log(error, 'error');
    });
  }

  getPaginatorData($event) {
    const filter = {
      'size': $event.pageSize,
      'number': $event.pageIndex + 1,
    };
    this.currentFilter = Object.assign({}, this.currentFilter, filter);
    this.getUserList(this.currentFilter);
  }

  getUrlUser (idUser) {
    return this.edit + idUser;
  }

}
