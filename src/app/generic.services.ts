import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.services';



@Injectable()

export class GenericService extends BaseService {


  /**
   * Send http get request to server.
   *
   * @method get
   * @param url string
   * @param params object
   */
  public get(url, params?) {
    return this.__get(`${url}`, params);
  }


  /**
   * Send http put request to server.
   *
   * @method put
   * @param url string
   * @param putBody object
   */
  public put(url, putBody) {

    return this.__put(`${url}`, putBody);

  }


  /**
   * Send http post request to server
   *
   * @method post
   * @param url string
   * @param postBody object
   */
  public post(url, postBody) {

    return this.__post(`${url}`, postBody);

  }


  /**
   * Send http delete request to server
   *
   * @method delete
   * @param url string
   */
  public delete(url) {

    return this.__delete(`${url}`);


  }

  public postPublic(url, postBody) {

    return this.__postPublic(`${url}`, postBody);

  }

  /**
   * Send http get request to server.
   *
   * @method get
   * @param url string
   * @param params object
   */
   public getPicture(url, params?) {
    return this.__getPicture(`${url}`, params);
  }




}
