import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import RoleModal from './components/RoleModal';
import styles from './RoleManage.less';

@connect(({ loading, roleManage }) => ({
  roleManage,
  loading: loading.effects['roleManage/fetch'],
}))
class RoleManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/fetch',
    });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/editor',
      payload: {
        ...values,
        roleId: id,
      },
    });
  };

  deleteRole = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/deleteRole',
      payload: {
        roleId: id,
      },
    });
  };

  render() {
    const {
      roleManage: { roleList, visible },
      loading,
      dispatch,
    } = this.props;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '顺序',
        dataIndex: 'sortId',
        key: 'sortId',
      },
      {
        title: '创建时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <RoleModal record={record} onOk={values => this.editHandler(record.roleId, values)}>
              <Icon className={styles.icon} type="edit" />
            </RoleModal>
            <Popconfirm title="确定删除?" onConfirm={() => this.deleteRole(record.roleId)}>
              <Icon className={styles.icon} type="delete" />
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.commonList}>
        <div>
          <RoleModal record={{}} onOk={this.createHandler}>
            <Button type="primary" style={{ marginBottom: '10px' }}>
              新建角色
            </Button>
          </RoleModal>
        </div>
        <Table
          columns={columns}
          dataSource={roleList}
          rowKey={record => record.id}
          pagination={false}
          loading={loading}
        />
      </div>
    );
  }
}

export default RoleManage;
