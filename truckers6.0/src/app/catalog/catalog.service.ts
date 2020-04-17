import { Catalog } from './catalog.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/catalog/';
const ETSY_URL = "https://openapi.etsy.com/v2/listings/active?api_key=v6o3prv1zty5uut0fioalefe&keywords=";

@Injectable({providedIn: 'root'})
export class CatalogsService {
  private catalogs: Catalog[] = [];
  private catalogsUpdated = new Subject<{catalogs: Catalog[], catalogCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  hitEtsy(key: string) {
    var etsyCall = ETSY_URL+key;
    console.log(etsyCall);
    console.log(this.http.get(etsyCall));
    console.log("\n\n\n\n\n");
    return this.http.get(etsyCall);
  }

  getCatalogs(catalogsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${catalogsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, catalogs: any, maxCatalogs: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(map((catalogData) => {
        return { catalogs: catalogData.catalogs.map(catalog => {
          return {
            id: catalog._id,
            name: catalog.name
          };
        }), maxCatalogs: catalogData.maxCatalogs
      };
    })
  )
  .subscribe(transformedCatalogData => {
    console.log(transformedCatalogData);
    this.catalogs = transformedCatalogData.catalogs;
    this.catalogsUpdated.next({catalogs: [...this.catalogs], catalogCount: transformedCatalogData.maxCatalogs});
  }); 
}

getAllCatalogs() {
  this.http
  .get<{message: string, catalogs: any, maxCatalogs: number}>(
    BACKEND_URL
    )
    .pipe(map((catalogData) => {
      return { catalogs: catalogData.catalogs.map(catalog => {
        return {
          id: catalog._id,
          name: catalog.name
        };
      }), maxCatalogs: catalogData.maxCatalogs
    };
  })
)
.subscribe(transformedCatalogData => {
  console.log(transformedCatalogData);
  this.catalogs = transformedCatalogData.catalogs;
  this.catalogsUpdated.next({catalogs: [...this.catalogs], catalogCount: transformedCatalogData.maxCatalogs});
}); 
}

  getCatalogUpdateListener() {
    return this.catalogsUpdated.asObservable();
  }

  /*getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(
      BACKEND_URL + id
    );
  } */

  addCatalog(name: string) {
    const catalogData = {
        name: name
    }

    this.http.post<{message: string, catalog: Catalog }>(BACKEND_URL, catalogData)
      .subscribe((responseData) => {
        this.router.navigate(['/catalog-list']);
      });
  }

  deleteCatalog(catalogId: string) {
    return this.http.delete(BACKEND_URL + catalogId)

  }

}
