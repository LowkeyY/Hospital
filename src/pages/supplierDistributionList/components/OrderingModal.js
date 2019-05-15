import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button } from 'antd';
import styles from './OrderingModal.less';

@connect(({ supplierDistributionList, loading }) => ({
  supplierDistributionList,
  orderLoading: loading.effects['supplierDistributionList/fetchDetails'],
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
      supplierDistributionList: { detailsList },
      orderLoading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (text, record) => record.goodsBase.goodsNameCn,
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
      },
      {
        title: '灭菌日期',
        dataIndex: 'sterilizationDate',
        key: 'sterilizationDate',
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
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
              dataSource={detailsList}
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
