import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { PostListComponent } from './posts/post-list/post-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyCreateComponent } from './company/company-create/company-create.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { UserListComponent } from './auth/user-list/user-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserAddComponent } from './auth/user-add/user-add.component';
import { CompanyJoinComponent } from './user-company/company-join/company-join.component';
import { UserCompanyListComponent } from './user-company/user-company-list/user-company-list.component';
import { UpdatePointsComponent } from './user-company/update-points/update-points.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { CatalogListComponent } from './catalog/catalog-list/catalog-list.component';
import { CatalogCreateComponent } from './catalog/catalog-create/catalog-create.component';

const routes: Routes = [
  { path: 'postlist', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'editUser/:userId', component: SignupComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'company-create', component: CompanyCreateComponent, canActivate: [AuthGuard]},
  { path: 'company-list', component: CompanyListComponent, canActivate: [AuthGuard]},
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
  { path: 'user-add', component: UserAddComponent, canActivate: [AuthGuard]},
  { path: 'user-company-join', component: CompanyJoinComponent, canActivate: [AuthGuard]},
  { path: 'user-company-list', component: UserCompanyListComponent, canActivate: [AuthGuard]},
  { path: 'update-points/:relationId', component: UpdatePointsComponent, canActivate: [AuthGuard] },
  { path: 'forgot', component: ForgotComponent},
  { path: 'catalog-list', component: CatalogListComponent, canActivate: [AuthGuard]},
  { path: 'catalog-create', component: CatalogCreateComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
];

@NgModule ({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
