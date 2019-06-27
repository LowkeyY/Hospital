import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Form } from 'antd';
import Card from './components/Card';
import styles from './Desktop.less';

@connect(({ login, loading, menu, global }) => ({
  login,
  menu,
  submitting: loading.effects['login/login'],
  global,
}))
@Form.create()
class Desktop extends Component {
  state = {};

  handlerMenuClick = (e, path = '') => {
    router.push(`${path}`);
  };

  render() {
    const {
      menu: { menuData },
    } = this.props;
    return (
      <div className={styles.main}>
        <Row justify="space-around">
          {menuData &&
            menuData.map((data, i) => {
              return (
                <Col key={i} span={8}>
                  <Card data={data} handlerClick={this.handlerMenuClick} />
                </Col>
              );
            })}
        </Row>
      </div>
    );
  }
}

export default Desktop;
