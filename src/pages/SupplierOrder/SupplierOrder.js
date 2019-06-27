import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag, Icon, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchForm from './components/SearchForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SupplierOrder.less';
import OrderingModal from './components/OrderingModal';

@connect(({ loading, supplierOrder }) => ({
  supplierOrder,
  loading: loading.effects['supplierOrder/fetch'],
}))
class SupplierOrder extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      supplierOrder: { pageSize },
    } = this.props;
    dispatch({
      type: 'supplierOrder/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  }

  pageChangeHandler = page => {
    const {
      dispatch,
      supplierOrder: { pageSize },
    } = this.props;
    dispatch({
      type: 'supplierOrder/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'supplierOrder/fetch',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/updatePageSize',
      payload: {
        pageSize,
      },
    });
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

  hanlerReset = () => {
    const {
      dispatch,
      supplierOrder: { pageSize },
    } = this.props;
    dispatch({
      type: 'supplierOrder/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  };

  handlerSearch = values => {
    const { dispatch } = this.props;
    const {
      state = '',
      purchaseHospatisId = '',
      purchaseId,
      beginDate = '',
      endDate = '',
    } = values;
    const res = {
      state: state === '' ? undefined : state,
      purchaseHospatisId: purchaseHospatisId === '' ? undefined : purchaseHospatisId,
      purchaseId: purchaseId === '' ? undefined : purchaseId,
      endDate: endDate === '' ? undefined : endDate,
      beginDate: beginDate === '' ? undefined : beginDate,
      nowPage: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'supplierOrder/fetch',
      payload: {
        ...res,
      },
    });
  };

  hanlerCopy = purchaseId => {
    message.success(`已复制到剪切板：${purchaseId}`);
  };

  render() {
    const {
      supplierOrder: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '订货单ID',
        dataIndex: 'purchaseId',
        key: 'purchaseId',
        width: 80,
        fixed: 'left',
        render: (text, record) => (
          <CopyToClipboard text={record.purchaseId}>
            <a href="javascript:" onClick={() => this.hanlerCopy(record.purchaseId)}>
              {record.purchaseId}
            </a>
          </CopyToClipboard>
        ),
      },
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        width: 200,
        fixed: 'left',
        render: (text, record) => record.hospitalBase.hospitalName,
      },
      {
        title: '科室',
        dataIndex: 'deptName',
        key: 'deptName',
        fixed: 'left',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '订货时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
        width: 160,
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
        title: '备注',
        dataIndex: 'pruchaseInfo',
        key: 'pruchaseInfo',
        render: (text, record) => record.pruchaseInfo || '-',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
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
          <div className={styles.tableForm}>
            <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
          </div>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.id}
            loading={loading}
            pagination={false}
            onChange={this.pageChangeHandler}
            scroll={{ x: 1200 }}
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
