import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pipe, map, BehaviorSubject, mergeMap, filter, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { DashboardService } from '../dashboard/dashboard.service';

export interface User {
  login: string;
  phone: string;
  creationTime: number;
  status: string;
  email: string;
  role: string;
  salary: string;
  id?: string;
  updateTime?: number;
}
@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  users = new BehaviorSubject<User[]>([]);
  loading = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private dashBoardService: DashboardService
  ) {
    this.dashBoardService.filterParams.subscribe((params) => {
      if (params) {
        console.log(params);

        this.fetchData(params);
      } else this.fetchData();
    });
    this.dashBoardService.modifyUsers.subscribe(
      (params: { action: string; payload: string[] }) => {
        if (params) {
          const prev = this.users.value;
          params.payload.map((id) => {
            const index = prev.findIndex((el) => el.id === id);
            prev[index] = {
              ...prev[index],
              updateTime: Date.now(),
              status: params.action,
            };
            this.users.next(prev);
            this.http
              .patch(
                'https://test-task-50465-default-rtdb.europe-west1.firebasedatabase.app/users/' +
                  id +
                  '.json',
                {
                  status: params.action,
                  updateTime: Date.now(),
                }
              )
              .subscribe((response) => {});
          });
        }
      }
    );
  }
  fetchData(filterParams?: any) {
    this.loading.next(true);
    this.http
      .get(
        'https://test-task-50465-default-rtdb.europe-west1.firebasedatabase.app/users.json'
      )
      .pipe(
        map((data) => {
          const usersArray = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              usersArray.push({ ...data[key as keyof typeof data], id: key });
            }
          }
          return usersArray;
        }),
        this.pipeIf(
          (data: any) => {
            if (filterParams) return true;
            else return false;
          },
          map((data: any) => {
            const {
              login,
              role,
              salary,
              creationTime,
              updateTime,
              email,
              phone,
              status,
            } = filterParams;
            return data.filter((user: User) => {
              return (
                (login
                  ? user.login.toLowerCase() === login.toLowerCase()
                  : true) &&
                (role ? user.role === role : true) &&
                (email
                  ? user.email.toLowerCase() === email.toLowerCase()
                  : true) &&
                (salary ? user.salary === salary : true) &&
                (creationTime
                  ? this.checkDates(creationTime, user.creationTime as number)
                  : true) &&
                (updateTime
                  ? this.checkDates(updateTime, user.updateTime as number)
                  : true) &&
                (phone ? user.phone === phone : true) &&
                (status ? user.status === status : true)
              );
            });
          })
        )
      )
      .subscribe((data) => {
        this.loading.next(false);
        this.users.next(data as User[]);
      });
  }
  deleteUser(id: string) {
    const prev = this.users.value.filter((user) => user.id !== id);
    this.users.next(prev);
    this.http
      .delete(
        'https://test-task-50465-default-rtdb.europe-west1.firebasedatabase.app/users/' +
          id +
          '.json'
      )
      .subscribe((data) => {});
  }
  createUser(
    login: string,
    phone: string,
    status: string,
    email: string,
    role: string,
    salary: string
  ) {
    const user: User = {
      login,
      phone,
      creationTime: Date.now(),
      status,
      email,
      role,
      salary,
    };
    const id = uuidv4();
    const prev = [...(this.users.value as User[])];
    prev?.unshift({ ...user, id });
    this.users.next(prev);
    return this.http.put(
      'https://test-task-50465-default-rtdb.europe-west1.firebasedatabase.app/users/' +
        id +
        '.json',
      {
        ...user,
      }
    );
  }
  pipeIf(predicate: Function, pipe: any) {
    return function (source: any) {
      return source.pipe(
        mergeMap((value) => {
          if (predicate(value)) {
            return of(value).pipe(pipe);
          } else {
            return of(value);
          }
        })
      );
    };
  }
  checkDates(date1: Date, date2: number) {
    return Boolean(
      date1.getFullYear() === new Date(date2).getFullYear() &&
        date1.getMonth() === new Date(date2).getMonth() &&
        date1.getDate() === new Date(date2).getDate()
    );
  }
}
