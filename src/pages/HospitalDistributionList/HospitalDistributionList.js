import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './HospitalDistributionList.less';
import OrderingModal from './components/OrderingModal';

@connect(({ loading, hospitalDistributionList }) => ({
  hospitalDistributionList,
  loading: loading.effects['hospitalDistributionList/fetch'],
}))
class HospitalDistributionList extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalDistributionList: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-distribution-list',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalDistributionList/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handleGetOrderClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalDistributionList/fetchDetails',
      payload: {
        baseId: record.distributionId,
      },
    });
  };

  render() {
    const {
      hospitalDistributionList: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '订货时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '下单人',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '到货时间',
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
        title: '合计',
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

export default HospitalDistributionList;
