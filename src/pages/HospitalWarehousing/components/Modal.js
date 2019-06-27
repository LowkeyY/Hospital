import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table } from 'antd';
import styles from './Modal.less';

@connect(({ warehousing, loading }) => ({
  warehousing,
  loading: loading.effects['warehousing/fetchDetails'],
  loadingSingle: loading.effects['warehousing/querySingleDetails'],
}))
class Modals extends Component {
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
    const { dispatch } = this.props;
    dispatch({
      type: 'warehousing/updateState',
      payload: {
        detailsList: [],
      },
    });
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      children,
      warehousing: { detailsList },
      loading,
      loadingSingle,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        render: (text, record) => record.key || 1,
      },
      {
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (text, record) => record.goodsBase.goodsNameCn,
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        render: (text, record) => {
          const {
            record: { logType = '' },
          } = this.props;
          if (logType === '1') {
            return 1;
          }
          return record.goodsNumber;
        },
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '方法学',
        dataIndex: 'methodBase',
        key: 'methodBase',
        render: (text, record) => record.goodsBase.methodBase.methodName || '',
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
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase.manufacturer,
      },
    ];

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="入库详情"
          width="80%"
          visible={visible}
          footer={null}
          onCancel={this.hideModelHandler}
        >
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={detailsList}
              rowKey={record => record.detailId}
              loading={loading || loadingSingle}
              pagination={false}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default Modals;
