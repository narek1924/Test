import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  inputType = new BehaviorSubject<string>('');
  filterParams = new BehaviorSubject<any>(null);
  modifyUsers = new BehaviorSubject<any>(null);

  constructor() {}
  filterReset() {
    if (this.filterParams.value) {
      this.filterParams.next(null);
    }
  }
  changeInputType(type: string) {
    const prev = this.inputType.value;
    if (type === prev) {
      this.inputType.next('');
      if (prev === 'add') {
        return;
      }
      this.filterParams.next(null);
    } else {
      this.inputType.next(type);
    }
  }
}
