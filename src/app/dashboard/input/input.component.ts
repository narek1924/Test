import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataStorageService,
    private cdRef: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {}
  form = this.formBuilder.group({
    login: [''],
    phone: [''],
    creationTime: [''],
    status: ['active'],
    email: [''],
    role: ['user'],
    salary: [''],
    updateTime: [''],
  });
  ngOnInit(): void {
    this.subsription = this.dashboardService.inputType.subscribe(
      (type: string) => {
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
