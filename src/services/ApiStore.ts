import {merge} from 'lodash';
import {observable, action, computed} from 'mobx';
import * as SocketIO from 'socket.io-client';
import {User} from '../models/User';
import ApiError, {ErrorCode} from './ApiError';

import hasLocalStorage from '../helpers/hasLocalStorage';
import {TOKEN, TOKEN_EXPIRATION, SERVER_URI} from '../constants';



export const httpApiRoute = (route: string) => `${SERVER_URI}/api/${route}`;

export default class ApiStore {
  @observable tokenExpiration: Date = null;
  @observable user: User = null;
  @observable loginError: string = null;
  @observable username: string = '';
  @observable password: string = '';

  private socketIo: SocketIOClient.Socket;
  private token: string = '';
  private socketConnectionCallbacks: SocketConnectionCallback[] = [];
  private loginCallbacks: LoginCallback[] = [];

  constructor() {
    if (hasLocalStorage()) {
      this.token = localStorage.getItem(TOKEN);
      this.tokenExpiration = new Date(localStorage.getItem(TOKEN_EXPIRATION));
    }
    this.connectSocketIo(this.isLoggedIn ? '/admin' : '/client');
  }

  /**
   * Log in to questions API
   * @param username 
   * @param password 
   */
  @action
  async login(username: string, password: string) {
    try {
      const result =  await this.post<LoginResponse>('login', {
        body: {email: username, password: password},
      });
      this.user = result.user;
      this.setToken(result);
      this.connectSocketIo('/admin');
      this.loginCallbacks.forEach((cb) => cb(this.user));
      this.username = ''; 
      
      return this.loginError = null;
    } catch (e) {
      const err = e as ApiError;
      if (err.code === ErrorCode.UNAUTHORIZED) {
        this.loginError = 'Invalid username and/or password';
      } else {
        this.loginError = 'Something went wrong. Try again later.';
      }
      return this.loginError;
    } finally {
      this.password = ''; 
    }
  }

  /**
   * Dispose of the access token and clear user data
   */
  @action 
  logout() {
    this.user = null;
    this.token = null;
    this.tokenExpiration = new Date();
  }

  /**
   * We cannot _truly_ know whether the user is logged in until we hit the server
   * with a request and see whether it accepts. However, the presence and valid expiration 
   * of the token is a good indication that the user is actually logged in.
   */
  @computed get isLoggedIn() {
    return this.token != null && this.tokenExpiration != null && +this.tokenExpiration - Date.now() > 0;
  }

  /**
   * Add a task to be done when the user logs in
   * @param cb the callback
   */
  onLogin(cb: LoginCallback) {
    this.loginCallbacks.push(cb);
    if (this.isLoggedIn) {
      cb(this.user);
    }
  }

  /**
   * Allow other modules to register a callback to be executed when
   * 
   * @param handler The function to be called when Socket.IO connects
   */
  onSocketConnection(handler: SocketConnectionCallback) {
    this.socketConnectionCallbacks.push(handler);
    if (this.socketIo.connected) {
      handler(this.socketIo);
    }
  }

  /**
   * Wrapper around fetch which appends token to the request if the token is valid and
   * knows the route to the server. Requests are assumed to have a JSON body by default.
   * @param route 
   * @param options 
   */
  async fetch<ResponseType>(route: string, options?: RequestInit): Promise<ResponseType> {
    const APP_JSON = 'application/json';
    const defaults: RequestInit = {
      headers: this.isLoggedIn ? {Authorization: `JWT ${this.token}`} : {}, 
      mode: 'cors',
    };
    const opt = merge({}, defaults, options);
    // auto stringify JSON body
    if (typeof opt.body === 'object') {
      opt.headers['Content-Type'] = APP_JSON;
      opt.body = JSON.stringify(opt.body);
    }
    const response = await fetch(httpApiRoute(route), opt);
    if (!response.ok) {
      // make sure that user data stays to date when making an invalid request
      if (response.status === 403 || response.status === 401) {
        this.logout();
      }
      let message = response.statusText;
      if (response.bodyUsed && response.headers.get('Content-Type').startsWith(APP_JSON)) {
        const body = await response.json();
        // different api routes tend to have a different status messages
        // arguably, this should be made consistent on server side.
        message = body.error || body.message || body.status || message;
      } 
      throw new ApiError(message, response.status);
    }
    return await response.json();
  }

  /* HTTP API convenience methods */

  post<ResponseType>(resource: string, options?: RequestInit): Promise<ResponseType> {
    return this.fetch(resource, {method: 'POST', ...options});
  }

  create<ResponseType>(resource: string, options?: RequestInit): Promise<ResponseType> {
    return this.post(resource, options);
  }

  read<ResponseType>(resource: string, options?: RequestInit): Promise<ResponseType> {
    return this.fetch(resource, {method: 'GET', ...options});
  }
  
  update<ResponseType>(resource: string, options?: RequestInit): Promise<ResponseType> {
    // make an 'intelligent' guess as to which update (PATCH/PUT) is used
    const body = options.body;
    let method = 'PUT';
    // try to find that the json is an array without parsing it (because that is expensive!)
    if (Array.isArray(body) || (typeof body === 'string' && body[0] === '[')) {
      method = 'PATCH';
    }
    return this.fetch(resource, {method, ...options});
  }

  delete(resource: string, options?: RequestInit) {
    return this.fetch(resource, {method: 'delete', ...options});
  }

  /*** PRIVATE METHODS ***/
  private setToken(response: LoginResponse) {
    this.token = response.token;
    this.tokenExpiration = new Date(response.expires);
    setTimeout(() => this.logout(), +this.tokenExpiration - Date.now());

    // optionally set local storage
    if (hasLocalStorage()) {
      localStorage.setItem(TOKEN, this.token);
      localStorage.setItem(TOKEN_EXPIRATION, this.tokenExpiration.toUTCString());
    }
  }

  private connectSocketIo(namespace: string) {
    const socketUri = SERVER_URI + namespace;
    // close previous socket
    if (this.socketIo) {
      this.socketIo.close();
    }
    this.socketIo = SocketIO(socketUri);
    const io = this.socketIo;
    io.on('connect', () => this.socketConnectCallback());
  }

  private socketConnectCallback() {
    const io = this.socketIo;
    if (io.nsp === '/admin' && this.isLoggedIn) {
      io.emit('authenticate', { token: this.token });
      // normally the token is valid so 'not authenticated' should not fire
    }
    this.socketConnectionCallbacks.forEach((callback) => callback(io));
  }
}

interface SocketConnectionCallback {
  (s: SocketIOClient.Socket): void;
}

interface LoginCallback {
  (user: User): void;
}

interface LoginResponse {
  token: string;
  expires: string;
  user: User;
}
