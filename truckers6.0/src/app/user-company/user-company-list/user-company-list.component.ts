import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { UserCompanyRelation } from '../user-company.model';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { CompaniesService } from '../../company/company.service';
import { UserCompaniesService } from '../user-company.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-user-company-list',
    templateUrl: './user-company-list.component.html',
    styleUrls: ['./user-company-list.component.css']
})
export class UserCompanyListComponent implements OnInit, OnDestroy {
    relations: UserCompanyRelation[] = [];
    private companiesSub: Subscription;
    private authStatusSubs: Subscription;
    private relationsSub: Subscription;
    userId: string;
    userRole: string;
    companyId: string;
    userIsAuthenticated = false;
    isLoading = false;
    totalRelations = 0;
    relationsPerPage = 10;
    currentPage = 1;
    pageSizeOptions = [10, 15, 20, 25];
    dataSource = new MatTableDataSource(this.relations);
    displayedColumns: string[] = ['userName', 'companyName', 'points', 'updatePoints', 'edit'];
    filter = "";
    value = "";

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(public authService: AuthService,
                public companiesService: CompaniesService,
                public userCompanyService: UserCompaniesService){}

    ngOnInit() {
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.userRole = this.authService.getUserRole();
        this.companyId = this.authService.getCompanyId();
        if (this.userRole == "Driver") {
            this.filter = "userId";
            this.value = this.userId;
        }
        else if (this.userRole == "Sponsor") {
            this.filter = "companyId";
            this.value = this.companyId;
        }
        this.userCompanyService.getRelations(this.relationsPerPage, this.currentPage, this.filter, this.value);
        this.relationsSub = this.userCompanyService.getRelationUpdateListener()
            .subscribe((relationData: {relations: UserCompanyRelation[], relationCount: number}) => {
                this.isLoading = false;
                this.relations = relationData.relations;
                this.dataSource = new MatTableDataSource(this.relations);
                this.dataSource.sort = this.sort;
                this.totalRelations = relationData.relationCount;
                this.pageSizeOptions = [10, 15, 20, 25, this.totalRelations];
            });
            this.authStatusSubs = this.authService
                .getAuthStatusListener()
                .subscribe(isAuthenticated => {
                    this.userIsAuthenticated = isAuthenticated;
                    this.userId = this.authService.getUserId();
                });
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.relationsPerPage = pageData.pageSize;
        this.userCompanyService.getRelations(this.relationsPerPage, this.currentPage, this.filter, this.value);
    }

    ngOnDestroy() {
        this.relationsSub.unsubscribe();
    }
}