import { Component, OnInit, OnDestroy } from '@angular/core';
import { Catalog } from '../catalog.model';
import { Subscription } from 'rxjs';
import { CatalogsService } from '../catalog.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css']
})
export class CatalogListComponent implements OnInit, OnDestroy {
  catalogs: Catalog[] = [];
  private catalogsSub: Subscription;
  private authStatusSubs: Subscription;
  userId: string;
  userRole: string;
  userIsAuthenticated = false;
  isLoading = false;
  totalCatalogs = 0;
  catalogsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 15, 20, 25];
  displayedColumns: string[] = ['image', 'item', 'price', 'description', 'purchaseItem'];

  constructor(public catalogsService: CatalogsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.catalogsService.getCatalogs(this.catalogsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.catalogsSub = this.catalogsService.getCatalogUpdateListener()
      .subscribe((catalogData: {catalogs: Catalog[], catalogCount: number}) => {
        this.isLoading = false;
        this.catalogs = catalogData.catalogs;
        this.totalCatalogs = catalogData.catalogCount;
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

  onDelete(catalogId: string) {
    this.isLoading = true;
    this.catalogsService.deleteCatalog(catalogId).subscribe(() => {
      this.catalogsService.getCatalogs(this.totalCatalogs, this.currentPage);
    }, () => {
      this.isLoading = false;
    })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.catalogsPerPage = pageData.pageSize;
    this.catalogsService.getCatalogs(this.catalogsPerPage, this.currentPage);
  }

  get isAdmin() {
    return this.userRole === "Admin";
  }

  ngOnDestroy() {
    this.catalogsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
