import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage/data-storage.service';
import {
  emailValidator,
  loginValidator,
  phoneNumberValidator,
} from './validators';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  filtered = false;
  @Output() close = new EventEmitter();
  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl('', loginValidator),
      phone: new FormControl('', phoneNumberValidator),
      creationTime: new FormControl(''),
      status: new FormControl('ACTIVE', { nonNullable: true }),
      email: new FormControl('', emailValidator),
      is_admin: new FormControl(false, { nonNullable: true }),
      updateTime: new FormControl(''),
    });
  }
  reset() {
    this.form.reset();
    this.resetFilter();
  }
  cancel() {
    this.close.next(true);
  }
  filter() {
    if (this.form.valid) {
      const login = this.form.value.login;
      const email = this.form.value.email;
      const phone = this.form.value.phone;
      const status = this.form.value.status;
      const is_admin = this.form.value.is_admin;
      const create_at = this.form.value.creationTime;
      const update_at = this.form.value.updateTime;
      this.dataStorageService.fetchData({
        login,
        is_admin,
        create_at,
        update_at,
        email,
        phone,
        status,
      });
      this.filtered = true;
    }
  }
  resetFilter() {
    if (this.filtered) {
      this.dataStorageService.fetchData();
      this.filtered = false;
    }
  }
  ngOnDestroy(): void {
    this.resetFilter();
  }
}
