import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { enterLeaveAnimation } from '../shared/enter-leave-animation';
import { DashboardService } from './dashboard.service';
import { hamburgerAnimation } from '../shared/hamburger-menu-animation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [enterLeaveAnimation, hamburgerAnimation],
})
export class DashboardComponent implements OnInit, OnDestroy {
  inputType = '';
  modifyUsers = '';
  usersSelected = false;
  subscription = new Subscription();
  isSmallScreen$ = this.breakpointObserver
    .observe(['(max-width: 1024px)'])
    .pipe(map((result: any) => result.matches));
  constructor(
    private dashBoardService: DashboardService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.dashBoardService.inputType.subscribe((type) => {
        this.inputType = type;
      })
    );
    this.subscription.add(
      this.dashBoardService.usersSelected.subscribe((condition) => {
        console.log(condition);

        this.usersSelected = condition;
      })
    );
  }
  modify(type: string): void {
    this.modifyUsers = type;
    setTimeout(() => {
      this.modifyUsers = '';
    }, 0);
  }
  inputToggle(type: string) {
    this.dashBoardService.changeInputType(type);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
