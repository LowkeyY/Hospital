import React, { Component } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';

const FormItem = Form.Item;

class TreeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    const {
      selectedKey,
      type = 'edit',
      record: { deptType },
    } = this.props;
    if (e) e.stopPropagation();
    if (selectedKey === '') {
      message.error('请选择一个部门');
    } else if (deptType !== '2' && type === 'create') {
      message.error('该部门下不能创建新部门');
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
    const { children, record, form, type = 'edit' } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { deptName = '', deptState = '1' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.menuId ? '修改' : '新建'}组织机构`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="名称" hasFeedback>
              {getFieldDecorator('deptName', {
                initialValue: type === 'create' ? '' : deptName,
                rules: [{ required: true, message: '请输入组织机构名称' }],
              })(<Input />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="状态">
              {getFieldDecorator('deptState', {
                initialValue: type === 'create' ? '1' : deptState,
              })(
                <Radio.Group>
                  <Radio value="0">停用</Radio>
                  <Radio value="1">启用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(TreeModal);
