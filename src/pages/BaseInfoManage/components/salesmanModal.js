import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import { pattern } from '../../../utils/config';

const FormItem = Form.Item;

class SalesmanModal extends Component {
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
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const res = {
          ...values,
          userPwd: '123456',
        };
        onOk(res);
        form.resetFields();
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children, form, record } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { userRealName = '', userPhone = '', userSex = '0', userAge = '' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.userId ? '修改' : '添加'}业务员`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="真实姓名" hasFeedback>
              {getFieldDecorator('userRealName', {
                initialValue: userRealName,
                rules: [{ required: true, message: '请输入真实姓名' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号" hasFeedback>
              {getFieldDecorator('userPhone', {
                initialValue: userPhone,
                rules: [{ required: true, message: '手机号不能为空' }],
              })(<Input />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="性别">
              {getFieldDecorator('userSex', {
                initialValue: userSex,
              })(
                <Radio.Group>
                  <Radio value="0">男</Radio>
                  <Radio value="1">女</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="年龄" hasFeedback>
              {getFieldDecorator('userAge', {
                initialValue: userAge,
                rules: [{ pattern: pattern.number.pattern, message: pattern.number.message }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(SalesmanModal);
