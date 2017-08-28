import * as React from 'react';

const style = require('./AboutModalContent.pcss');
const logo = require('../../../public/logo.svg');
const parrot = require('../../../public/parrot.gif');

export default function AboutModalContent() {
  return (
  <div className={style.content}>
    <div className={style.header}>
      <div>
        <img className={style.logo} src={logo} alt="Poland 2.0 Logo" />
      </div>
      <div className={style.logoText}>
        <span>Poland 2.0</span><br />
        <span className={style.bold}>Questions</span>
      </div>
      <p>An app to ask questions simply.</p>
    </div>

    <footer className={style.footer}>
      <p>
        Made with <img className={style.parrot} src={parrot} />
        by <a href="https://github.com/jakow">Jakub Kowalczyk</a>
      </p>
    </footer>
  </div>
  );
}
