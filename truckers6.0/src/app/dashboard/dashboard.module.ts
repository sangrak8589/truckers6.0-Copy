import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DriverComponent } from './driver/driver.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DriverComponent,
    SponsorComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class DashboardModule {}
