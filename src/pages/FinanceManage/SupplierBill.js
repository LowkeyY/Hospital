import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from './components/SearchForm';
import moment from 'moment';
import styles from './index.less';
import RechargeModal from './components/RechargeModal';
import RecordModal from './components/RecordModal';

@connect(({ loading, financeManage }) => ({
  financeManage,
  loading: loading.effects['financeManage/fetch'],
}))
class SupplierBill extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      financeManage: { pageSize },
    } = this.props;
    dispatch({
      type: 'financeManage/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  }

  pageChangeHandler = page => {
    const {
      dispatch,
      financeManage: { pageSize },
    } = this.props;
    dispatch({
      type: 'financeManage/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'financeManage/fetch',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeManage/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'financeManage/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      financeManage: { pageSize },
    } = this.props;
    dispatch({
      type: 'financeManage/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      financeManage: { pageSize },
    } = this.props;
    const { suppilerId = '', hospitalId = '', sState = '' } = values;
    const res = {
      sState: sState === '' ? undefined : sState,
      suppilerId: suppilerId === '' ? undefined : suppilerId,
      hospitalId: hospitalId === '' ? undefined : hospitalId,
      nowPage: 1,
      pageSize,
    };
    dispatch({
      type: 'financeManage/fetch',
      payload: {
        ...res,
      },
    });
  };

  rechargeHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeManage/recharge',
      payload: values,
    });
  };

  recordHandler = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeManage/queryPayRecord',
      payload: {
        applyId: id,
      },
    });
  };

  render() {
    const {
      financeManage: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName || '',
      },
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        render: (text, record) => record.hospitalBase.hospitalName,
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
            if (moment(record.endDate).isBefore(moment().format('YYYY-MM-DD HH:mm:ss'))) {
              return <Tag color="red">过期</Tag>;
            }
            return <Tag color="green">正常</Tag>;
          }
          if (record.state === '2') {
            return (
              <div>
                <Tag color="red">审核失败</Tag>
                {/*<Tag color="cyan" onClick={() => this.showReason(record.reason)}>查看原因</Tag>*/}
              </div>
            );
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
        render: (text, record) => (
          <span className={styles.operation}>
            <RechargeModal record={record} onOk={this.rechargeHandler}>
              <Button style={{ marginRight: '10px' }} type="primary" ghost size="small">
                充值
              </Button>
            </RechargeModal>
            <RecordModal record={record}>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => this.recordHandler(record.applyId)}
              >
                充值记录
              </Button>
            </RecordModal>
          </span>
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

export default SupplierBill;
