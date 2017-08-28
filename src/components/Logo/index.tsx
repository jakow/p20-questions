import * as React from 'react';
const style = require('./Logo.pcss');
const Logo = () => (
  <div className={style.logoContainer}>
    <a className={style.link} href="/">
    <img className={style.logo} src={require('../../../public/logo.svg')}/>
    <span className={style.logoCaption}>
      <span className={style.caption}>Questions</span>
      
      <span className={style.subcaption}><br/>questions.poland20.com</span>
    </span>
    </a>
  </div>
);

export default Logo;
