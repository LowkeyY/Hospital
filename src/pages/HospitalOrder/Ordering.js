import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, InputNumber, Empty, Form, Modal, DatePicker, Alert, Input } from 'antd';
import moment from 'moment';
import OrderingModal from './components/OrderingModal';
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
    if (!obj[item.suppilerId]) {
      result.push({
        suppilerId: item.suppilerId,
        suppilerName: item.suppilerBase.suppilerName,
        details: [item],
      });
      obj[item.suppilerId] = item;
    } else {
      result.map((data, i) => {
        if (data.suppilerId === item.suppilerId) {
          data.details.push(item);
        }
      });
    }
  });
  return result;
};

@connect(({ hospitalOrder, loading }) => ({
  hospitalOrder,
  loading,
}))
@Form.create()
class Ordering extends PureComponent {
  state = { visible: false };

  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const {
      hospitalOrder: { shopList },
    } = this.props;
    if (nextProps.hospitalOrder.shopList !== shopList) {
      localStorage.setItem(
        `shop${localStorage.getItem('userId')}`,
        JSON.stringify(nextProps.hospitalOrder.shopList)
      );
    }
  }

  showModal = () => {
    const { form } = this.props;
    const validates = Object.keys(form.getFieldsValue()).filter(item => item.match('goodsNumber'));
    form.validateFields(validates, error => {
      if (error) {
        return;
      }
      this.setState({
        visible: true,
      });
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  addOrder = () => {
    const {
      dispatch,
      form,
      hospitalOrder: { shopList, deptId },
    } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      dispatch({
        type: 'hospitalOrder/addOrder',
        payload: {
          orderData: JSON.stringify(getShopList(shopList)),
          arriveDate: values.arriveDate.format('YYYY-MM-DD'),
          pruchaseInfo: values.pruchaseInfo,
          deptId,
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

  handlerOkClick = () => {
    const {
      hospitalOrder: { shopList },
    } = this.props;
    localStorage.setItem(`shop${localStorage.getItem('userId')}`, JSON.stringify(shopList));
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalOrder/deleteGoods',
      payload: {
        goodsId: id,
      },
    });
  };

  render() {
    const {
      hospitalOrder: { shopList, deptId },
    } = this.props;
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
        render: (text, record) => {
          const { form } = this.props;
          const { getFieldDecorator } = form;
          return (
            <Form className={styles.form}>
              <FormItem>
                {getFieldDecorator(`goodsNumber_${record.goodsId}`, {
                  initialValue: '',
                  rules: [
                    { required: true, message: '数量必须输入' },
                    { pattern: /^(?!00)(?:[0-9]{1,3}|1000)$/, message: '数量不能大于1000' },
                  ],
                })(
                  <InputNumber
                    key={record.goodsId}
                    min={1}
                    onChange={value => this.changeNum(value, record)}
                  />
                )}
              </FormItem>
            </Form>
          );
        },
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
      <PageHeaderWrapper title="订货">
        <div className={styles.commonList}>
          <div className={styles.buttonBox}>
            <OrderingModal onOk={this.handlerOkClick} deptId={deptId}>
              <Button type="primary" style={{ marginBottom: '10px' }}>
                添加货品
              </Button>
            </OrderingModal>
            {shopList.length > 0 ? (
              <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.showModal}>
                提交订单
              </Button>
            ) : null}
          </div>
          {shopList.length > 0 ? (
            getShopList(shopList).map(item => (
              <Table
                title={() => item.suppilerName}
                columns={columns}
                dataSource={item.details || []}
                rowKey={record => record.goodsId}
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

export default Ordering;
