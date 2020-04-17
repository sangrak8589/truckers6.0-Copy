import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { ForgotComponent } from './forgot/forgot.component';
import { UserAddComponent } from './user-add/user-add.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    UserListComponent,
    ForgotComponent,
    UserAddComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {}
