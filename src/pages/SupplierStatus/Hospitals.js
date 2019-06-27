import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PayModal from './components/PayModal';
import SearchForm from './components/SearchForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Hospitals.less';
import ListModal from './components/ListModal';
import RecordModal from '../FinanceManage/components/RecordModal';

@connect(({ loading, hospitals }) => ({
  hospitals,
  loading: loading.effects['hospitals/fetch'],
}))
class Hospitals extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      hospitals: { pageSize },
    } = this.props;
    dispatch({
      type: 'hospitals/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  }

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitals: { pageSize },
    } = this.props;
    dispatch({
      type: 'hospitals/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'hospitals/fetch',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitals/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'hospitals/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  pay = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pay/alipay',
      payload: {
        applyId: id,
      },
    });
  };

  showReason = (reason = '未通过') => {
    Modal.warning({
      title: '由于以下原因本次审核未通过',
      content: reason,
    });
  };

  handlerPayClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitals/queryPayMoney',
    });
  };

  handlerGoDepartmentClick = record => {
    const { dispatch } = this.props;
    const {
      hospitalId = '',
      hospitalBase: { hospitalName = '' },
    } = record;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/Supplier-department',
        query: { hospitalId, hospitalName },
      })
    );
  };

  recordHandler = applyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitals/queryPayRecord',
      payload: {
        applyId,
      },
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      hospitals: { pageSize },
    } = this.props;
    dispatch({
      type: 'hospitals/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      hospitals: { pageSize },
    } = this.props;
    const { hospitalName = '' } = values;
    const res = {
      hospitalName: hospitalName === '' ? undefined : hospitalName,
      nowPage: 1,
      pageSize,
    };
    dispatch({
      type: 'hospitals/fetch',
      payload: {
        ...res,
      },
    });
  };

  render() {
    const {
      hospitals: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序列号',
        dataIndex: 'registCode',
        key: 'registCode',
        render: (text, record) => record.hospitalBase.registCode,
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
            return <Tag color="green">审核通过</Tag>;
          }
          if (record.state === '2') {
            return (
              <div>
                <Tag color="red">审核失败</Tag>
                <Tag color="cyan" onClick={() => this.showReason(record.reason)}>
                  查看原因
                </Tag>
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
        title: '我的科室',
        key: 'department',
        render: (text, record) => (
          <Button
            disabled={record.state !== '1'}
            type="primary"
            ghost
            size="small"
            onClick={() => this.handlerGoDepartmentClick(record)}
          >
            查看科室
          </Button>
        ),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <PayModal record={record} onOk={values => this.pay(record.applyId, values)}>
              <Button
                disabled={record.state !== '1'}
                type="primary"
                size="small"
                style={{ marginRight: '10px' }}
                ghost
                onClick={this.handlerPayClick}
              >
                充值
              </Button>
            </PayModal>
            <ListModal>
              <Button
                disabled={record.state !== '1'}
                type="primary"
                size="small"
                ghost
                onClick={() => this.recordHandler(record.applyId)}
              >
                充值记录
              </Button>
            </ListModal>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <div>
            <div className={styles.tableForm}>
              <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
            </div>
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

export default Hospitals;
