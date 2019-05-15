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
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getSupplier',
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

  okHandler = () => {
    const { onOk } = this.props;
    onOk();
  };

  renderGoods = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/updateState',
      payload: {
        suppilerId: val,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchGoods',
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
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
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
      },
    });
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
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '货品名称',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
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
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        render: (text, record) => (
          <InputNumber min={1} defaultValue={1} onChange={value => this.changeNum(value, record)} />
        ),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Button type="primary" onClick={() => this.handlerAddClick(record)}>
            添加
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
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form className={styles.form} horizontal onSubmit={this.okHandler}>
            <Form.Item {...formItemLayout} label="选择供应商">
              <div id="classifyArea" style={{ position: 'relative' }}>
                <Select
                  onSelect={val => this.renderGoods(val)}
                  getPopupContainer={() => document.getElementById('classifyArea')}
                >
                  {supplier.map(item => (
                    <Select.Option value={item.suppilerBase.suppilerId}>
                      {item.suppilerBase.suppilerName}
                    </Select.Option>
                  ))}
                </Select>
                ,
              </div>
            </Form.Item>
          </Form>
          <div className={styles.commonList}>
            <Table
              columns={columns}
              dataSource={goodsList}
              rowKey={record => record.id}
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
