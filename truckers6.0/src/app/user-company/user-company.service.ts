import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { UserCompanyRelation } from './user-company.model';

const BACKEND_URL = environment.apiUrl + '/user-company-relationship/';

@Injectable({providedIn: 'root'})
export class UserCompaniesService {
  private relations: UserCompanyRelation[] = [];
  private relationsUpdated = new Subject<{relations: UserCompanyRelation[], relationCount: number}>();
  relationStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  joinCompany(userId: string, companyId: string, userName: string, companyName: string, points: number, email: string) {
    const relationData: UserCompanyRelation = {
      id: null,
      userId: userId,
      companyId: companyId,
      userName: userName,
      companyName: companyName,
      points: points
    }

    this.http.post<{message: string, relation: UserCompanyRelation }>(BACKEND_URL, relationData)
      .subscribe((responseData) => {
        const subject = "Joined Company";
        const html = `<h1>Update for ${relationData.userName},</h1>
                      <h2>You now have joined ${relationData.companyName}!</h2>
                      <h2>Your current point total is ${relationData.points}</h2>
                      <h4>Visit http://nodeangular-env.eba-bsrmznym.us-east-1.elasticbeanstalk.com/api to view your profile</h4>`;
        const authData = {email: email};
        const mailOptions = {subject: subject, message: html };
        this.http.post(environment.apiUrl + '/sendemail', {data: authData, mailOptions: mailOptions })
          .subscribe(() => {
            this.router.navigate(['/user-company-list']);
          }, error => {
            this.relationStatusListener.next(false);
          });
      }, error => {
        this.relationStatusListener.next(false);
      });
  }

  getRelationUpdateListener() {
    return this.relationsUpdated.asObservable();
  }

  getRelationStatusListener() {
    return this.relationStatusListener.asObservable();
  }

  getRelations(relationsPerPage: number, currentPage: number, filter: string, value: string) {
    const queryParams = `?pagesize=${relationsPerPage}&page=${currentPage}&filter=${filter}&value=${value}`;
    this.http
    .get<{message: string, relations: any, maxRelations: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(map((relationData) => {
        return { relations: relationData.relations.map(relation => {
          return {
            id: relation._id,
            userId: relation.userId,
            companyId: relation.companyId,
            userName: relation.userName,
            companyName: relation.companyName,
            points: relation.points
          }
        }), maxRelations: relationData.maxRelations
      };
    })
  )
  .subscribe(transformedRelationData => {
    this.relations = transformedRelationData.relations;
    this.relationsUpdated.next({relations: [...this.relations], relationCount: transformedRelationData.maxRelations});
  }); 
  }

  getRelation(relationId: string) {
    return this.http.get<{
      _id: string,
      userId: string,
      companyId: string,
      userName: string,
      companyName: string,
      points: number
    }>(
      BACKEND_URL + relationId
    );
  }

  updatePoints(id: string, userId: string, companyId: string, userName: string, companyName: string, points: number, email: string) {
    let relationData: UserCompanyRelation = {
      id: id,
      userId: userId,
      companyId: companyId,
      userName: userName,
      companyName: companyName,
      points: points
    };
    this.http.put(BACKEND_URL + id, relationData)
      .subscribe(response => {
        const subject = "Points Update";
        const html = `<h1>Update for ${relationData.userName},</h1>
                      <h2>You now have ${relationData.points} available for ${relationData.companyName}</h2>
                      <h4>Visit http://nodeangular-env.eba-bsrmznym.us-east-1.elasticbeanstalk.com/api to view your profile</h4>`;
        const authData = {email: email};
        const mailOptions = {subject: subject, message: html};
        this.http.post(environment.apiUrl + '/sendemail', {data: authData, mailOptions: mailOptions})
          .subscribe(() => {
            this.router.navigate(['/user-company-list']);
          })
      })
  }

}
