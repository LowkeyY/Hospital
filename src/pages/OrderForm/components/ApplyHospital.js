import React, { Component } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import Result from '@/components/Result';
import styles from '../../List/BasicList.less';

const FormItem = Form.Item;

class ApplyHospital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    console.log(this.props);
    dispatch({
      type: 'orderForm/updateState',
      payload: {
        done: false,
      },
    });
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
      }
    });
  };

  getModalContent = () => {
    const {
      form: { getFieldDecorator },
      done,
    } = this.props;
    if (done) {
      return (
        <Result
          type="success"
          title="申请成功"
          description="请耐心等待审核结果。"
          actions={
            <Button type="primary" onClick={this.hideModelHandler}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    return (
      <Form horizontal onSubmit={this.okHandler}>
        <FormItem {...this.formLayout} label="邀请码" hasFeedback>
          {getFieldDecorator('applyCode', {
            initialValue: '',
            rules: [{ required: true, message: '请输入医院邀请码' }],
          })(<Input />)}
        </FormItem>
      </Form>
    );
  };

  render() {
    const { children, done } = this.props;
    const { visible } = this.state;
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.okHandler, onCancel: this.hideModelHandler };
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal title="申请医院" visible={visible} {...modalFooter}>
          {this.getModalContent()}
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ApplyHospital);
