import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data-model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";


@Injectable({ providedIn: "root" })
export class AuthService {
  private token!: string;
  private isAuthenticated: boolean = false;
  private authStatusListner = new Subject<boolean>();

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

    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(resposne => {
        const token = resposne.token;
        this.token = token;
        if(token) {
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          this.router.navigate(['/']);
        }

      });
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
  }
}
