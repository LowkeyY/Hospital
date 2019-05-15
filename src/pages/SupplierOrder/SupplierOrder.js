import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SupplierOrder.less';
import OrderingModal from './components/OrderingModal';

@connect(({ loading, supplierOrder }) => ({
  supplierOrder,
  loading: loading.effects['supplierOrder/fetch'],
}))
class SupplierOrder extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      supplierOrder: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/Supplier-order',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierOrder/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handleGetOrderClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierOrder/fetchOrder',
      payload: {
        purchaseId: record.purchaseId,
      },
    });
  };

  render() {
    const {
      supplierOrder: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        render: (text, record) => record.hospitalBase.hospitalName,
      },
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

export default SupplierOrder;
