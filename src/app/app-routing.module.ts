import { DeviceSelectListComponent } from './device-select-list/device-select-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { AppComponent } from './app.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { MixChartComponent } from './mix-chart/mix-chart.component';
import { TestComponent } from './test/test.component';
import { BillComponent } from './bill/bill.component';
import { PayBillComponent } from './pay-bill/pay-bill.component';
import { IndexComponent } from './index/index.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ListProductComponent } from './list-product/list-product.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { DeviceInfoComponent } from './device-info/device-info.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'line-chart', component: LineChartComponent},
  { path: 'bar-chart', component: BarChartComponent},
  { path: 'doughnut-chart', component: DoughnutChartComponent},
  { path: 'mix-chart', component: MixChartComponent},
  { path: 'test', component: TestComponent},
  { path: 'bill', component: BillComponent},
  { path: 'pay-bill', component: PayBillComponent},
  { path: 'index', component: IndexComponent},
  { path: 'top-menu', component: TopMenuComponent},
  { path: 'main-menu', component: MainMenuComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'login', component: LoginComponent},
  { path: 'list-product', component:ListProductComponent},
  { path: 'device-list', component:DeviceListComponent},
  { path: 'user-list', component:UserListComponent},
  { path: 'device-info', component:DeviceInfoComponent},
  { path: 'device-seletct-list', component:DeviceSelectListComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports:[ RouterModule ]
})
export class AppRoutingModule { }
