import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Select } from 'antd';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
class GoodsBoardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}

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
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="充值"
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        />
      </span>
    );
  }
}

export default Form.create()(GoodsBoardModal);
