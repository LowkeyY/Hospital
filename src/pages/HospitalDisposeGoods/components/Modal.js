import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
    dispatch({
      type: 'dispose/updateState',
      payload: {
        infos: {},
      },
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        form.resetFields();
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children, form, infos } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { inventoryValue = '', varningDate = '' } = infos;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${infos === {} ? '添加' : '修改'}库存配置`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="标准库存值" placeholder="请输入库存值" hasFeedback>
              {getFieldDecorator('inventoryValue', {
                initialValue: inventoryValue,
                rules: [{ required: false, message: '' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 8 }}
              label="效期预警(天)"
              placeholder="请输出天数"
              hasFeedback
            >
              {getFieldDecorator('varningDate', {
                initialValue: varningDate,
                rules: [{ required: false, message: '只能输入数字' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(Modals);
