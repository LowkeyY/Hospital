import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Steps, Button, Alert, Radio } from 'antd';
import styles from './PayModal.less';

const { Step } = Steps;

@connect(({ hospitals, pay }) => ({
  hospitals,
  pay,
}))
class PayModal extends Component {
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
    dispatch({
      type: 'pay/updateState',
      payload: {
        currentPage: 0,
      },
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

  aliPayClick = html => {
    this.hideModelHandler();
    const newWindow = window.open(html, '_target');
    // newWindow.document.write('<!DOCTYPE html>');
    // newWindow.document.write('<html>');
    // newWindow.document.write('<head>');
    // newWindow.document.write('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
    // newWindow.document.write('</head>');
    // newWindow.document.write('<body>');
    // newWindow.document.write(html);
    // newWindow.document.write('</body></html>');
    // newWindow.document.charset='UTF-8';
    // newWindow.focus();
  };

  getChildren = (currentPage, html) => {
    const {
      hospitals: { payNumber },
    } = this.props;
    if (currentPage === 0) {
      return (
        <div>
          <Alert
            closable
            showIcon
            message="确认转账后，资金将直接打入对方账户，无法退回。"
            style={{ marginBottom: 24 }}
          />
          <div className={styles.money}>
            <span>缴费金额：</span>
            <span className={styles.num}>{`${payNumber}`}</span>
            <span>元</span>
          </div>
          <div className={styles.footer}>
            <Button onClick={this.hideModelHandler}>取消</Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.okHandler}>
              确定
            </Button>
          </div>
        </div>
      );
    }
    if (currentPage === 1) {
      return (
        <div>
          <Alert
            closable
            showIcon
            message="确认转账后，资金将直接打入对方账户，无法退回。"
            style={{ marginBottom: 24 }}
          />
          <div className={styles.method}>
            <Radio value={1} checked>
              <img src={require('../../../../public/alipay.png')} alt="" />
            </Radio>
          </div>
          <div>
            <div className={styles.footer}>
              <Button onClick={this.hideModelHandler}>取消</Button>
              <Button
                type="primary"
                style={{ marginLeft: '20px' }}
                onClick={() => this.aliPayClick(html)}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      children,
      pay: { html, currentPage },
    } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="充值"
          maskClosable={false}
          visible={visible}
          onCancel={this.hideModelHandler}
          footer={null}
        >
          <Fragment>
            <Steps current={currentPage} className={styles.steps}>
              <Step title="确定缴费" />
              <Step title="选择支付方式" />
            </Steps>
            <div>{this.getChildren(currentPage, html)}</div>
          </Fragment>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(PayModal);
