import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyJoinComponent } from './company-join/company-join.component';
import { UserCompanyListComponent } from './user-company-list/user-company-list.component';
import { UpdatePointsComponent } from './update-points/update-points.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
      CompanyJoinComponent,
      UserCompanyListComponent,
      UpdatePointsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class UserCompanyRelationModule {}