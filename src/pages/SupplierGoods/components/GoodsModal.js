import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Pagination, Popconfirm, Button, InputNumber, Form } from 'antd';
import SearchForm from './SearchForm';
import styles from '../SupplierGoods.less';

@connect(({ supplierGoods, loading }) => ({
  supplierGoods,
  goodsLoading: loading.effects['supplierGoods/fetchGoods'],
  addLoading: loading.effects['supplierGoods/addGoods'],
}))
@Form.create()
class GoodsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = deptId => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'supplierGoods/fetch',
      payload: { deptId },
    });
    this.setState({
      visible: false,
    });
  };

  changeNum = (value, record) => {
    const { dispatch } = this.props;
    const { goodsId } = record;
    dispatch({
      type: 'supplierGoods/updateRow',
      payload: {
        price: value,
        goodsId,
      },
    });
  };

  handlerAddClick = (record, deptId) => {
    const { dispatch } = this.props;
    const { price = 0, goodsId = '' } = record;
    dispatch({
      type: 'supplierGoods/addGoods',
      payload: {
        unitPrice: price,
        goodsId,
        deptId,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      deptId,
      supplierGoods: { goodsNowPage },
    } = this.props;
    dispatch({
      type: 'supplierGoods/updateGoodsNowPage',
      payload: {
        goodsNowPage: page,
      },
    });
    dispatch({
      type: 'supplierGoods/fetchGoods',
      payload: {
        nowPage: page,
        pageSize: goodsNowPage,
        deptId,
      },
    });
  };

  onShowSizeChange = (current, goodsNowPage) => {
    const { dispatch, deptId } = this.props;
    dispatch({
      type: 'supplierGoods/updateGoodsPageSize',
      payload: {
        goodsPageSize: goodsNowPage,
      },
    });
    dispatch({
      type: 'supplierGoods/fetchGoods',
      payload: {
        nowPage: current,
        pageSize: goodsNowPage,
        deptId,
      },
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      supplierGoods: { goodsPageSize, deptId },
    } = this.props;
    dispatch({
      type: 'supplierGoods/fetchGoods',
      payload: {
        nowPage: 1,
        pageSize: goodsPageSize,
        deptId,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      supplierGoods: { goodsPageSize, deptId },
    } = this.props;
    const { goodsNameCn = '', manufacturer = '', methodId = '' } = values;
    const res = {
      manufacturer: manufacturer === '' ? undefined : manufacturer,
      goodsNameCn: goodsNameCn === '' ? undefined : goodsNameCn,
      methodId: methodId === '' ? undefined : methodId,
      nowPage: 1,
      pageSize: goodsPageSize,
      deptId,
    };
    dispatch({
      type: 'supplierGoods/fetchGoods',
      payload: {
        ...res,
      },
    });
  };

  render() {
    const {
      children,
      deptId,
      supplierGoods: { goodsList, totalCount, goodsNowPage, goodsPageSize },
      goodsLoading,
      addLoading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '货品名称',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
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
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.methodBase.methodName,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: '8%',
        editable: true,
        render: (text, record) => (
          <InputNumber
            defaultValue={0}
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={val => this.changeNum(val, record)}
          />
        ),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Popconfirm
            title="确定添加该货品?"
            onConfirm={() => this.handlerAddClick(record, deptId)}
          >
            <Button disabled={!record.price} loading={addLoading} type="primary">
              添加
            </Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="添加货品"
          width="80%"
          visible={visible}
          onCancel={() => this.hideModelHandler(deptId)}
          footer={null}
        >
          <div className={styles.commonList}>
            <div className={styles.tableForm}>
              <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
            </div>
            <Table
              columns={columns}
              dataSource={goodsList}
              rowKey={record => record.goodsId}
              loading={goodsLoading}
              pagination={false}
              onChange={this.pageChangeHandler}
            />
            <Pagination
              className="ant-table-pagination"
              total={totalCount * 1}
              current={goodsNowPage * 1}
              pageSize={goodsPageSize * 1}
              onChange={this.pageChangeHandler}
              showSizeChanger
              onShowSizeChange={this.onShowSizeChange}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default GoodsModal;
