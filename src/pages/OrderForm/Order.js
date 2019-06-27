import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, List, Button, Icon, Tag, Modal } from 'antd';
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

  info = item => {
    console.log(item);
    const {
      hospitalBase: { hospitalName = '' },
      pruchaseInfo,
    } = item;
    Modal.info({
      title: hospitalName,
      content: (
        <div>
          <p>{pruchaseInfo || '还没有填写备注'}</p>
        </div>
      ),
      onOk() {},
    });
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
                  actions={[<div onClick={() => this.handlerDistribution(item)}>立即配货</div>]}
                >
                  <Card.Meta
                    title={
                      <a>
                        <span>{item.hospitalBase.hospitalName}</span>
                        <Tag color="cyan" onClick={() => this.info(item)}>
                          备注
                        </Tag>
                      </a>
                    }
                    description={
                      <div>
                        <div>{`科室:${item.deptBase ? item.deptBase.deptName : '-'}`}</div>
                        <div>{`订货时间:${item.creatDate ? item.creatDate : '-'}`}</div>
                        <div>{`到货时间:${item.arriveDate ? item.arriveDate : '-'}`}</div>
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
