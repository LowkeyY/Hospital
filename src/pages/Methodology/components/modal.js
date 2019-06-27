import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { pattern } from '../../../utils/config';

const FormItem = Form.Item;

class MethodologyModal extends Component {
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
        onOk(values);
        form.resetFields();
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children, form, record } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { methodName = '', sort = '', update = false } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.methodId ? '修改' : '新建'}方法学`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="方法学" placeholder="填写一个方法学" hasFeedback>
              {getFieldDecorator('methodName', {
                initialValue: methodName,
                rules: [{ required: true, message: '方法学不能为空' }],
              })(<Input disabled={!update && record.methodId} />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 8 }}
              label="顺序(选填)"
              placeholder="数字排序"
              hasFeedback
            >
              {getFieldDecorator('sort', {
                initialValue: sort,
                rules: [{ pattern: pattern.number.pattern, message: pattern.number.message }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(MethodologyModal);
