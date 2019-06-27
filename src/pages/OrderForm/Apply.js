import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List, Tag, Modal } from 'antd';

import styles from './Order.less';

@connect(({ orderForm, loading }) => ({
  orderForm,
  loading: loading.effects['orderForm/fetchHospital'],
}))
class CardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderForm/fetchHospital',
    });
  }

  renderState = state => {
    if (state === '0') {
      return <Tag color="pink">未审核</Tag>;
    }
    if (state === '1') {
      return <Tag color="green">审核通过</Tag>;
    }
    if (state === '2') {
      return <Tag color="red">审核失败</Tag>;
    }
    if (state === '3') {
      return <Tag color="gray">已停用</Tag>;
    }
    return '-';
  };

  showReason = (reason = '未通过') => {
    Modal.warning({
      title: '由于以下原因本次审核未通过',
      content: reason,
    });
  };

  render() {
    const {
      orderForm: { hospitalList },
      loading,
    } = this.props;
    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={hospitalList}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                hoverable
                className={styles.card}
                onClick={item.state === '2' ? () => this.showReason(item.reason) : null}
              >
                <Card.Meta
                  title={<a>{item.hospitalBase.hospitalName}</a>}
                  description={
                    <div>
                      <div style={{ marginBottom: '10px' }}>
                        {`科室:${item.deptBase ? item.deptBase.deptName : '-'}`}
                      </div>
                      {this.renderState(item.state)}
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default CardList;
