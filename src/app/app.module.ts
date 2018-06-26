import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { TestComponent } from './test/test.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { MixChartComponent } from './mix-chart/mix-chart.component';
import { BillComponent } from './bill/bill.component';
import { FooterComponent } from './footer/footer.component';
import { PayBillComponent } from './pay-bill/pay-bill.component';
import { IndexComponent } from './index/index.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MonthsComponent } from './months/months.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListProductComponent } from './list-product/list-product.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { DeviceSelectListComponent } from './device-select-list/device-select-list.component';


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TestComponent,
    LineChartComponent,
    BarChartComponent,
    DoughnutChartComponent,
    HeaderComponent,
    MixChartComponent,
    BillComponent,
    FooterComponent,
    PayBillComponent,
    IndexComponent,
    TopMenuComponent,
    MainMenuComponent,
    MonthsComponent,
    ForgotPasswordComponent,
    LoginComponent,
    ListProductComponent,
    DeviceListComponent,
    UserListComponent,
    DeviceInfoComponent,
    DeviceSelectListComponent,

  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
