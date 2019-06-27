import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Tag } from 'antd';
import { baseUrl } from '@/utils/config';
import styles from '../index.less';

@connect(({ financeManage, loading }) => ({
  financeManage,
  loading: loading.effects['financeManage/queryPayRecord'],
}))
class RecordModal extends Component {
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
      financeManage: { recordList },
      loading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '充值用户',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '充值金额',
        dataIndex: 'investAmout',
        key: 'investAmout',
      },
      {
        title: '充值时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '充值年限',
        dataIndex: 'investYear',
        key: 'investYear',
        render: (text, record) => record.investYear || '-',
      },
      {
        title: '充值类型',
        dataIndex: 'investType',
        key: 'investType',
        render: (text, record) => {
          if (record.investType === '1') {
            return <Tag color="green">自己充值</Tag>;
          }
          if (record.investType === '2') {
            return <Tag color="green">后台充值</Tag>;
          }
          return '-';
        },
      },
      {
        title: '转账回单',
        dataIndex: 'investVoucher',
        key: 'investVoucher',
        render: (text, record) => {
          if (record.investVoucher) {
            return record.investVoucher.split(',').map(item => (
              <a href={`${baseUrl}${item}`} target="_blank">
                <img className={styles.img} src={`${baseUrl}${item}`} alt="" />
              </a>
            ));
          }
          return '未上传';
        },
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
              dataSource={recordList}
              rowKey={record => record.id}
              loading={loading}
              pagination={false}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default RecordModal;
