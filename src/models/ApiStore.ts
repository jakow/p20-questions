import * as SocketIO from 'socket.io-client';
import {observable, action, computed} from 'mobx';
import {UserDocument} from '../models/Document';
import hasLocalStorage from '../helpers/hasLocalStorage';
import Deferred from '../helpers/deferred';

const TOKEN = 'P20_QAPI_TOKEN';
const TOKEN_EXPIRATION = 'P20_QAPI_TOKEN_EXPIRATION';
export const SERVER_URI = process.env.NODE_ENV === 'production' ? 'https://poland20.com' : 
  `http://${window.location.hostname}:4000`;

export const httpApiRoute = (route: string) => `${SERVER_URI}/api/${route}`;

interface SocketConnectionCallback {
  (s: SocketIOClient.Socket): void;
}

interface LoginCallback {
  (user: UserDocument): void;
}

export class ApiStore {
  socketIo: SocketIOClient.Socket;
  token: string = '';
  tokenExpiration: Date = null;
  @observable user: UserDocument = null;
  @observable loginError: string = null;
  
  // login data
  @observable username: string = '';
  @observable password: string = '';

  private tokenTimeout: number;
  private socketConnectionCallbacks: SocketConnectionCallback[] = [];
  private loginCallbacks: LoginCallback[] = [];

  constructor() {
    if (hasLocalStorage()) {
      this.token = localStorage.getItem(TOKEN) || '';
      this.tokenExpiration = new Date(localStorage.getItem(TOKEN_EXPIRATION));
    }
    this.connectSocketIo(this.isLoggedIn ? '/admin' : '/client');
  }

  @action
  async login() {
    try {
      const result =  await this.post('login', {
        body: {email: this.username, password: this.password},
      });
      this.user = result.user;
      this.setToken(result);

      this.connectSocketIo('/admin');
      this.loginCallbacks.forEach((cb) => cb(this.user));
      this.username = '';
      this.password = '';
      return this.loginError = null;
    } catch (e) {
      return this.loginError = e.message;
    } finally {
      // do not persist credentials
    }
  }

  @action 
  logout = () => {
    this.token = '';
    this.tokenExpiration = null;
    clearTimeout(this.tokenTimeout);
  }


  /**
   * We cannot _truly_ know whether the user is logged in until we hit the server
   * with a request and see whether it accepts. However, the expiration of the token
   * is a good indication that the user is actually logged in
   */
  @computed get isLoggedIn() {
    return this.token.length !== 0 && this.tokenExpiration !== null && +this.tokenExpiration - Date.now() > 0;
  }

  /**
   * Add a task to be done when the user logs in
   * @param cb the 
   */
  addLoginCallback(cb: LoginCallback) {
    this.loginCallbacks.push(cb);
    if (this.isLoggedIn) {
      cb(this.user);
    }
  }

  connectSocketIo(namespace: string) {
    const socketUri = SERVER_URI + namespace;
    // close previous socket
    if (this.socketIo) {
      this.socketIo.close();
    }
    this.socketIo = SocketIO(socketUri);
    const io = this.socketIo;
    io.on('connect', this.onSocketConnected);
    // io.on('disconnect', this.onSocketDisconnected);
  }

  onSocketConnected = () => {
    const io = this.socketIo;
    if (io.nsp === '/admin' && this.isLoggedIn) {
      io.emit('authenticate', {token: this.token});
      // normally the token is valid so 'not authenticated' should not fire
    }
    this.socketConnectionCallbacks.forEach((callback) => callback(io));
  }

  // onSocketDisconnected = (reason: string) => {
  //   console.info('Socket disconnected. Reason: ' + reason);
  // }

  /**
   * Allow other modules to register a callback to be executed when
   * 
   * @param handler The function to be called when Socket.IO connects
   */
  addSocketConnectionCallback(handler: SocketConnectionCallback) {
    this.socketConnectionCallbacks.push(handler);
    if (this.socketIo.connected) {
      handler(this.socketIo);
    }
  }

  /**
   * Create an iterator over event stream for an event of given name
   * WARNING: Should only be used with for-async-of, where
   * next() is called immediately after the data is consumed.
   * Otherwise a promise may be resolved twice, resulting in an error
   * @param eventName 
   */
  socketEventStream<T>(eventName: string): AsyncIterableIterator<T> {
    const io = this.socketIo;
    let deferred: Deferred<IteratorResult<T>>;
    const handler = (value: T) => {
      if (deferred && !deferred.resolved) {
        deferred.resolve({ value, done: false });
      } else if (deferred.resolved) {
        throw new Error('[socket event stream] Socket event stream deferred resolved twice');
      } else {
        console.warn('[socket event stream] Event stream has registered an event but there was no listener');
      }
    };
    // attach the handler that will resolve the iterator promises
    io.on(eventName, handler);

    io.once('disconnect', () => {
      io.off(eventName, handler);
      if (!deferred.resolved) {
        deferred.reject(new Error('Socket event stream broken: Socket disconnected'));
      }
    });

    return {
      next() {
        deferred = new Deferred<IteratorResult<T>>();
        return deferred;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      return() {
        // close the socket stream
        io.off(eventName, handler);
        return null;
      }
    };
  }

  /**
   * Wrapper around fetch which appends token to the request if the token is valid and
   * knows the route to the server. Requests are assumed to have a JSON body by default.
   * @param route 
   * @param options 
   */
  async fetch(route: string, options?: RequestInit) {

    const defaults: RequestInit = {
      headers: this.isLoggedIn ? {'Authorization': `JWT ${this.token}`} : {}, 
      mode: 'cors',
    };
    const opt = {...defaults, ...options};
    // auto stringify JSON body
    if (typeof opt.body === 'object') {
      opt.headers['Content-Type'] = 'application/json';
      opt.body = JSON.stringify(opt.body);
    }

    const response = await fetch(httpApiRoute(route), opt);
    if (!response.ok) {
      let message = response.statusText || response.status.toString();
      if (response.headers.get('Content-Type').startsWith('application/json')) {
        const body = await response.json();
        // different api routes tend to have a different status messages
        // arguably, this should be made consistent on server side.
        message = body.message || body.status || body.error || message;
      } 
      throw new Error(message);
    }
    return await response.json();
  }

  /* HTTP API convenience methods */

  post(resource: string, options?: RequestInit) {
    return this.fetch(resource, {method: 'POST', ...options});
  }

  create(resource: string, options?: RequestInit) {
    return this.post(resource, options);
  }

  read(resource: string, options?: RequestInit) {
    return this.fetch(resource, {method: 'GET', ...options});
  }
  
  update(resource: string, options?: RequestInit) {
    // make an 'intelligent' guess as to which update (PATCH/PUT) is used
    let body = options.body;
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

const store = new ApiStore();

(global as any).apiStore = store; // tslint:disable-line

export default store;
