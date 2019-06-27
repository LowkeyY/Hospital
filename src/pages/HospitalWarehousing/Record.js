import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Warehousing.less';
import Modal from './components/Modal';

@connect(({ loading, warehousing }) => ({
  warehousing,
  loading: loading.effects['warehousing/fetch'],
}))
class Record extends PureComponent {
  componentDidMount() {}

  pageChangeHandler = page => {
    const {
      dispatch,
      warehousing: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-warehouseing/record',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'warehousing/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handleGetDetailsClick = record => {
    const { logType = '', distributionId = '' } = record;
    const { dispatch } = this.props;
    if (logType === '2') {
      dispatch({
        type: 'warehousing/fetchDetails',
        payload: {
          baseId: distributionId,
        },
      });
    } else if (logType === '1') {
      dispatch({
        type: 'warehousing/querySingleDetails',
        payload: {
          detailId: distributionId,
        },
      });
    }
  };

  render() {
    const {
      warehousing: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '入库人',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '入库时间',
        dataIndex: 'logDate',
        key: 'logDate',
      },
      {
        title: '操作类型',
        dataIndex: 'logType',
        key: 'logType',
        render: (text, record) => {
          if (record.logType === '1') {
            return <Tag color="cyan">单品入库</Tag>;
          }
          if (record.logType === '2') {
            return <Tag color="cyan">批量入库</Tag>;
          }
        },
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
                入库详情
              </Button>
            </Modal>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="入库记录">
        <div className={styles.commonList}>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.distributionId}
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
