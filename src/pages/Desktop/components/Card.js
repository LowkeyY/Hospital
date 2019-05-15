import React from 'react';
import { Icon } from 'antd';
import { isUrl } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import styles from './Card.less';

const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};
const Card = props => {
  const {
    data: { name, icon, path },
    handlerClick,
  } = props;
  return (
    <div className={styles.outer} onClick={e => handlerClick(e, path)}>
      <div>
        <span className={styles.icon}>{getIcon(icon)}</span>
        <div>{name}</div>
      </div>
    </div>
  );
};
export default Card;
