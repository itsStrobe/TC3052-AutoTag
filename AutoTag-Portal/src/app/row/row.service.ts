import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from 'angularx-social-login';
import { take } from 'rxjs/operators';

const baseUrl = 'http://localhost:4201';

@Injectable({
  providedIn: 'root'
})
export class RowService {

  constructor(public authService: AuthService, private http: HttpClient) { }

  private async request(method: string, url: string, data?: any, params?: HttpParams) {
    const authState = await this.authService.authState.pipe(
      take(1),
    ).toPromise();
    const token = authState.authToken;

    console.log('request ' + JSON.stringify(data));
    const result = this.http.request(method, url, {
      params,
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

  getDataBatch(uuid: string, batchStart: number, batchSize: number) {
    const params = new HttpParams()
                    .set('offset', batchStart.toString())
                    .set('limit', batchSize.toString());
    return this.request('get', `${baseUrl}/project/${uuid}/dataBatch`, null, params);
  }
}
