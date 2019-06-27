import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { pattern } from '../../../utils/config';

const FormItem = Form.Item;

class MenuEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    const { selectedKey, type = 'edit' } = this.props;
    if (e) e.stopPropagation();
    if (selectedKey === '' && type === 'edit') {
      return false;
    } else {
      this.setState({
        visible: true,
      });
    }
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
        this.hideModelHandler();
        form.resetFields();
      }
    });
  };

  render() {
    const { children, record, form, selectedKey } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { menuName = '', menuEntrance = '', sort = '', menuIcon = '' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const IconPickerLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 3 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.menuId ? '修改' : '新建'}菜单`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="菜单名称" hasFeedback>
              {getFieldDecorator('menuName', {
                initialValue: menuName,
                rules: [{ required: true, message: '请输入菜单名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="路径" hasFeedback>
              {getFieldDecorator('menuEntrance', {
                initialValue: menuEntrance,
                rules: [{ required: true, message: '请输入路径' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 8 }}
              label="顺序(选填)"
              hasFeedback
            >
              {getFieldDecorator('sort', {
                initialValue: sort,
                rules: [{ pattern: pattern.number.pattern, message: pattern.number.message }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="图标(选填)">
              {/*<IconPicker />*/}
              {getFieldDecorator('menuIcon', {
                initialValue: menuIcon,
                rules: [{ required: false, message: '请输入路径' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(MenuEditModal);
