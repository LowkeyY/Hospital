import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OrderingModal from './components/OrderingModal';
import styles from './BackstageDistribution.less';

@connect(({ loading, backstageDistribution }) => ({
  backstageDistribution,
  loading: loading.effects['backstageDistribution/fetch'],
}))
class BackstageDistribution extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      backstageDistribution: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/distribution-list',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backstageDistribution/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handleGetOrderClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backstageDistribution/fetchDetails',
      payload: {
        baseId: record.distributionId,
      },
    });
  };

  render() {
    const {
      backstageDistribution: { list, totalCount, nowPage, pageSize },
      loading,
      location,
    } = this.props;
    const { suppilerName } = location.query;
    const columns = [
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        render: (text, record) => record.hospitalBase.hospitalName,
      },
      {
        title: '科室',
        dataIndex: 'deptBase',
        key: 'deptBase',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '出单人',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '送货人',
        dataIndex: 'distributor',
        key: 'distributor',
      },
      {
        title: '送货人电话',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: '预计到达时间',
        dataIndex: 'arrivalTime',
        key: 'arrivalTime',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '1') {
            return <Tag color="gold">配货中</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="cyan">已入库</Tag>;
          }
          return '-';
        },
      },
      {
        title: '合计（元）',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <div>
            <OrderingModal record={record}>
              <Button type="primary" size="small" onClick={() => this.handleGetOrderClick(record)}>
                配货详情
              </Button>
            </OrderingModal>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title={suppilerName || ''}>
        <div className={styles.commonList}>
          <Table
            title={() => '配货单'}
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

export default BackstageDistribution;
