import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Tag, Popconfirm, Statistic } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchSalesman from './components/SearchSalesman';
import styles from './index.less';

@connect(({ loading, financeManage }) => ({
  financeManage,
  loading: loading.effects['financeManage/fetchRecharge'],
}))
class SalesmanBill extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeManage/fetchRecharge',
    });
  }

  hanlerReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeManage/fetchRecharge',
    });
  };

  handlerSearch = values => {
    const { dispatch } = this.props;
    const {
      deductState = '',
      deductUser = '',
      suppilerId = '',
      queryBeginDate = '',
      queryEndDate = '',
    } = values;
    const res = {
      deductState: deductState === '' ? undefined : deductState,
      deductUser: deductUser === '' ? undefined : deductUser,
      deductSuppilerId: suppilerId === '' ? undefined : suppilerId,
      queryEndDate: queryEndDate === '' ? undefined : queryEndDate,
      queryBeginDate: queryBeginDate === '' ? undefined : queryBeginDate,
    };
    dispatch({
      type: 'financeManage/fetchRecharge',
      payload: {
        ...res,
      },
    });
  };

  handlerRecharge = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeManage/doRecharge',
      payload: {
        deductId: id,
      },
    });
  };

  getTotal = (arr, state) => {
    let sum = 0;
    arr.map(item => {
      if (item.deductState === state) {
        sum += item.deductPrice || 0;
      }
    });
    return sum;
  };

  getExtra = arr => {
    return (
      <div className={styles.Extra}>
        <div />
        <div className={styles.total}>
          <Statistic
            style={{ marginRight: '40px' }}
            title="充值总流水(元)"
            value={this.getTotal(arr, '0') + this.getTotal(arr, '1')}
          />
          <Statistic
            style={{ marginRight: '20px' }}
            title="未提成金额(元)"
            value={this.getTotal(arr, '0')}
          />
          <Statistic title="已提成金额(元)" value={this.getTotal(arr, '1')} />
        </div>
      </div>
    );
  };

  render() {
    const {
      financeManage: { rechargeList },
      loading,
    } = this.props;
    const columns = [
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        width: 200,
        fixed: 'left',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '充值金额',
        dataIndex: 'investAmount',
        key: 'investAmount',
      },
      {
        title: '充值时间',
        dataIndex: 'creatDate',
        key: 'creatDate',
      },
      {
        title: '充值类型',
        dataIndex: 'investType',
        key: 'investType',
        render: (text, record) => {
          if (record.investType === '1') {
            return <Tag color="green">支付宝</Tag>;
          }
          if (record.investType === '2') {
            return <Tag color="green">后台充值</Tag>;
          }
          return '-';
        },
      },
      {
        title: '业务员',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.deductUserBase.userRealName || '',
      },
      {
        title: '提成百分比',
        dataIndex: 'slsDeduct',
        key: 'slsDeduct',
      },
      {
        title: '提成金额',
        dataIndex: 'deductPrice',
        key: 'deductPrice',
      },
      {
        title: '提成用户',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.operUserBase && record.operUserBase.userRealName,
      },
      {
        title: '提成时间',
        dataIndex: 'deductDate',
        key: 'deductDate',
      },
      {
        title: '状态',
        dataIndex: 'deductState',
        key: 'deductState',
        render: (text, record) => {
          if (record.deductState === '0') {
            return <Tag color="pink">未提成</Tag>;
          }
          if (record.deductState === '1') {
            return <Tag color="green">已提成</Tag>;
          }
          return '-';
        },
      },
      {
        title: '提成',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => (
          <Popconfirm title="确定提成?" onConfirm={() => this.handlerRecharge(record.deductId)}>
            <Button
              disabled={record.deductState === '1'}
              style={{ marginRight: '10px' }}
              type="primary"
              ghost
              size="small"
            >
              提成
            </Button>
          </Popconfirm>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title={this.getExtra(rechargeList)}>
        <div className={styles.commonList}>
          <div className={styles.tableForm}>
            <SearchSalesman onOk={this.handlerSearch} onReset={this.hanlerReset} />
          </div>
          <Table
            columns={columns}
            dataSource={rechargeList}
            rowKey={record => record.deductId}
            loading={loading}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SalesmanBill;
