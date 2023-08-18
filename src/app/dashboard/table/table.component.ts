import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  DataStorageService,
  User,
} from 'src/app/shared/data-storage/data-storage.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy {
  selectedUsers: number[] = [];
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
  @Input() changeStatus = new Subject<string>();
  @Output() usersSelected = new EventEmitter();
  constructor(private dataService: DataStorageService) {}
  ngOnInit(): void {
    this.subscription.add(
      this.dataService.users.subscribe((users) => {
        this.users = users as User[];
        this.selectedUsers = [];
        this.usersSelected.next(false);
        this.dataSource = new MatTableDataSource(this.users as User[]);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.translateMatPaginator(this.paginator);
        }, 0);
      })
    );
    this.subscription.add(
      this.dataService.loading.subscribe((condition) => {
        this.loading = condition;
      })
    );
    this.subscription.add(
      this.changeStatus.subscribe((action) => {
        if (this.selectedUsers.length > 0) {
          console.log(action);

          this.dataService.changeStatus(action, this.selectedUsers);
        }
      })
    );
  }
  onCheckboxChange(element: string | number, event: Event) {
    if (element === 'all') {
      if ((event.target as HTMLInputElement).checked) {
        this.selectedUsers = [];
        this.usersSelected.next(true);
        this.users.map((user) => {
          this.selectedUsers.push(user.id);
        });
      } else {
        this.selectedUsers = [];
        this.usersSelected.next(false);
      }
    } else {
      if ((event.target as HTMLInputElement).checked) {
        this.selectedUsers.push(element as number);
        this.usersSelected.next(true);
      } else {
        this.selectedUsers = this.selectedUsers.filter((id) => id !== element);
        if (this.selectedUsers.length === 0) {
          this.usersSelected.next(false);
        }
      }
    }
  }
  syncPrimaryPaginator(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.paginator.page.emit(event);
  }
  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'Первая страница';
    paginator._intl.itemsPerPageLabel = 'Отображать';
    paginator._intl.lastPageLabel = 'Последняя страница';
    paginator._intl.nextPageLabel = 'Следуюшая страница';
    paginator._intl.previousPageLabel = 'Предыдущая страница';
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
