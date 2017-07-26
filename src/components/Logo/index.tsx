import * as React from 'react';
const style = require('./Logo.pcss');
const Logo = () => (
  <div className={style.logoContainer}>
    <img className={style.logo} src={require('../../../public/logo.svg')}/>
    <span className={style.logoCaption}>
      <span className={style.brandName}>Poland 2.0</span><br/><span className={style.appName}>Questions</span>
    </span>
  </div>
);

export default Logo;