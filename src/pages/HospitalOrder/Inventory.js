import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Pagination } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './HospitalOrder.less';

@connect(({ loading, hospitalOrder }) => ({
  hospitalOrder,
  loading: loading.effects['hospitalOrder/fetchInventory'],
}))
class Inventory extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalOrder: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-order/inventory',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/fetchInventory',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { inventoryList, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        // render: (text, record) => (
        //   record.hospitalBase.hospitalName
        // ),
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
      },
      {
        title: '方法学',
        dataIndex: 'methodBase',
        key: 'methodBase',
        render: (text, record) => record.methodBase.methodName || '',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
    ];
    return (
      <div className={styles.commonList}>
        <Table
          columns={columns}
          dataSource={inventoryList}
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

export default Inventory;
