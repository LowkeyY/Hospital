import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class IconPicker extends PureComponent {
  constructor() {
    super();
    this.state = {
      icon: 'left',
    };
  }

  componentWillUnmount() {}

  render() {
    const { icon = '' } = this.state;
    return (
      <div className={styles.outer}>
        <div className={styles.iconbox}>
          <Icon type={icon} style={{ fontSize: '28px', verticalAlign: 'middle' }} />
        </div>
      </div>
    );
  }
}
