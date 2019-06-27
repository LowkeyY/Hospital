import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Tag, Button } from 'antd';
import styles from './ListModal.less';

@connect(({ hospitals, loading }) => ({
  hospitals,
  loading: loading.effects['hospitals/queryPayRecord'],
}))
class ListModal extends Component {
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

  handlerPayChick = orderId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitals/payChick',
      payload: {
        orderId,
      },
    });
  };

  render() {
    const {
      children,
      hospitals: { payList },
      loading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '支付前时间',
        dataIndex: 'beforeEndDate',
        key: 'beforeEndDate',
      },
      {
        title: '支付后到期时间',
        dataIndex: 'afterEndDate',
        key: 'afterEndDate',
      },
      {
        title: '充值时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '充值金额',
        dataIndex: 'investAmout',
        key: 'investAmout',
      },
      {
        title: '充值年限',
        dataIndex: 'investYear',
        key: 'investYear',
        render: (text, record) => record.investYear || '-',
      },
      {
        title: '充值方式',
        dataIndex: 'investType',
        key: 'investType',
        render: (text, record) => {
          if (record.investType === '1') {
            return <Tag color="blue">支付宝</Tag>;
          }
          if (record.investType === '2') {
            return <Tag color="green">后台充值</Tag>;
          }
          return '-';
        },
      },
      {
        title: '充值状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '1') {
            return <Tag color="red">未支付</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="green">已生效</Tag>;
          }
          return '-';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <Button size="small" onClick={() => this.handlerPayChick(record.orderId)}>
            支付验证
          </Button>
        ),
      },
    ];

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="充值记录"
          width="80%"
          visible={visible}
          footer={null}
          onCancel={this.hideModelHandler}
        >
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={payList}
              rowKey={record => record.orderId}
              loading={loading}
              pagination={false}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default ListModal;
