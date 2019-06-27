import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Pagination } from 'antd';
import SearchForm from './components/SearchForm';
import styles from './HospitalOrder.less';

@connect(({ loading, hospitalOrder }) => ({
  hospitalOrder,
  loading: loading.effects['hospitalOrder/fetchShortage'],
}))
class Shortage extends PureComponent {
  componentDidMount() {
    const deptType = localStorage.getItem('deptType');
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalOrder/fetchShortage',
        payload: {
          deptId,
        },
      });
    }
  }

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
      hospitalOrder: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/fetchShortage',
      payload: {
        deptId,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    const { goodsName = '', suppilerId = '' } = values;
    const res = {
      surplusNumber: goodsName === '' ? undefined : goodsName,
      suppilerId: suppilerId === '' ? undefined : suppilerId,
      deptId,
    };
    dispatch({
      type: 'hospitalOrder/fetchShortage',
      payload: {
        ...res,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { shortageList },
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
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.goodsBase.methodBase.methodName,
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
        title: '标准库存值',
        dataIndex: 'inventoryValue',
        key: 'inventoryValue',
        render: (text, record) => (
          <span style={{ color: 'red' }}>{record.libraryConfig.inventoryValue}</span>
        ),
      },
      {
        title: '剩余数量',
        dataIndex: 'surplusNumber',
        key: 'surplusNumber',
        render: (text, record) => <span style={{ color: 'red' }}>{record.surplusNumber}</span>,
      },
      {
        title: '缺货数量',
        dataIndex: 'shortageNumber',
        key: 'shortageNumber',
        render: (text, record) => <span style={{ color: 'red' }}>{record.shortageNumber}</span>,
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
          dataSource={shortageList}
          rowKey={record => record.goodsId}
          loading={loading}
          pagination={false}
          scroll={{ x: 1300 }}
        />
      </div>
    );
  }
}

export default Shortage;
