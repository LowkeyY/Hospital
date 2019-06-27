import React, { PureComponent } from 'react';
import { Icon, Form, Modal, Input } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import md5 from 'md5';
import RightContent from './RightContent';

const FormItem = Form.Item;
@connect(({ global, loading }) => ({
  global,
  confirmLoading: loading.effects['global/editorPass'],
}))
@Form.create()
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  okHandler = () => {
    const { form, dispatch } = this.props;
    const userId = localStorage.getItem('userId');
    form.validateFields((err, values) => {
      const { userPwd } = values;
      if (!err) {
        const res = {
          userId,
          userPwd: md5(userPwd),
        };
        dispatch({
          type: 'global/editorPass',
          payload: res,
        });
        form.resetFields();
      }
    });
  };

  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/updateState',
      payload: {
        pwdVisble: false,
      },
    });
  };

  render() {
    const {
      collapsed,
      isMobile,
      logo,
      isDesktop = false,
      global: { pwdVisble },
      form,
      confirmLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        {!isDesktop ? (
          <span className={styles.trigger} onClick={this.toggle}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
        ) : (
          ''
        )}
        <RightContent {...this.props} />
        <Modal
          title="修改密码"
          visible={pwdVisble}
          onOk={this.okHandler}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <FormItem {...formItemLayout} label="密码" hasFeedback>
            {getFieldDecorator('userPwd', {
              initialValue: '',
              rules: [{ required: false, message: '请输入密码' }],
            })(<Input />)}
          </FormItem>
        </Modal>
      </div>
    );
  }
}
