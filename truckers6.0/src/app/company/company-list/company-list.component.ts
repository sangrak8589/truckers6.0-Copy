import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Company } from '../company.model';
import { Subscription, Observable } from 'rxjs';
import { CompaniesService } from '../company.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  companies: Company[] = [];
  private companiesSub: Subscription;
  private authStatusSubs: Subscription;
  userId: string;
  userRole: string;
  userIsAuthenticated = false;
  isLoading = false;
  totalCompanies = 0;
  companiesPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 15, 20, 25];
  dataSource = new MatTableDataSource(this.companies);
  
  displayedColumns: string[] = ['companyName', 'delete'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public companiesService: CompaniesService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.companiesService.getCompanies(this.companiesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.companiesSub = this.companiesService.getCompanyUpdateListener()
      .subscribe((companyData: {companies: Company[], companyCount: number}) => {
        this.isLoading = false;
        this.companies = companyData.companies;
        this.totalCompanies = companyData.companyCount;
        this.dataSource = new MatTableDataSource(this.companies);
        this.dataSource.sort = this.sort;
        this.pageSizeOptions = [10, 15, 20, 25, this.totalCompanies];
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.userRole = this.authService.getUserRole();
      this.authStatusSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  onDelete(companyId: string) {
    this.isLoading = true;
    this.companiesService.deleteCompany(companyId).subscribe(() => {
      this.companiesService.getCompanies(this.totalCompanies, this.currentPage);
    }, () => {
      this.isLoading = false;
    })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.companiesPerPage = pageData.pageSize;
    this.companiesService.getCompanies(this.companiesPerPage, this.currentPage);
  }

  get isAdmin() {
    return this.userRole === "Admin";
  }

  ngOnDestroy() {
    this.companiesSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
