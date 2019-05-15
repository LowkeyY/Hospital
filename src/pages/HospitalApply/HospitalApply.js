import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './HospitalApply.less';

const pop = {
  pass: '确定通过该审核吗？',
  fail: '确定拒绝该申请吗？',
  unlock: '确定启用吗？',
  lock: '确定停用吗？',
};

@connect(({ loading, hospitalApply }) => ({
  hospitalApply,
  loading: loading.effects['hospitalApply/fetch'],
}))
class HospitalApply extends PureComponent {
  componentDidMount() {}

  handlerPassClick = applyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalApply/pass',
      payload: {
        applyId,
      },
    });
  };

  handlerFailClick = applyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalApply/fail',
      payload: {
        applyId,
      },
    });
  };

  handlerUnlockClick = applyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalApply/enable',
      payload: {
        applyId,
      },
    });
  };

  handlerLockClick = applyId => {
    console.log(22);
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalApply/block',
      payload: {
        applyId,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalApply: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-apply',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalApply/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  getButtons = (state, applyId) => {
    if (state === '0') {
      return (
        <div>
          <Popconfirm title={pop.pass} onConfirm={() => this.handlerPassClick(applyId)}>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: '10px', background: '#00e676', borderColor: '#00e676' }}
            >
              审核通过
            </Button>
          </Popconfirm>
          <Popconfirm title={pop.fail} onConfirm={() => this.handlerFailClick(applyId)}>
            <Button
              type="primary"
              size="small"
              style={{ background: '#e53935', borderColor: '#e53935' }}
            >
              审核失败
            </Button>
          </Popconfirm>
        </div>
      );
    }
    if (state === '1') {
      return (
        <Popconfirm title={pop.lock} onConfirm={() => this.handlerLockClick(applyId)}>
          <Button type="primary" size="small">
            停用
          </Button>
        </Popconfirm>
      );
    }
    if (state === '2') {
      return (
        <Popconfirm title={pop.fail} onConfirm={() => this.handlerFailClick(applyId)}>
          <Button
            type="primary"
            size="small"
            style={{ background: '#e53935', borderColor: '#e53935' }}
          >
            审核失败
          </Button>
        </Popconfirm>
      );
    }
    if (state === '3') {
      return (
        <Popconfirm title={pop.unlock} onConfirm={() => this.handlerUnlockClick(applyId)}>
          <Button type="primary" size="small">
            启用
          </Button>
          ;
        </Popconfirm>
      );
    }
    return '-';
  };

  render() {
    const {
      hospitalApply: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '科室',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '联系人',
        dataIndex: 'conractsName',
        key: 'conractsName',
        render: (text, record) => record.suppilerBase.conractsName,
      },
      {
        title: '联系电话',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
        render: (text, record) => record.suppilerBase.conractsPhone,
      },
      {
        title: '状态',
        dataIndex: 'hosptialState',
        key: 'hosptialState',
        render: (text, record) => {
          if (record.state === '0') {
            return <Tag color="pink">未审核</Tag>;
          }
          if (record.state === '1') {
            return <Tag color="green">审核通过</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="red">审核失败</Tag>;
          }
          if (record.state === '3') {
            return <Tag color="gray">已停用</Tag>;
          }
          return '-';
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => this.getButtons(record.state, record.applyId),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
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

export default HospitalApply;
