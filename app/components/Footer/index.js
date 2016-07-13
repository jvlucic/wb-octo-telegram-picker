import React from 'react';
import classnames from 'classnames';
import './styles.scss';

export default function Footer({ large = false } = {}) {
  return (
    <div className={classnames('Footer', { 'Footer-large': large })} >
      <p>
        <span>Copyright © 2014 - 2016 Unidesq Platform. All rights reserved. Made with love in Cologne, Germany.</span>
        &nbsp;
        <a href="http://www.unidesq.com/impressum/" target="blank">Impressum</a>
      </p>
    </div>
  );
}
