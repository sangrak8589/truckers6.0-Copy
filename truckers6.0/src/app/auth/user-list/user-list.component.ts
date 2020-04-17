import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AuthData } from '../auth-data.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
    users: AuthData[] = [];
    private usersSub: Subscription;
    private authStatusSubs: Subscription;
    userId: string;
    userRole: string;
    userIsAuthenticated = false;
    isLoading = false;
    totalUsers = 0;
    usersPerPage = 10;
    currentPage = 1;
    pageSizeOptions = [10, 15, 20, 25];
    dataSource = new MatTableDataSource(this.users);
    displayedColumns: string[] = ['lname', 'fname', 'username', 'email', 'role', 'edit', 'delete'];

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(public authService: AuthService){}
    ngOnInit() {
        this.isLoading = true;
        this.authService.getUsers(this.usersPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.usersSub = this.authService.getUserUpdateListener()
            .subscribe((userData: {users: AuthData[], userCount: number}) => {
                console.log(userData);
                this.isLoading = false;
                this.users = userData.users;
                this.dataSource = new MatTableDataSource(this.users);
                this.dataSource.sort = this.sort;
                this.totalUsers = userData.userCount;
                this.pageSizeOptions = [10, 15, 20, 25, this.totalUsers];
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

    onDelete(userId: string) {
        this.isLoading = true;
        this.authService.deleteUser(userId).subscribe(() => {
            this.authService.getUsers(this.totalUsers, this.currentPage);
        }, () => {
            this.isLoading = false;
        })
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.usersPerPage = pageData.pageSize;
        this.authService.getUsers(this.usersPerPage, this.currentPage);
    }

    get isAdmin() {
        return this.userRole === "Admin";
    }

    ngOnDestroy() {
        this.usersSub.unsubscribe();
        this.authStatusSubs.unsubscribe();
    }
}