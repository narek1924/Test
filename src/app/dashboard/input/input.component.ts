import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/data-storage/data-storage.service';
import { DashboardService } from '../dashboard.service';
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
  @Input() inputType!: string;
  private subsription!: Subscription;
  form!: FormGroup;
  constructor(
    private dataService: DataStorageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.subsription = this.dashboardService.inputType.subscribe(
      (type: string) => {
        if (type) {
          this.form = new FormGroup({
            login: new FormControl(''),
            phone: new FormControl(''),
            creationTime: new FormControl(''),
            status: new FormControl('active', { nonNullable: true }),
            email: new FormControl(''),
            role: new FormControl('user', { nonNullable: true }),
            salary: new FormControl(false, { nonNullable: true }),
            updateTime: new FormControl(''),
          });
        }
        // this.form.reset();
        if (type === 'add') {
          this.form
            .get('login')
            ?.addValidators([Validators.required, loginValidator]);
          this.form
            .get('phone')
            ?.addValidators([Validators.required, phoneNumberValidator]);
          this.form
            .get('email')
            ?.addValidators([Validators.required, emailValidator]);
          this.form.get('status')?.addValidators(Validators.required);
          this.form.get('role')?.addValidators(Validators.required);
          this.form.get('salary')?.addValidators(Validators.required);
        } else {
          this.form.get('login')?.addValidators(loginValidator);
          this.form.get('phone')?.addValidators(phoneNumberValidator);
          this.form.get('email')?.addValidators(emailValidator);
          this.form.get('status')?.clearValidators();
          this.form.get('role')?.clearValidators();
          this.form.get('salary')?.clearValidators();
        }

        Object.keys(this.form.controls).forEach((key: string) => {
          const abstractControl =
            this.form.controls[key as keyof typeof this.form.controls];
          abstractControl.updateValueAndValidity();
        });
      }
    );
  }
  reset() {
    this.form.reset();
    this.dashboardService.filterReset();
  }
  cancel() {
    this.dashboardService.inputType.next('');
    this.dashboardService.filterReset();
  }
  formSubmit() {
    if (this.inputType === 'add') {
      if (this.form.valid) {
        this.dataService
          .createUser(
            this.form.value.login!,
            this.form.value.phone!,
            this.form.value.status!,
            this.form.value.email!,
            this.form.value.role!,
            this.form.value.salary!
          )
          .subscribe((res) => {
            console.log(res);
          });
        this.form.reset();
      }
    } else {
      if (this.form.valid) {
        const login = this.form.value.login;
        const email = this.form.value.email;
        const phone = this.form.value.phone;
        const status = this.form.value.status;
        const role = this.form.value.role;
        const salary = this.form.value.salary;
        const creationTime = this.form.value.creationTime;
        const updateTime = this.form.value.updateTime;
        this.dashboardService.filterParams.next({
          login,
          role,
          salary,
          creationTime,
          updateTime,
          email,
          phone,
          status,
        });
      }
    }
  }
  ngOnDestroy(): void {
    this.subsription.unsubscribe();
  }
}
