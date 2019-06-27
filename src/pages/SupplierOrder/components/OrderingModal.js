import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button } from 'antd';
import styles from './OrderingModal.less';

@connect(({ supplierOrder, loading }) => ({
  supplierOrder,
  orderLoading: loading.effects['supplierOrder/fetchOrder'],
}))
class OrderingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    // const { form } = this.props;
    // form.resetFields();
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      children,
      supplierOrder: { supplierOrderList },
      orderLoading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '货品',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase && record.goodsBase.goodsSpec,
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase && record.goodsBase.goodsUnit,
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.goodsBase && record.goodsBase.methodBase.methodName,
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase && record.goodsBase.manufacturer,
      },
    ];

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="订货单详情"
          width="80%"
          visible={visible}
          footer={null}
          onCancel={this.hideModelHandler}
        >
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={supplierOrderList}
              rowKey={record => record.id}
              loading={orderLoading}
              pagination={false}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default OrderingModal;
