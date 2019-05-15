import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import HospitalModal from './components/hospitalModal';
import EditorModal from './components/editorModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './HospitalManage.less';

const confirm = Modal.confirm;

@connect(({ loading, hospitalManage }) => ({
  hospitalManage,
  loading: loading.effects['hospitalManage/fetch'],
}))
class HospitalManage extends PureComponent {
  componentDidMount() {
    // const { dispatch, hospitalManage: { pageSize } } = this.props;
    // dispatch({
    //   type: 'hospitalManage/fetch',
    //   payload: {
    //     nowPage: 1,
    //     pageSize: pageSize,
    //   },
    // });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalManage/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalManage/editor',
      payload: {
        ...values,
        hospitalId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalManage: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-manage',
        query: { nowPage: page, pageSize },
      })
    );
    // dispatch({
    //   type: 'hospitalManage/updateNowPage',
    //   payload: {
    //     nowPage: page,
    //   },
    // });
    // dispatch({
    //   type: 'hospitalManage/fetch',
    //   payload: {
    //     nowPage: page,
    //     pageSize,
    //   },
    // });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'hospitalManage/updatePageSize',
    //   payload: {
    //     pageSize,
    //   },
    // });
    dispatch({
      type: 'hospitalManage/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handlerOrganization = record => {
    const { dispatch } = this.props;
    const { hospitalId, hospitalName } = record;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-organization',
        query: { hospitalId, hospitalName },
      })
    );
  };

  handlerSwitch = (hospitalId, checked, e) => {
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
            type: 'hospitalManage/enable',
            payload: {
              hospitalId,
            },
          });
        } else {
          dispatch({
            type: 'hospitalManage/block',
            payload: {
              hospitalId,
            },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handlerOrderClick = record => {
    const { dispatch } = this.props;
    const { hospitalId, hospitalName } = record;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/order-list',
        query: { hospitalId, hospitalName },
      })
    );
  };

  render() {
    const {
      hospitalManage: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
      },
      {
        title: '邀请码',
        dataIndex: 'registCode',
        key: 'registCode',
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
        title: '组织机构',
        dataIndex: 'organization',
        key: 'organization',
        render: (text, record) => (
          <Button
            size="small"
            style={{ marginRight: '5px' }}
            onClick={() => this.handlerOrganization(record)}
          >
            查看
          </Button>
        ),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <EditorModal
              record={record}
              onOk={values => this.editHandler(record.hospitalId, values)}
            >
              <Icon className={styles.icon} type="edit" />
            </EditorModal>
            <Switch
              checked={record.hosptialState === '1'}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={checked => this.handlerSwitch(record.hospitalId, checked)}
            />
          </span>
        ),
      },
      {
        title: '查询订货单',
        key: 'order',
        render: (text, record) => (
          <Button size="small" onClick={() => this.handlerOrderClick(record)}>
            订货单
          </Button>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <div>
            <HospitalModal record={{}} onOk={this.createHandler}>
              <Button type="primary" style={{ marginBottom: '10px' }}>
                添加医院
              </Button>
            </HospitalModal>
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
      </PageHeaderWrapper>
    );
  }
}

export default HospitalManage;
