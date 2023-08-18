import { Component, OnInit } from '@angular/core';
import { Subject, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

import { enterLeaveAnimation } from '../shared/enter-leave-animation';
import { hamburgerAnimation } from '../shared/hamburger-menu-animation';
import { DataStorageService } from '../shared/data-storage/data-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [enterLeaveAnimation, hamburgerAnimation],
})
export class DashboardComponent implements OnInit {
  filter = false;
  usersSelected = false;
  changeStatus = new Subject<string>();
  isSmallScreen$ = this.breakpointObserver
    .observe(['(max-width: 1150px)'])
    .pipe(map((result: any) => result.matches));
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.dataStorageService.fetchData();
  }
  usersSelectedStatusChange(condition: boolean) {
    this.usersSelected = condition;
  }
  filterToggle() {
    this.filter = !this.filter;
  }
  modify(type: string): void {
    this.changeStatus.next(type);
  }
}

const app = {
  page: { total: 2, current: 1, size: 3 },
  users: [
    {
      id: 1,
      name: 'iivanov',
      email: 'asidorov@vtb.ru',
      phone: 79991234567,
      create_at: 1681721695,
      update_at: 1681724695,
    },
    {
      id: 2,
      name: 'petrov',
      email: 'petrov@vtb.ru',
      phone: 79991234599,
      create_at: 1681711695,
      update_at: 1681764695,
    },
  ],
  data: [
    { user_id: 2, is_admin: false, is_ecp: false, status: 'ACTIVE' },
    { user_id: 2, is_admin: true, is_ecp: true, status: 'ACTIVE' },
    { user_id: 1, is_admin: true, is_ecp: false, status: 'ACTIVE' },
  ],
};
