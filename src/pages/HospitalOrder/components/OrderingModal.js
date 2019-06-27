import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, Table, Pagination, Button, InputNumber } from 'antd';
import styles from './OrderingModal.less';

@connect(({ global, hospitalOrder, loading }) => ({
  global,
  hospitalOrder,
  goodsLoading: loading.effects['hospitalOrder/fetchGoods'],
}))
class OrderingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch({
      type: 'global/getSupplier',
      payload: {
        deptId,
      },
    });
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    // const { form } = this.props;
    // form.resetFields();
    this.setState({
      visible: false,
    });
  };

  renderGoods = val => {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updateState',
      payload: {
        suppilerId: val,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchGoods',
      payload: {
        deptId,
      },
    });
  };

  changeNum = (value, record) => {
    record.goodsNumber = value;
  };

  handlerAddClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/updateGoods',
      payload: {
        record,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalManage: { pageSize },
      hospitalOrder: { deptId, suppilerId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchGoods',
      payload: {
        nowPage: page,
        pageSize,
        deptId,
        suppilerId,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const {
      dispatch,
      hospitalOrder: { deptId, suppilerId },
    } = this.props;
    // dispatch({
    //   type: 'user/updatePageSize',
    //   payload: {
    //     pageSize,
    //   },
    // });
    dispatch({
      type: 'hospitalOrder/fetchGoods',
      payload: {
        nowPage: current,
        pageSize,
        deptId,
        suppilerId,
      },
    });
  };

  chickStatus = id => {
    const {
      hospitalOrder: { shopList },
    } = this.props;
    return shopList.find(item => item.goodsId === id);
  };

  render() {
    const {
      children,
      global: { supplier },
      hospitalOrder: { goodsList, totalCount, nowPage, pageSize },
      goodsLoading,
    } = this.props;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
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
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Button
            disabled={this.chickStatus(record.goodsId)}
            type="primary"
            onClick={() => this.handlerAddClick(record)}
          >
            {this.chickStatus(record.goodsId) ? '已添加' : '添加'}
          </Button>
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
          onCancel={this.hideModelHandler}
          footer={null}
        >
          <Form className={styles.form} horizontal>
            <Form.Item {...formItemLayout} label="选择供应商">
              <div id="classifyArea" style={{ position: 'relative' }}>
                <Select
                  onSelect={val => this.renderGoods(val)}
                  getPopupContainer={() => document.getElementById('classifyArea')}
                >
                  {supplier.map(item => (
                    <Select.Option key={item.suppilerId} value={item.suppilerBase.suppilerId}>
                      {item.suppilerBase.suppilerName}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Form.Item>
          </Form>
          <div className={styles.commonList}>
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
              current={nowPage * 1}
              pageSize={pageSize * 1}
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

export default OrderingModal;
