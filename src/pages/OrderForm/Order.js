import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, List, Button, Icon } from 'antd';

import styles from './Order.less';

@connect(({ orderForm, loading }) => ({
  orderForm,
  loading: loading.effects['orderForm/fetchOrder'],
}))
class CardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderForm/fetchOrder',
    });
  }

  handlerDistribution = item => {
    const { dispatch } = this.props;
    const { purchaseId, purchaseHospatisId, deptId } = item;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/Supplier-distribution',
        query: {
          purchaseId,
          purchaseHospatisId,
          deptId,
        },
      })
    );
  };

  handlerAddDistribution = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/Add-supplier',
      })
    );
  };

  render() {
    const {
      orderForm: { orderList },
      loading,
    } = this.props;

    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={['', ...orderList]}
          renderItem={item =>
            item ? (
              <List.Item key={item.purchaseId}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={[<a onClick={() => this.handlerDistribution(item)}>立即配货</a>]}
                >
                  <Card.Meta
                    title={<a>{item.hospitalBase.hospitalName}</a>}
                    description={
                      <div>
                        <div style={{ marginBottom: '10px' }}>
                          {`科室:${item.deptBase ? item.deptBase.deptName : '-'}`}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            ) : (
              <List.Item onClick={() => this.handlerAddDistribution()}>
                <Button type="dashed" className={styles.newButton}>
                  <Icon type="plus" /> 新建配货单
                </Button>
              </List.Item>
            )
          }
        />
      </div>
    );
  }
}

export default CardList;
