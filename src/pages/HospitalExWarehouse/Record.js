import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ExWarehouse.less';
import Modal from './components/Modal';

@connect(({ loading, exWarehousing }) => ({
  exWarehousing,
  loading: loading.effects['exWarehousing/fetch'],
}))
class Record extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      exWarehousing: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-ex-warehouse/record',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exWarehousing/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handleGetDetailsClick = record => {
    const { detailId = '' } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'exWarehousing/querySingleDetails',
      payload: {
        detailId,
      },
    });
  };

  render() {
    const {
      exWarehousing: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '出库人',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '出库时间',
        dataIndex: 'logDate',
        key: 'logDate',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <div>
            <Modal record={record}>
              <Button
                type="primary"
                size="small"
                onClick={() => this.handleGetDetailsClick(record)}
              >
                出库详情
              </Button>
            </Modal>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title=" 出库记录">
        <div className={styles.commonList}>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.logId}
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

export default Record;
