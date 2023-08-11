import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  DataStorageService,
  User,
} from 'src/app/data-storage/data-storage.service';
import { Subscription, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() modifyUsers!: string;
  selectedUsers: string[] = [];
  displayedColumns: string[] = [
    'actions',
    'login',
    'email',
    'phone',
    'role',
    'updateTime',
    'creationTime',
    'status',
    'salary',
  ];
  dataSource!: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscription = new Subscription();
  users!: User[];
  loading = false;
  constructor(
    private dataService: DataStorageService,
    private dashBoardService: DashboardService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.modifyUsers && this.selectedUsers.length > 0) {
      this.dashBoardService.modifyUsers.next({
        action: this.modifyUsers,
        payload: this.selectedUsers,
      });
    }
  }
  ngOnInit(): void {
    this.subscription.add(
      this.dataService.users.subscribe((users) => {
        this.users = users as User[];
        this.dataSource = new MatTableDataSource(this.users as User[]);
        this.dataSource.paginator = this.paginator;
      })
    );
    this.subscription.add(
      this.dataService.loading.subscribe((condition) => {
        this.loading = condition;
      })
    );
  }
  deleteUser(userId: string) {
    this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
    this.dataService.deleteUser(userId);
  }
  onCheckboxChange(element: string, event: Event) {
    if (element === 'all') {
      if ((event.target as HTMLInputElement).checked) {
        this.dashBoardService.usersSelected.next(true);
        this.users.map((user) => {
          this.selectedUsers.push(user.id as string);
        });
      } else {
        this.selectedUsers = [];
        this.dashBoardService.usersSelected.next(false);
      }
    } else {
      if ((event.target as HTMLInputElement).checked) {
        this.selectedUsers.push(element);
        this.dashBoardService.usersSelected.next(true);
      } else {
        this.selectedUsers = this.selectedUsers.filter((id) => id !== element);
        if (this.selectedUsers.length === 0) {
          this.dashBoardService.usersSelected.next(false);
        }
      }
    }
  }
  convertToDate(miliSeconds: number) {
    let date = new Date(miliSeconds);
    return (
      ('0' + date.getDate()).slice(-2) +
      '.' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '.' +
      date.getFullYear()
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
