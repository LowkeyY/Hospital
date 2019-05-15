import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class RoleModal extends Component {
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
    const { roleName = '', sortId = '' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.roleId ? '修改' : '新建'}角色`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="角色名称"
              placeholder="取一个角色名称吧"
              hasFeedback
            >
              {getFieldDecorator('roleName', {
                initialValue: roleName,
                rules: [{ required: true, message: '角色名称不能为空' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 8 }}
              label="顺序(选填)"
              placeholder="数字排序"
              hasFeedback
            >
              {getFieldDecorator('sortId', {
                initialValue: sortId,
                rules: [{ required: false, message: '只能输入数字' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(RoleModal);
