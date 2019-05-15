import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import GoodsBoardModal from './components/GoodsBoardModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Hospitals.less';

@connect(({ loading, hospitals }) => ({
  hospitals,
  loading: loading.effects['hospitals/fetch'],
}))
class Hospitals extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitals: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/goods-board',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        nowPage: current,
        pageSize,
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
            return <Tag color="green">审核失败</Tag>;
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
            <GoodsBoardModal
              record={record}
              onOk={values => this.editHandler(record.goodsId, values)}
            >
              <Button type="primary" style={{ marginBottom: '10px' }}>
                充值
              </Button>
            </GoodsBoardModal>
          </span>
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

export default Hospitals;
