import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, InputNumber, Empty } from 'antd';
import OrderingModal from './components/OrderingModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Ordering.less';

const getShopList = arr => {
  const result = [];
  const obj = {};
  arr.map((item, i) => {
    if (!obj[item.suppilerId]) {
      result.push({
        suppilerId: item.suppilerId,
        suppilerName: item.suppilerBase.suppilerName,
        details: [item],
      });
      obj[item.suppilerId] = item;
    } else {
      result.map((data, i) => {
        if (data.suppilerId === item.suppilerId) {
          data.details.push(item);
        }
      });
    }
  });
  return result;
};

@connect(({ hospitalOrder, loading }) => ({
  hospitalOrder,
  loading,
}))
class Ordering extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const {
      hospitalOrder: { shopList },
    } = this.props;
    if (nextProps.hospitalOrder.shopList !== shopList) {
      localStorage.setItem(
        `shop${localStorage.getItem('userId')}`,
        JSON.stringify(nextProps.hospitalOrder.shopList)
      );
    }
  }

  addOrder = () => {
    const {
      dispatch,
      hospitalOrder: { shopList },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/addOrder',
      payload: {
        orderData: JSON.stringify(getShopList(shopList)),
      },
    });
  };

  changeNum = (value, record) => {
    record.goodsNumber = value;
  };

  handlerOkClick = () => {
    const {
      hospitalOrder: { shopList },
    } = this.props;
    localStorage.setItem(`shop${localStorage.getItem('userId')}`, JSON.stringify(shopList));
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/deleteGoods',
      payload: {
        goodsId: id,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { shopList },
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '货品名称',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        render: (text, record) => (
          <InputNumber
            key={record.goodsId}
            min={1}
            defaultValue={record.goodsNumber}
            onChange={value => this.changeNum(value, record)}
          />
        ),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Button type="primary" onClick={() => this.deleteItem(record.goodsId)}>
            删除
          </Button>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <div className={styles.buttonBox}>
            <OrderingModal onOk={this.handlerOkClick}>
              <Button type="primary" style={{ marginBottom: '10px' }}>
                添加货品
              </Button>
            </OrderingModal>
            {shopList.length > 0 ? (
              <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.addOrder}>
                提交订单
              </Button>
            ) : null}
          </div>
          {shopList.length > 0 ? (
            getShopList(shopList).map(item => (
              <Table
                title={() => item.suppilerName}
                columns={columns}
                dataSource={item.details || []}
                rowKey={record => record.id}
                pagination={false}
              />
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="订单空空如也" />
          )}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Ordering;
