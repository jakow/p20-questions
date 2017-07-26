import * as SocketIO from 'socket.io-client';
import {observable, action, computed} from 'mobx';
import {merge} from 'lodash';
import hasLocalStorage from '../helpers/hasLocalStorage';

interface User {
  email: string;
  name: string;
  imgUrl: string;
}
const UNKNOWN_ERROR = 'Something went wrong.';

const TOKEN = 'P20_QAPI_TOKEN';
const TOKEN_EXPIRATION = 'P20_QAPI_TOKEN_EXPIRATION';
export const SERVER_URI = process.env.NODE_ENV === 'production' ? 'https://poland20.com' : 'http://localhost:4000';

export const httpApiRoute = (route: string) => `${SERVER_URI}/api/${route}`;


class ApiStore {
  readonly socketIo: SocketIOClient.Socket;
  @observable token: string = '';
  @observable tokenExpiration: Date = null;
  @observable user: User = null;
  @observable loginError: string = null;
  
  // login data
  username: string = '';
  password: string = '';

  private tokenTimeout: number;

  constructor() {
    if (hasLocalStorage()) {
      this.token = localStorage.getItem(TOKEN) || '';
      this.tokenExpiration = new Date(localStorage.getItem(TOKEN_EXPIRATION));
    }
    this.socketIo = SocketIO(SERVER_URI);
  }

  @action async login() {
    try {
      const response =  await this.httpApi('login', {
        method: 'post',
        body: {email: this.username, password: this.password},
      });
      const result = await response.json();
      if (response.ok) {
        this.setToken(result);
        this.loginError = null;
        // do not persist credentials
        this.username = '';
        this.password = '';
        return null;
      } else {
        this.loginError = result.message;
        return this.loginError;
      }
    } catch (e) {
      this.loginError = UNKNOWN_ERROR;
      return (e.message);
    }
  }

  @action logout() {
    this.token = '';
    this.tokenExpiration = null;
    clearTimeout(this.tokenTimeout);
  }
  /**
   * We cannot know whether the user is logged in until we hit the server
   * with a request and see whether it accepts
   */
  @computed get isLoggedIn() {
    return this.token.length !== 0 && this.tokenExpiration !== null && +this.tokenExpiration -  Date.now() > 0;
  }
  /**
   * Wrapper around fetch which appends token to the request if the token is valid and
   * knows the route to the server. Requests are assumed to have a JSON body by default.
   * @param route 
   * @param options 
   */
  async httpApi(route: string, options?: RequestInit) {

    const defaults: RequestInit = {
      headers: this.isLoggedIn ? {'Authorization': `JWT ${this.token}`} : {}, 
      mode: 'cors',
    };
    const opt = merge(defaults, options);
    // auto stringify JSON body
    if (typeof opt.body === 'object') {
      opt.headers['Content-Type'] = 'application/json';
      opt.body = JSON.stringify(opt.body);
    }

    const response = await fetch(httpApiRoute(route), opt);
    if (!response.ok) {
      let message = '';
      if (response.headers['Content-Type'] === 'application/json') {
        message = await response.json();
      } 
      throw new ApiError(message || response.statusText);
    }
    return response;
  }

  create(resource: string, options?: RequestInit) {
    return this.httpApi(resource, merge({method: 'post'}, options));
  }

  read(resource: string, options?: RequestInit) {
    return this.httpApi(resource, merge({method: 'get'}, options));
  }
  
  update(resource: string, options?: RequestInit) {
    // make an 'intelligent' guess as to which update (PATCH/PUT) is used
    let body = options.body;
    let method = 'put';
    // try to find that the json is an array without parsing it (becaue expensive!)
    if (typeof body === 'string' && body[0] === '[') {
      method = 'patch';
    } else if (Array.isArray(body)) {
      method = 'patch';
    }
    return this.httpApi(resource, merge({method}, options));
  }

  delete(resource: string, options?: RequestInit) {
    return this.httpApi(resource, merge({method: 'delete'}, options));
  }

  private setToken(response: {token: string, expires: string}) {
    this.token = response.token;
    this.tokenExpiration = new Date(response.expires);
    if (this.tokenTimeout) {
      clearTimeout(this.tokenTimeout);
    }
    this.tokenTimeout = window.setTimeout(
      () => this.token = '', 
      +this.tokenExpiration - Date.now());

    // optionally set local storage
    if (hasLocalStorage()) {
      localStorage.setItem(TOKEN, this.token);
      localStorage.setItem(TOKEN_EXPIRATION, this.tokenExpiration.toUTCString());
    }
  }
}


export class ApiError extends Error {}

const store = new ApiStore();
export default store;
