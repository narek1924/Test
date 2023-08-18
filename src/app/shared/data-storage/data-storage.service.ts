import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pipe, map, BehaviorSubject, mergeMap, of } from 'rxjs';

export interface User {
  name: string;
  phone: number;
  create_at: number;
  status: string;
  email: string;
  is_admin: boolean;
  is_ecp: boolean;
  id: number;
  update_at: number;
}
interface ResponseType {
  page: { total: number; current: number; size: number };
  users: {
    id: number;
    name: string;
    email: string;
    phone: number;
    create_at: number;
    update_at: number;
  }[];
  data: {
    user_id: number;
    is_admin: boolean;
    is_ecp: boolean;
    status: string;
  }[];
}
@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  users = new BehaviorSubject<User[]>([]);
  loading = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}
  fetchData(filterParams?: any) {
    this.loading.next(true);
    this.http
      .get<ResponseType>(
        'http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/'
      )
      .pipe(
        map((data) => {
          const userMap = new Map(data.users.map((user) => [user.id, user]));

          const result: User[] = [];

          data.data.forEach((item) => {
            const user = userMap.get(item.user_id);

            if (user) {
              result.push({
                ...item,
                id: Math.random(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                create_at: user.create_at,
                update_at: user.update_at,
              });
            }
          });
          return result;
        }),
        this.pipeIf(
          (data: any) => {
            if (filterParams) return true;
            else return false;
          },
          map((data: any) => {
            const {
              login,
              is_admin,
              create_at,
              update_at,
              email,
              phone,
              status,
            } = filterParams;
            return data.filter((user: User) => {
              return (
                (login
                  ? user.name.toLowerCase().includes(login.toLowerCase())
                  : true) &&
                (email
                  ? user.email.toLowerCase() === email.toLowerCase()
                  : true) &&
                (create_at
                  ? this.checkDates(create_at, user.create_at as number)
                  : true) &&
                (update_at
                  ? this.checkDates(update_at, user.update_at as number)
                  : true) &&
                (phone ? user.phone === phone : true) &&
                (status ? user.status === status : true) &&
                user.is_admin === is_admin
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
  changeStatus(status: string, id: number[]) {
    let prev = this.users.value;
    id.map((id) => {
      const index = prev.findIndex((user) => user.id === id);
      prev[index].status = status;
    });

    this.users.next(prev);
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
