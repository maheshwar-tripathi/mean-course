import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data-model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";


@Injectable({ providedIn: "root" })
export class AuthService {
  private token!: string;
  tokenTimer!: NodeJS.Timer;
  private isAuthenticated: boolean = false;
  private authStatusListner = new Subject<boolean>();
  private userId!: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(resposne => {
        this.router.navigate(['/']);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(resposne => {
        const token = resposne.token;
        this.token = token;
        if(token) {
          const expiresInDuration = resposne.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          this.userId = resposne.userId;

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
          console.log(expirationDate);
          this.saveAuthData(token,expirationDate,this.userId);
          this.router.navigate(['/']);
        }

      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData()!;
    const now = new Date();

    const expiersIn = authInformation?.expirationDate.getTime() - now.getTime();
    if(expiersIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId!;
      this.setAuthTimer(expiersIn/1000);
      this.authStatusListner.next(true);

    }

  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration*1000);

  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.userId = '';
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  saveAuthData(token: string, expironDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expironDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if(!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }

  }
}
