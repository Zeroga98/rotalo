import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  public products;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUserListLikes();
  }

  loadUserListLikes() {
    this.userService.loadUserListLikes().subscribe((response) => {
      if (response) {
        this.products = response;
        console.log(response);
      }
    }, (error) => {
      if (error.status) {
        console.log(error);
      }
    });
  }
}
