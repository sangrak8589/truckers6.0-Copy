import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: any;
  private userRole: string;
  private companyId: string;
  private authStatusListener = new Subject<boolean>();
  private username: string;
  private usersUpdated = new Subject<{users: AuthData[], userCount: number}>();
  private users: AuthData[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserRole() {
    return this.userRole;
  }

  getUsername() {
    return this.username;
  }

  getCompanyId() {
    return this.companyId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, fname: string, lname: string, username: string, role: string) {
    const authData: AuthData = {
      id: null,
      email: email, 
      password: password, 
      fname: fname, 
      lname:lname, 
      username: username, 
      role: role,
      companyId: null
    };
    return this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(() => {
      const subject = "Welcome to Truckers!";
      const html = `<h1>Welcome, ${authData.fname} ${authData.lname} </h1><br>
        <h4>You have been signed up as a ${authData.role} for Truckers!<h4><br>
        <h4>Visit http://nodeangular-env.eba-bsrmznym.us-east-1.elasticbeanstalk.com/api to view your profile<h4>`;
      const mailOptions = {subject: subject, message: html};
      this.http.post(environment.apiUrl + '/sendemail', {data: authData, mailOptions: mailOptions})
        .subscribe(() => {
          this.router.navigate(['/auth/login']);
        }, error => {
          this.authStatusListener.next(false);
        });
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  addUser(email: string, password: string, fname: string, lname: string, username: string, role: string) {
    const authData: AuthData = {
      id: null,
      email: email, 
      password: password, 
      fname: fname, 
      lname:lname, 
      username: username,
      role: role,
      companyId: null
    };
    return this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(() => {
      this.router.navigate(['/user-list']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  updateUser(id: string, email: string, password: string, fname: string, lname: string, username: string, role: string, companyId: string) {
    let userData = {
      id: id,
      email: email,
      password: password,
      fname: fname,
      lname: lname,
      username: username,
      role: role,
      companyId: companyId
    };
    this.http.put(BACKEND_URL + id, userData)
      .subscribe(response => {
        this.router.navigate(['/user-list']);
      })
  }

  resetPassword(email: string, username: string, password: string) {
    const authData = { 
      email: email, 
      username: username, 
      password: password 
    };
    this.http.post(BACKEND_URL, authData)
      .subscribe(response => {
        this.router.navigate(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  } 

  login(email: string, password: string) {
    const authData = {email: email, password: password};
    this.http
      .post<{token: string, expiresIn: number, userId: string, userRole: string, username: string, companyId: string}>(
        BACKEND_URL + "login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userRole = response.userRole;
          this.username = response.username;
          this.companyId = response.companyId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, this.userRole, this.username, this.companyId);
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation)
      return;

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userRole = authInformation.userRole;
      this.username = authInformation.username;
      this.companyId = authInformation.companyId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/dashboard']);
  }

  getUser(userId: string) {
    return this.http.get<{
      _id: string,
      email: string,
      password: null,
      fname: string,
      lname: string,
      username: string,
      role: string,
      companyId: string
    }>(
      BACKEND_URL + userId
    );
  }

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, users: any, maxUsers: number}>(
        BACKEND_URL + queryParams
        )
        .pipe(map((userData) => {
          return { users: userData.users.map(user => {
            return {
              id: user._id,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
              username: user.username,
              role: user.role,
              companyId: user.companyId
            };
          }), maxUsers: userData.maxUsers
        };
      })
    )
    .subscribe(transformedUserData => {
      this.users = transformedUserData.users;
      this.usersUpdated.next({users: [...this.users], userCount: transformedUserData.maxUsers});
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(BACKEND_URL + userId)
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userRole: string, username: string, companyId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('username', username);
    localStorage.setItem('companyId', companyId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('companyId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    const companyId = localStorage.getItem('companyId');

    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userRole: userRole,
      username: username,
      companyId: companyId
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
