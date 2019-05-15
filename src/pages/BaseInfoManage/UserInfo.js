import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import UserModal from './components/userModal';
import styles from './UserInfo.less';

const confirm = Modal.confirm;

@connect(({ loading, userInfo, global }) => ({
  userInfo,
  global,
  loading: loading.effects['user/fetch'],
}))
class UserInfo extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryRole',
    });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/editor',
      payload: {
        ...values,
        userId: id,
      },
    });
  };

  deleteRole = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/deleteRole',
      payload: {
        userId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      userInfo: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/info-manage/user',
        query: { nowPage: page, pageSize },
      })
    );
    // dispatch({
    //   type: 'user/updateNowPage',
    //   payload: {
    //     nowPage: page,
    //   },
    // });
    // dispatch({
    //   type: 'user/fetch',
    //   payload: {
    //     nowPage: page,
    //     pageSize,
    //   },
    // });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'user/updatePageSize',
    //   payload: {
    //     pageSize,
    //   },
    // });
    dispatch({
      type: 'userInfo/fetch',
      payload: {
        nowPage: current,
        pageSize,
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
            type: 'userInfo/enableUser',
            payload: {
              userId,
            },
          });
        } else {
          dispatch({
            type: 'userInfo/blockUser',
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
      userInfo: { list, totalCount, nowPage, pageSize },
      global: { role },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '姓名',
        dataIndex: 'userRealName',
      },
      {
        title: '性别',
        dataIndex: 'userSex',
        render: (text, record) => (record.userSex === '0' ? '男' : '女'),
      },
      {
        title: '年龄',
        dataIndex: 'userAge',
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
      },
      {
        title: '状态',
        dataIndex: 'userState',
        render: (text, record) => {
          if (record.userState === '1') {
            return <Tag color="green">正常</Tag>;
          } else if (record.userState === '2') {
            return <Tag color="red">冻结</Tag>;
          } else if (record.userState === '3') {
            return <Tag color="gray">停用</Tag>;
          } else {
            return '-';
          }
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <UserModal
              record={record}
              role={role}
              onOk={values => this.editHandler(record.userId, values)}
            >
              <Icon className={styles.icon} type="edit" />
            </UserModal>
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
      <div className={styles.commonList}>
        <div>
          <UserModal record={{}} role={role} onOk={this.createHandler}>
            <Button type="primary" style={{ marginBottom: '10px' }}>
              添加人员
            </Button>
          </UserModal>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          loading={loading}
          pagination={false}
          onChange={this.pageChangeHandler}
        />
        <Pagination
          className="ant-table-pagination"
          total={totalCount}
          current={nowPage}
          pageSize={pageSize}
          onChange={this.pageChangeHandler}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
        />
      </div>
    );
  }
}

export default UserInfo;
