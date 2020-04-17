import { Company } from './company.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/company/';

@Injectable({providedIn: 'root'})
export class CompaniesService {
  private companies: Company[] = [];
  private companiesUpdated = new Subject<{companies: Company[], companyCount: number}>();
  constructor(private http: HttpClient, private router: Router) {}

  getCompanies(companiesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${companiesPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, companies: any, maxCompanies: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(map((companyData) => {
        return { companies: companyData.companies.map(company => {
          return {
            id: company._id,
            name: company.name
          };
        }), maxCompanies: companyData.maxCompanies
      };
    })
  )
  .subscribe(transformedCompanyData => {
    console.log(transformedCompanyData);
    this.companies = transformedCompanyData.companies;
    this.companiesUpdated.next({companies: [...this.companies], companyCount: transformedCompanyData.maxCompanies});
  }); 
}

getAllCompanies() {
  this.http
  .get<{message: string, companies: any, maxCompanies: number}>(
    BACKEND_URL
    )
    .pipe(map((companyData) => {
      return { companies: companyData.companies.map(company => {
        return {
          id: company._id,
          name: company.name
        };
      }), maxCompanies: companyData.maxCompanies
    };
  })
)
.subscribe(transformedCompanyData => {
  this.companies = transformedCompanyData.companies;
  this.companiesUpdated.next({companies: [...this.companies], companyCount: transformedCompanyData.maxCompanies});
}); 
}

  getCompanyUpdateListener() {
    return this.companiesUpdated.asObservable();
  }

  addCompany(name: string) {
    const companyData = {
        name: name
    }

    this.http.post<{message: string, company: Company }>(BACKEND_URL, companyData)
      .subscribe((responseData) => {
        this.router.navigate(['/company-list']);
      });
  }

  deleteCompany(companyId: string) {
    return this.http.delete(BACKEND_URL + companyId)

  }
}
