import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Tag, Button } from 'antd';
import SupplierModal from './supplierModal';
import styles from '../SalesmanInfo.less';

@connect(({ salesman, loading }) => ({
  salesman,
  loading: loading.effects['salesman/fetchCustomer'],
}))
class CustomerModal extends Component {
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

  handlerSupplier = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/fetchSupplier',
      payload: {
        hospitalId: id,
      },
    });
  };

  render() {
    const {
      children,
      salesman: { customerList },
      loading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
      },
      {
        title: '邀请码',
        dataIndex: 'registCode',
        key: 'registCode',
      },
      {
        title: '创建时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '状态',
        dataIndex: 'hosptialState',
        key: 'hosptialState',
        render: (text, record) => {
          if (record.hosptialState === '1') {
            return <Tag color="green">正常</Tag>;
          } else if (record.hosptialState === '2') {
            return <Tag color="gray">停用</Tag>;
          } else {
            return '-';
          }
        },
      },
      {
        title: '查看统计',
        key: 'customer',
        render: (text, record) => (
          <SupplierModal>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              ghost
              size="small"
              onClick={() => this.handlerSupplier(record.hospitalId)}
            >
              供应商统计
            </Button>
          </SupplierModal>
        ),
      },
    ];

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="客户统计"
          width="80%"
          visible={visible}
          footer={null}
          onCancel={this.hideModelHandler}
        >
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={customerList}
              rowKey={record => record.hospitalId}
              loading={loading}
              pagination={false}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default CustomerModal;
