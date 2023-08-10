import { Component, OnInit, OnDestroy } from '@angular/core';
import { enterLeaveAnimation } from '../shared/enter-leave-animation';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [enterLeaveAnimation],
})
export class DashboardComponent implements OnInit, OnDestroy {
  inputType = '';
  modifyUsers = '';
  subscription!: Subscription;
  constructor(private dashBoardService: DashboardService) {}

  ngOnInit(): void {
    this.subscription = this.dashBoardService.inputType.subscribe((type) => {
      this.inputType = type;
    });
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
