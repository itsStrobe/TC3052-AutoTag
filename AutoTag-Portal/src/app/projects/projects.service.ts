import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Project } from './project';
import { take } from 'rxjs/operators';

const baseUrl = 'http://localhost:4201';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(public authService: AuthService, private http: HttpClient) {
  }

  private async request(method: string, url: string, data?: any) {
    const authState = await this.authService.authState.pipe(
      take(1),
    ).toPromise();
    const token = authState.authToken;

    console.log('request ' + JSON.stringify(data));
    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return new Promise<any>((resolve, reject) => {
      result.subscribe(resolve as any, reject as any);
    });
  }

  getProjects() {
    // Dummy projects file for development.
    // return new Promise<any>((resolve, reject) => {  
    //   this.http.request('get', 'assets/projects-test.json')
    //   .subscribe(resolve as any, reject as any);
    // });
    return this.request('get', `${baseUrl}/project`);
  }

  getProject(uuid: string) {
    return this.request('get', `${baseUrl}/project/${uuid}`);
  }

  createProject(project: Project) {
    console.log('createProject ' + JSON.stringify(project));
    return this.request('post', `${baseUrl}/project`, project);
  }

  updateProject(project: Project) {
    console.log('updateProject ' + JSON.stringify(project));
    return this.request('post', `${baseUrl}/project/${project.uuid}`, project);
  }

  deleteProject(uuid: string) {
    return this.request('delete', `${baseUrl}/project/${uuid}`);
  }
}
