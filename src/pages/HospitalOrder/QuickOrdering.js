import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, InputNumber, Empty, Modal, Form, DatePicker, Alert, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Ordering.less';

const FormItem = Form.Item;
moment.locale('zh-cn');

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const getShopList = arr => {
  const result = [];
  const obj = {};
  arr.map((item, i) => {
    if (!obj[item.goodsBase.suppilerId]) {
      result.push({
        suppilerId: item.goodsBase.suppilerId,
        suppilerName: item.goodsBase.suppilerBase.suppilerName,
        details: [{ ...item.goodsBase, ...item }],
      });
      obj[item.suppilerId] = item;
    } else {
      result.map((data, i) => {
        if (data.suppilerId === item.goodsBase.suppilerId) {
          data.details.push({ ...item.goodsBase, ...item });
        }
      });
    }
  });
  return result;
};

@connect(({ hospitalOrder, loading }) => ({
  hospitalOrder,
  loading: loading.effects['hospitalOrder/queryQuickList'],
}))
@Form.create()
class QuickOrdering extends PureComponent {
  state = { visible: false };

  componentDidMount() {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/queryQuickList',
      payload: {
        deptId,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
  };

  addOrder = () => {
    const {
      dispatch,
      form,
      hospitalOrder: { quickLhopList },
    } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      dispatch({
        type: 'hospitalOrder/addOrder',
        payload: {
          orderData: JSON.stringify(getShopList(quickLhopList)),
          arriveDate: values.arriveDate.format('YYYY-MM-DD'),
          pruchaseInfo: values.pruchaseInfo,
        },
      });
      form.resetFields();
      this.setState({
        visible: false,
      });
    });
  };

  renderDate = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form {...formItemLayout} style={{ marginTop: '20px' }} onSubmit={this.addOrder}>
        <FormItem label="到货时间">
          {getFieldDecorator('arriveDate', {
            initialValue: '',
            rules: [{ required: true, message: '请选择到货时间' }],
          })(<DatePicker />)}
        </FormItem>
        <FormItem label="备注" placeholder="请输入...">
          {getFieldDecorator('pruchaseInfo', {
            initialValue: '',
          })(<TextArea rows={4} />)}
        </FormItem>
      </Form>
    );
  };

  changeNum = (value, record) => {
    record.goodsNumber = value;
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/deleteQuickGoods',
      payload: {
        goodsId: id,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { quickLhopList },
      loading,
    } = this.props;
    console.log(quickLhopList);
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
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        render: (text, record) => (
          <InputNumber
            key={record.goodsId}
            min={1}
            defaultValue={record.goodsNumber}
            onChange={value => this.changeNum(value, record)}
          />
        ),
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Button type="primary" onClick={() => this.deleteItem(record.goodsId)}>
            删除
          </Button>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="一键补货">
        <div className={styles.commonList}>
          <div className={styles.buttonBox}>
            {quickLhopList.length > 0 ? (
              <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.showModal}>
                提交订单
              </Button>
            ) : null}
          </div>
          {quickLhopList.length > 0 ? (
            getShopList(quickLhopList).map(item => (
              <Table
                title={() => item.suppilerName}
                loading={loading}
                columns={columns}
                dataSource={item.details || []}
                rowKey={record => record.id}
                pagination={false}
              />
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="订单空空如也" />
          )}
        </div>
        <Modal
          title="提交订货单"
          visible={this.state.visible}
          onOk={this.addOrder}
          onCancel={this.handleCancel}
        >
          <Alert message="提交后不可修改" type="info" />
          {this.renderDate()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default QuickOrdering;
