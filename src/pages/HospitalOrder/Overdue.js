import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Pagination, Tag, Button, Modal } from 'antd';
import SearchForm from './components/SearchForm';
import ReportModal from './components/ReportModal';
import styles from './HospitalOrder.less';

@connect(({ loading, hospitalOrder }) => ({
  hospitalOrder,
  loading: loading.effects['hospitalOrder/fetchOverdue'],
}))
class Overdue extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    const deptType = localStorage.getItem('deptType');
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalOrder/fetchOverdue',
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
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchOverdue',
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
      hospitalOrder: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchOverdue',
      payload: {
        nowPage: current,
        pageSize,
        deptId,
      },
    });
  };

  handlerSubmit = (record, values) => {
    const {
      dispatch,
      hospitalOrder: { infos },
    } = this.props;
    if (infos === {}) {
      dispatch({
        type: 'hospitalOrder/addGoodsConfig',
        payload: {
          ...values,
          goodsId: record.goodsId,
          suppilerId: record.suppilerBase.suppilerId,
        },
      });
    } else {
      dispatch({
        type: 'hospitalOrder/updateCongif',
        payload: {
          ...values,
          goodsId: record.goodsId,
          configId: infos.configId,
          suppilerId: record.suppilerBase.suppilerId,
        },
      });
    }
  };

  handlerGetInfoClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/queryInfos',
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/fetchOverdue',
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
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    const { goodsName = '', suppilerId = '' } = values;
    const res = {
      goodsName: goodsName === '' ? undefined : goodsName,
      suppilerId: suppilerId === '' ? undefined : suppilerId,
      nowPage: 1,
      pageSize,
      deptId,
    };
    dispatch({
      type: 'hospitalOrder/fetchOverdue',
      payload: {
        ...res,
      },
    });
  };

  handlerReportClick = (detailId, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/report',
      payload: {
        detailId,
        ...values,
      },
    });
  };

  info = info => {
    Modal.info({
      title: '报损信息说明',
      content: (
        <div>
          <p>{info}</p>
        </div>
      ),
      onOk() {},
    });
  };

  render() {
    const {
      hospitalOrder: { overdueList, totalCount, nowPage, pageSize, infos },
      loading,
    } = this.props;
    const columns = [
      {
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 200,
        fixed: 'left',
        render: (text, record) => record.goodsBase.goodsNameCn,
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.goodsBase.methodBase.methodName,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        render: (text, record) => <span style={{ color: 'red' }}>{record.batchNumber}</span>,
      },
      // {
      //   title: '使用数量',
      //   dataIndex: 'usageNumber',
      //   key: 'usageNumber',
      // },
      {
        title: '剩余数量',
        dataIndex: 'surplusNumber',
        key: 'surplusNumber',
        render: (text, record) => <span style={{ color: 'red' }}>{record.surplusNumber}</span>,
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
      },
      {
        title: '报损状态',
        dataIndex: 'lossState',
        key: 'lossState',
        fixed: 'right',
        render: (text, record) => {
          if (record.lossState === '1') {
            return (
              <div>
                <Tag color="green">未报损</Tag>
                <ReportModal onOk={values => this.handlerReportClick(record.detailId, values)}>
                  <Tag color="gold">报损</Tag>
                </ReportModal>
              </div>
            );
          }
          if (record.lossState === '2') {
            return <Tag color="red">已报损</Tag>;
          }
          return (
            <div>
              <Tag color="green">未报损</Tag>
              <ReportModal onOk={values => this.handlerReportClick(record.detailId, values)}>
                <Tag color="gold">报损</Tag>
              </ReportModal>
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'order',
        fixed: 'right',
        render: (text, record) => (
          <Button type="primary" ghost size="small" onClick={() => this.info(record.lossInfo)}>
            报损说明
          </Button>
        ),
      },
    ];
    return (
      <div className={styles.commonList}>
        <div className={styles.tableForm}>
          <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
        </div>
        <Table
          columns={columns}
          dataSource={overdueList}
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
    );
  }
}

export default Overdue;
