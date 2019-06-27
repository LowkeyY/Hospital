import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Pagination } from 'antd';
import { duringDay } from '@/utils/utils';
import SearchForm from './components/SearchForm';
import styles from './HospitalOrder.less';

@connect(({ loading, hospitalOrder }) => ({
  hospitalOrder,
  loading: loading.effects['hospitalOrder/fetchEarlyWarning'],
}))
class Inventory extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      hospitalOrder: { pageSize, deptId },
    } = this.props;
    const deptType = localStorage.getItem('deptType');
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalOrder/fetchEarlyWarning',
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
      type: 'hospitalOrder/fetchEarlyWarning',
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
      type: 'hospitalOrder/fetchEarlyWarning',
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
      type: 'hospitalOrder/fetchEarlyWarning',
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
      type: 'hospitalOrder/fetchEarlyWarning',
      payload: {
        ...res,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { earlyWarningList, totalCount, nowPage, pageSize, infos },
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
        title: '库存数量',
        dataIndex: 'surplusNumber',
        key: 'surplusNumber',
        render: (text, record) => <span style={{ color: 'red' }}>{record.surplusNumber}</span>,
      },
      {
        title: '剩余时间',
        dataIndex: 'times',
        key: 'times',
        render: (text, record) => (
          <span style={{ color: 'red' }}>{duringDay(record.termOfValidity)}</span>
        ),
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
        render: (text, record) => <span style={{ color: 'red' }}>{record.termOfValidity}</span>,
      },
      // {
      //   title: '操作',
      //   key: 'order',
      //   render: (text, record) => (
      //     <Modal record={record} infos={infos} onOk={values => this.handlerSubmit(record, values)}>
      //       <Button size="small" onClick={() => this.handlerGetInfoClick()}>
      //         库存配置
      //       </Button>
      //     </Modal>
      //   ),
      // },
    ];
    return (
      <div className={styles.commonList}>
        <div className={styles.tableForm}>
          <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
        </div>
        <Table
          columns={columns}
          dataSource={earlyWarningList}
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

export default Inventory;
