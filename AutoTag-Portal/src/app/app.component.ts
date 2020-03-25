import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider, SocialUser, FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'AutoTag';
  public isAuthenticated: boolean;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.isAuthenticated = (user != null);
    });
  }

  login() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(x => {
        console.log(x);
      })
      .catch(x => {
        console.log(x);
      });
  }

  logout() {
    this.authService.signOut().then(x => console.log(x));
  }
}
