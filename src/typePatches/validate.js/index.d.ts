// dec
declare module 'validate.js' {
  interface ValidateJS {
    (attributes: any, constraints: any, options?: any): any;
    async(attributes: any, constraints: any, options?: any): Promise<any>;
    single(value: any, constraints: any, options?: any): any;
    validators: {};
  }
  const validate: ValidateJS;

  export = validate;
}