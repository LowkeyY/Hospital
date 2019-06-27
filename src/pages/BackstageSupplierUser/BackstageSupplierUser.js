import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Switch, Tag, Icon, Modal } from 'antd';
import SupplierUserModal from './components/SupplierUserModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BackstageSupplierUser.less';

const { confirm } = Modal;

@connect(({ loading, supplierUserManage }) => ({
  supplierUserManage,
  loading: loading.effects['supplierUserManage/fetch'],
}))
class SupplierUserManage extends PureComponent {
  componentDidMount() {}

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUserManage/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUserManage/editor',
      payload: {
        ...values,
        userId: id,
      },
    });
  };

  deleteRole = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUserManage/deleteRole',
      payload: {
        userId: id,
      },
    });
  };

  handlerSwitch = (userId, checked, e) => {
    const { dispatch } = this.props;
    confirm({
      title: '确定要改变状态吗？',
      content: '点击确定改变状态',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (checked) {
          dispatch({
            type: 'supplierUserManage/enableUser',
            payload: {
              userId,
            },
          });
        } else {
          dispatch({
            type: 'supplierUserManage/blockUser',
            payload: {
              userId,
            },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const {
      supplierUserManage: { list },
      loading,
      location: { query },
    } = this.props;
    const { suppilerName = '' } = query;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '姓名',
        dataIndex: 'userRealName',
        key: 'userRealName',
      },
      {
        title: '性别',
        dataIndex: 'userSex',
        key: 'userSex',
        render: (text, record) => {
          if (record.userSex === '0') {
            return '男';
          }
          if (record.userSex === '1') {
            return '女';
          }
          return '-';
        },
      },
      {
        title: '年龄',
        dataIndex: 'userAge',
        key: 'userAge',
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        key: 'userPhone',
      },
      {
        title: '状态',
        dataIndex: 'userState',
        key: 'userState',
        render: (text, record) => {
          if (record.userState === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.userState === '2') {
            return <Tag color="red">冻结</Tag>;
          }
          if (record.userState === '3') {
            return <Tag color="gray">停用</Tag>;
          }
          return '-';
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <SupplierUserModal
              record={record}
              onOk={values => this.editHandler(record.userId, values)}
            >
              <Icon className={styles.icon} type="edit" />
            </SupplierUserModal>
            <Switch
              checked={record.userState === '1'}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={checked => this.handlerSwitch(record.userId, checked)}
            />
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title={`${suppilerName}-人员管理`}>
        <div className={styles.commonList}>
          <div>
            {/*<SupplierUserModal record={{}} onOk={this.createHandler}>*/}
            {/*<Button type="primary" style={{ marginBottom: '10px' }}>*/}
            {/*添加人员*/}
            {/*</Button>*/}
            {/*</SupplierUserModal>*/}
          </div>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.userId}
            loading={loading}
            pagination={false}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SupplierUserManage;
