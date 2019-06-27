import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Spin, Menu, Icon, Avatar } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import defaultAvatar from '../../../public/Avatar.png';

export default class GlobalHeaderRight extends PureComponent {
  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="setting">
          <Icon type="lock" />
          修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登陆
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    const userName = localStorage.getItem('userName');
    const deptName = localStorage.getItem('deptName');
    const deptType = localStorage.getItem('deptType');
    const hospitalName = localStorage.getItem('hospitalName');
    return (
      <div className={className}>
        {deptType === '1' || deptType === '2' || deptType === '3' ? (
          <span className={styles.deptName}>{`${hospitalName}——${deptName}`}</span>
        ) : (
          ''
        )}
        <HeaderDropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.avatar || defaultAvatar}
              alt="avatar"
            />
            <span className={styles.name}>{userName || '未登录'}</span>
          </span>
        </HeaderDropdown>
      </div>
    );
  }
}
