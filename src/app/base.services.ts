import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private apiUrl ="http://localhost:4201";
  private config: RequestConfig;
  constructor(protected http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.config = {
      headers: new HttpHeaders(),
      params: new HttpParams()
    };
  }



  private appendToken() {
    this.config = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
    };
    // const token = localStorage.getItem('token');
    // if (token && !this.config.headers.has('token')) {
    //   this.config.headers = this.config.headers.append('token', token);
    //   if (this.activatedRoute) {

    //     this.config.headers = this.config.headers.append('fronturl', this.activatedRoute.snapshot['_routerState'].url);
    //   }
    // }
  }




  private appendParams(params: object) {
    this.config.params = new HttpParams();
    Object.keys(params).forEach((key) => {
      this.config.params = this.config.params.append(key, params[key]);
    });
  }

  private handleError(error) {

    console.log(error);

    // const errorJson = error.json();

    // if (environment.production === false) {
    //     console.log(errorJson);
    // }

    // return throwError(errorJson || 'Server error');

    return throwError('Server error');

  }


  public genericListQuery(routeURL, params) {

    return this.__get(`${routeURL}/index/genericListQuery`, params);

  }

  protected __get(url, params?) {
    this.appendToken();
    if (params) {
      this.appendParams(params);
    }
    return this.http.get(`${this.apiUrl}/${url}`, this.config).pipe(catchError(err => this.handleError(err)));
  }


  protected __put(url, putBody) {
    this.appendToken();
    return this.http.put(`${this.apiUrl}/${url}`, putBody, this.config).pipe(catchError(err => this.handleError(err)));
  }


  protected __post(url, postBody, hasBlobRes?: boolean) {
    this.appendToken();
    const postConfig = { ...this.config };
    if (hasBlobRes) {
      // this.config.observe = 'response' as 'body';
      postConfig.responseType = 'blob' as 'json';
    }
    return this.http.post(`${this.apiUrl}/${url}`, postBody, postConfig).pipe(catchError(err => this.handleError(err)));
  }

  protected __delete(url) {
    this.appendToken();
    return this.http.delete(`${this.apiUrl}/${url}`, this.config).pipe(catchError(err => this.handleError(err)));
  }


  __postPublic(url, postBody, hasBlobRes?: boolean) {
    const postConfig = { ...this.config };
    if (hasBlobRes) {
      // this.config.observe = 'response' as 'body';
      postConfig.responseType = 'blob' as 'json';
    }
    return this.http.post(`${this.apiUrl}/${url}`, postBody, postConfig).pipe(catchError(err => this.handleError(err)),null);

  }

  protected __getPicture(url,params?, hasBlobRes?: boolean) {
    this.appendToken();
    // const postConfig = { ...this.config };

    this.config.responseType = 'blob' as 'json';

    return this.http.get(`${this.apiUrl}/${url}`,this.config).pipe(catchError(err => this.handleError(err)));
  }

}



interface RequestConfig {

  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
  responseType?: 'json';

}
