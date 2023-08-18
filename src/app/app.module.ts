import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './dashboard/side-bar/side-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { InputComponent } from './dashboard/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './dashboard/table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { PhoneNumberRuPipe } from './shared/phone-number-ru.pipe';
import { CustomDatePipe } from './shared/custom-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SideBarComponent,
    InputComponent,
    TableComponent,
    LoadingSpinnerComponent,
    PhoneNumberRuPipe,
    CustomDatePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
