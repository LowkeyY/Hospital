import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './HospitalOrderRecord.less';
import OrderingModal from './components/OrderingModal';

@connect(({ loading, hospitalOrderRecord }) => ({
  hospitalOrderRecord,
  loading: loading.effects['hospitalOrderRecord/fetch'],
}))
class HospitalOrderRecord extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalOrderRecord: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-order-record',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handlerRecallClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/recall',
      payload: {
        purchaseId: record.purchaseId,
      },
    });
  };

  handleGetOrderClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/fetchOrder',
      payload: {
        purchaseId: record.purchaseId,
      },
    });
  };

  render() {
    const {
      hospitalOrderRecord: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '科室',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '下单时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '下单人',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '0') {
            return <Tag color="red">未配送</Tag>;
          }
          if (record.state === '1') {
            return <Tag color="green">已配送</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="gray">已退回</Tag>;
          }
          return '-';
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <div>
            <Popconfirm title="确定撤回订单吗？" onConfirm={() => this.handlerRecallClick(record)}>
              <Button type="primary" size="small" style={{ marginRight: '10px' }}>
                撤回
              </Button>
            </Popconfirm>
            <OrderingModal record={record}>
              <Button type="primary" size="small" onClick={() => this.handleGetOrderClick(record)}>
                货品详情
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

export default HospitalOrderRecord;
