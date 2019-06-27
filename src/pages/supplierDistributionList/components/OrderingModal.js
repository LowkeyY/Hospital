import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Tag } from 'antd';
import EditorModal from './EditorModal';
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

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    const { termOfValidity, sterilizationDate, batchNumber } = values;
    dispatch({
      type: 'supplierDistributionList/editor',
      payload: {
        batchNumber,
        termOfValidity: termOfValidity.format('YYYY-MM-DD'),
        sterilizationDate: sterilizationDate.format('YYYY-MM-DD'),
        detailId: id,
      },
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
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 200,
        render: (text, record) => record.goodsBase.goodsNameCn,
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
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.goodsBase && record.goodsBase.methodBase.methodName,
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        width: 200,
        render: (text, record) => record.goodsBase.manufacturer,
      },

      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
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
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          if (record.goodsBase.state === '1') {
            return (
              <EditorModal
                record={record}
                onOk={values => this.editHandler(record.detailId, values)}
              >
                <Button type="primary" ghost size="small">
                  修改
                </Button>
              </EditorModal>
            );
          }
          return <Tag color="cyan">已入库</Tag>;
        },
      },
    ];
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="配货单详情"
          width="90%"
          visible={visible}
          footer={null}
          onCancel={this.hideModelHandler}
        >
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={detailsList}
              rowKey={record => record.detailId}
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
