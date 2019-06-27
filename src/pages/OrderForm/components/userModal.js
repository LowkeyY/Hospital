import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';
import md5 from 'md5';
import { connect } from 'dva';
import { pattern } from '../../../utils/config';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
class UserModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/queryRole',
    // });
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
      const { userPwd } = values;
      if (!err) {
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

  renderOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryRole',
    });
  };

  getChildren = arr => {
    const children = [];
    arr.map(item =>
      children.push(
        <Select.Option key={item.roleId} value={item.roleId}>
          {item.roleName}
        </Select.Option>
      )
    );
    return children;
  };

  render() {
    const {
      children,
      form,
      record,
      global: { role },
    } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const {
      userName = '',
      userRealName = '',
      userPhone = '',
      userPwd = '',
      userSex = '0',
      userAge = '',
      roleId = '',
    } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.userId ? '修改' : '添加'}人员`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="用户名" hasFeedback>
              {getFieldDecorator('userName', {
                initialValue: userName,
                rules: [{ required: true, message: '请输入用户名' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="真实姓名" hasFeedback>
              {getFieldDecorator('userRealName', {
                initialValue: userRealName,
                rules: [{ required: true, message: '请输入真实姓名' }],
              })(<Input />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="选择角色">
              <div id="roleArea" style={{ position: 'relative' }}>
                {getFieldDecorator('roleId', {
                  initialValue: roleId,
                  rules: [{ required: true, message: '请选择角色' }],
                })(
                  <Select
                    onDropdownVisibleChange={this.renderOption}
                    getPopupContainer={() => document.getElementById('roleArea')}
                  >
                    {this.getChildren(role)}
                  </Select>
                )}
              </div>
            </Form.Item>
            <FormItem {...formItemLayout} label="手机号" hasFeedback>
              {getFieldDecorator('userPhone', {
                initialValue: userPhone,
                rules: [{ required: true, message: '手机号不能为空' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码" hasFeedback>
              {getFieldDecorator('userPwd', {
                initialValue: userPwd,
                rules: [{ required: false, message: '请输入密码' }],
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

export default Form.create()(UserModal);
