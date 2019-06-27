import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ pay }) => ({
  pay,
}))
class Result extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { out_trade_no = '' } = query;
    dispatch({
      type: 'pay/alipayResult',
      payload: {
        orderId: out_trade_no,
      },
    });
  }

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Spin />
          支付中..
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Result;
