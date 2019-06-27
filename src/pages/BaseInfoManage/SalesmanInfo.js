import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import CustomerModal from './components/customerModal';
import SalesmanModal from './components/salesmanModal';
import styles from './SalesmanInfo.less';

const confirm = Modal.confirm;

@connect(({ loading, salesman }) => ({
  salesman,
  loading: loading.effects['salesman/fetch'],
}))
class SalesmanInfo extends PureComponent {
  componentDidMount() {
    // const { dispatch, salesman: { pageSize } } = this.props;
    // dispatch({
    //   type: 'salesman/fetch',
    //   payload: {
    //     nowPage: 1,
    //     pageSize: pageSize,
    //   },
    // });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/editor',
      payload: {
        ...values,
        userId: id,
      },
    });
  };

  deleteRole = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/deleteRole',
      payload: {
        userId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      salesman: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/info-manage/salesman',
        query: { nowPage: page, pageSize },
      })
    );
    // dispatch({
    //   type: 'salesman/updateNowPage',
    //   payload: {
    //     nowPage: page,
    //   },
    // });
    // dispatch({
    //   type: 'salesman/fetch',
    //   payload: {
    //     nowPage: page,
    //     pageSize,
    //   },
    // });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'salesman/updatePageSize',
    //   payload: {
    //     pageSize,
    //   },
    // });
    dispatch({
      type: 'salesman/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handlerCustomer = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/fetchCustomer',
      payload: {
        slsmUserId: id,
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
            type: 'salesman/enableUser',
            payload: {
              userId,
            },
          });
        } else {
          dispatch({
            type: 'salesman/blockUser',
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
      salesman: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '业务员',
        dataIndex: 'userRealName',
      },
      {
        title: '性别',
        dataIndex: 'userSex',
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
            <SalesmanModal record={record} onOk={values => this.editHandler(record.userId, values)}>
              <Icon className={styles.icon} type="edit" />
            </SalesmanModal>
            <Switch
              checked={record.userState === '1'}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={checked => this.handlerSwitch(record.userId, checked)}
            />
          </span>
        ),
      },
      {
        title: '查看统计',
        key: 'customer',
        render: (text, record) => (
          <CustomerModal>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              ghost
              size="small"
              onClick={() => this.handlerCustomer(record.userId)}
            >
              客户统计
            </Button>
          </CustomerModal>
        ),
      },
    ];
    return (
      <div className={styles.commonList}>
        <div>
          <SalesmanModal record={{}} onOk={this.createHandler}>
            <Button type="primary" style={{ marginBottom: '10px' }}>
              添加业务员
            </Button>
          </SalesmanModal>
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
          total={totalCount * 1}
          current={nowPage * 1}
          pageSize={pageSize * 1}
          onChange={this.pageChangeHandler}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
        />
      </div>
    );
  }
}

export default SalesmanInfo;
