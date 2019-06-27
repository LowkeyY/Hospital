import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import md5 from 'md5';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
class HospitalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/querySalesman',
    });
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
        const { userPwd } = values;
        const res = {
          ...values,
          userPwd: md5(userPwd),
        };
        onOk(res);
        form.resetFields();
        this.hideModelHandler();
      }
    });
  };

  render() {
    const {
      children,
      form,
      record,
      global: { salesman },
    } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { hospitalName = '', registCode = '', userName = '', userPwd = '' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.hospitalId ? '修改' : '新建'}医院`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="医院名称" hasFeedback>
              {getFieldDecorator('hospitalName', {
                initialValue: hospitalName,
                rules: [{ required: true, message: '医院名称不能为空' }],
              })(<Input />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="选择业务员" hasFeedback>
              {getFieldDecorator('slsmUserId', {
                initialValue: '',
                rules: [{ required: true, message: '请输入许可证号' }],
              })(
                <Select>
                  {salesman.map(item => (
                    <Select.Option value={item.userId}>{item.userRealName}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="用户名" hasFeedback>
              {getFieldDecorator('userName', {
                initialValue: userName,
                rules: [{ required: true, message: '用户名不能为空' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码" hasFeedback>
              {getFieldDecorator('userPwd', {
                initialValue: userPwd,
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(HospitalModal);
