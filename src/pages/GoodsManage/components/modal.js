import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { pattern } from '../../../utils/config';

const FormItem = Form.Item;

class GoodsModal extends Component {
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
    const { dirName = '', remark = '', sort = '', update = false } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.dirId ? '修改' : '新建'}货品分类`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="货品分类" placeholder="填写一个分类" hasFeedback>
              {getFieldDecorator('dirName', {
                initialValue: dirName,
                rules: [{ required: true, message: '货品分类不能为空' }],
              })(<Input disabled={!update && record.dirId} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="说明(选填)" placeholder="填写说明" hasFeedback>
              {getFieldDecorator('remark', {
                initialValue: remark,
                rules: [{ required: false, message: '说明不能为空' }],
              })(<Input />)}
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

export default Form.create()(GoodsModal);
