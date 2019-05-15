import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Pagination, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Departments.less';

@connect(({ loading, departments }) => ({
  departments,
  loading: loading.effects['departments/fetch'],
}))
class Departments extends PureComponent {
  componentDidMount() {}

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departments/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departments/editor',
      payload: {
        ...values,
        goodsId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      departments: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/goods-board',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departments/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  render() {
    const {
      departments: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '科室',
        dataIndex: 'dirBase',
        key: 'dirBase',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '到期时间',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '0') {
            return <Tag color="pink">未审核</Tag>;
          }
          if (record.state === '1') {
            return <Tag color="green">审核通过</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="green">审核失败</Tag>;
          }
          if (record.state === '3') {
            return <Tag color="gray">已停用</Tag>;
          }
          return '-';
        },
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

export default Departments;
