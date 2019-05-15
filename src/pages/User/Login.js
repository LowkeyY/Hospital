import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Alert, Icon, Form, Input, Button } from 'antd';
import md5 from 'md5';
import styles from './Login.less';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
  state = {
    style: { fontSize: '18px', color: 'rgba(0,0,0,.25)' },
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { userName, userPwd } = values;
        dispatch({
          type: 'login/login',
          payload: {
            userName,
            userPwd: md5(userPwd),
          },
        });
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const { msg, status } = login;
    const { style } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          {status === 1002 && !submitting && this.renderMessage(msg)}
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" style={style} />}
                placeholder="用户名"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('userPwd', {
              rules: [{ required: false, message: '请输入密码' }],
            })(
              <Input.Password
                size="large"
                prefix={<Icon type="lock" style={style} />}
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Checkbox>记住密码</Checkbox>
            <Button loading={submitting} type="primary" size="large" block htmlType="submit">
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default LoginPage;
