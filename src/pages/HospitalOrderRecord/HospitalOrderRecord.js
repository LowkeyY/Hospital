import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag, Popconfirm } from 'antd';
import SearchForm from './components/SearchForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Department from '../../components/Lowkey/Department';
import styles from './HospitalOrderRecord.less';
import OrderingModal from './components/OrderingModal';

@connect(({ loading, hospitalOrderRecord }) => ({
  hospitalOrderRecord,
  loading: loading.effects['hospitalOrderRecord/fetch'],
}))
class HospitalOrderRecord extends PureComponent {
  componentDidMount() {
    const deptType = localStorage.getItem('deptType');
    const {
      dispatch,
      hospitalOrderRecord: { pageSize, deptId },
    } = this.props;
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalOrderRecord/fetch',
        payload: {
          nowPage: 1,
          pageSize,
          deptId,
        },
      });
    }
  }

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalOrderRecord: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'hospitalOrderRecord/fetch',
      payload: {
        nowPage: page,
        pageSize,
        deptId,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const {
      dispatch,
      hospitalOrderRecord: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'hospitalOrderRecord/fetch',
      payload: {
        nowPage: current,
        pageSize,
        deptId,
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

  hanlerReset = () => {
    const {
      dispatch,
      hospitalOrderRecord: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/fetch',
      payload: {
        nowPage: 1,
        pageSize,
        deptId,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      hospitalOrderRecord: { pageSize, deptId },
    } = this.props;
    const {
      state = '',
      purchaseSuppilerId = '',
      purchaseId = '',
      beginDate = '',
      endDate = '',
    } = values;
    const res = {
      state: state === '' ? undefined : state,
      purchaseSuppilerId: purchaseSuppilerId === '' ? undefined : purchaseSuppilerId,
      purchaseId: purchaseId === '' ? undefined : purchaseId,
      endDate: endDate === '' ? undefined : endDate,
      beginDate: beginDate === '' ? undefined : beginDate,
      nowPage: 1,
      pageSize,
      deptId,
    };
    dispatch({
      type: 'hospitalOrderRecord/fetch',
      payload: {
        ...res,
      },
    });
  };

  hanlerSelect = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrderRecord/updateState',
      payload: {
        deptId: val,
      },
    });
    dispatch({
      type: `hospitalOrderRecord/fetch`,
      payload: {
        nowPage: 1,
        pageSize: 10,
        deptId: val,
      },
    });
    dispatch({
      type: 'global/getSupplier',
      payload: { deptId: val },
    });
  };

  render() {
    const {
      hospitalOrderRecord: { list, totalCount, nowPage, pageSize, deptId },
      loading,
    } = this.props;
    const deptType = localStorage.getItem('deptType');
    const columns = [
      {
        title: '订货单ID',
        dataIndex: 'purchaseId',
        key: 'purchaseId',
        width: 80,
        fixed: 'left',
      },
      {
        title: '科室',
        dataIndex: 'deptName',
        key: 'deptName',
        fixed: 'left',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        width: 200,
        fixed: 'left',
        render: (text, record) => record.suppilerBase && record.suppilerBase.suppilerName,
      },
      {
        title: '订货时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '到货时间',
        dataIndex: 'arriveDate',
        key: 'arriveDate',
      },
      {
        title: '下单人',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '备注',
        dataIndex: 'pruchaseInfo',
        key: 'pruchaseInfo',
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
        fixed: 'right',
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
      <PageHeaderWrapper
        content={
          deptType === '2' ? <Department deptId={deptId} onSelect={this.hanlerSelect} /> : null
        }
      >
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
            scroll={{ x: 1300 }}
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
