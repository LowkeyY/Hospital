import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Tag, Button } from 'antd';
import styles from '../SalesmanInfo.less';
import EditorModal from '../../SupplierManage/components/editorModal';

@connect(({ salesman, loading }) => ({
  salesman,
  loading: loading.effects['salesman/fetchSupplier'],
}))
class SupplierModal extends Component {
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
      salesman: { supplierList },
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
        title: '简称',
        dataIndex: 'suppilerShortName',
        key: 'suppilerShortName',
      },
      {
        title: '名称',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
      },
      {
        title: '联系人',
        dataIndex: 'conractsName',
        key: 'conractsName',
      },
      {
        title: '手机号',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
      },
      {
        title: '状态',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
        render: (text, record) => {
          if (record.suppilerState === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.suppilerState === '2') {
            return <Tag color="gray">停用</Tag>;
          }
          return '-';
        },
      },
    ];

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="供应商统计"
          width="80%"
          visible={visible}
          footer={null}
          onCancel={this.hideModelHandler}
        >
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={supplierList}
              rowKey={record => record.suppilerId}
              loading={loading}
              pagination={false}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default SupplierModal;
