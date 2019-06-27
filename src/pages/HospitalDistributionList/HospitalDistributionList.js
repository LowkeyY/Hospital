import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from './components/SearchForm';
import Department from '../../components/Lowkey/Department';
import styles from './HospitalDistributionList.less';
import OrderingModal from './components/OrderingModal';

@connect(({ loading, hospitalDistributionList }) => ({
  hospitalDistributionList,
  loading: loading.effects['hospitalDistributionList/fetch'],
}))
class HospitalDistributionList extends PureComponent {
  componentDidMount() {
    const deptType = localStorage.getItem('deptType');
    const {
      dispatch,
      hospitalDistributionList: { pageSize, deptId },
    } = this.props;
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalDistributionList/fetch',
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
      hospitalDistributionList: { deptId, pageSize },
    } = this.props;
    dispatch({
      type: 'hospitalDistributionList/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'hospitalDistributionList/fetch',
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
      hospitalDistributionList: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalDistributionList/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'hospitalDistributionList/fetch',
      payload: {
        nowPage: current,
        pageSize,
        deptId,
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

  hanlerReset = () => {
    const {
      dispatch,
      hospitalDistributionList: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalDistributionList/fetch',
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
      hospitalDistributionList: { pageSize, deptId },
    } = this.props;
    const {
      state = '',
      suppilerId = '',
      distributionId = '',
      beginDate = '',
      endDate = '',
    } = values;
    const res = {
      state: state === '' ? undefined : state,
      suppilerId: suppilerId === '' ? undefined : suppilerId,
      distributionId: distributionId === '' ? undefined : distributionId,
      endDate: endDate === '' ? undefined : endDate,
      beginDate: beginDate === '' ? undefined : beginDate,
      nowPage: 1,
      pageSize,
      deptId,
    };
    dispatch({
      type: 'hospitalDistributionList/fetch',
      payload: {
        ...res,
      },
    });
  };

  hanlerSelect = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalDistributionList/updateState',
      payload: {
        deptId: val,
      },
    });
    dispatch({
      type: `hospitalDistributionList/fetch`,
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
    const deptType = localStorage.getItem('deptType');
    const {
      hospitalDistributionList: { list, totalCount, nowPage, pageSize, deptId },
      loading,
    } = this.props;
    const columns = [
      {
        title: '配货单ID',
        dataIndex: 'distributionId',
        key: 'distributionId',
        fixed: 'left',
      },
      {
        title: '订货单ID',
        dataIndex: 'purchaseId',
        key: 'purchaseId',
        width: 80,
        fixed: 'left',
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        width: 160,
        fixed: 'left',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '科室',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '到货时间',
        dataIndex: 'arrivalTime',
        key: 'arrivalTime',
      },
      {
        title: '配货人',
        dataIndex: 'distributor',
        key: 'distributor',
      },
      {
        title: '电话',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: '订货时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '订货人',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
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
        fixed: 'right',
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

export default HospitalDistributionList;
