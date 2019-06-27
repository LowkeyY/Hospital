import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
moment.locale('zh-cn');

class EditorModal extends Component {
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
    const { batchNumber, sterilizationDate, termOfValidity } = record;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="修改"
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form {...formItemLayout} horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="批号" hasFeedback>
              {getFieldDecorator('batchNumber', {
                initialValue: batchNumber,
                rules: [{ required: true, message: '请输入批号' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="有效期" hasFeedback>
              {getFieldDecorator('termOfValidity', {
                initialValue: termOfValidity ? moment(termOfValidity, dateFormat) : '',
                rules: [{ required: true, message: '请选择到有效期' }],
              })(<DatePicker format={dateFormat} />)}
            </FormItem>
            <FormItem label="灭菌日期" hasFeedback>
              {getFieldDecorator('sterilizationDate', {
                initialValue: sterilizationDate ? moment(sterilizationDate, dateFormat) : '',
                rules: [{ required: true, message: '请选择灭菌日期' }],
              })(<DatePicker format={dateFormat} />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(EditorModal);
