import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Button, Icon, Divider } from 'antd';

const FormItem = Form.Item;

class RechargeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      billPic: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
      billPic: [],
    });
  };

  hideModelHandler = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
      billPic: [],
    });
  };

  okHandler = id => {
    const { onOk, form } = this.props;
    const { billPic } = this.state;
    form.validateFields((err, values) => {
      const res = {
        applyId: id,
        ...values,
      };
      if (!err) {
        const formData = new FormData();
        Object.keys(res).map(key => formData.append(key, res[key]));
        billPic.forEach(file => {
          formData.append('voucherFile', file);
        });
        onOk(formData);
        this.hideModelHandler();
        form.resetFields();
      }
    });
  };

  render() {
    const { children, form, record } = this.props;
    const { visible, billPic } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 10 },
      },
    };

    const billProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.billPic.indexOf(file);
          const newFileList = state.billPic.slice();
          newFileList.splice(index, 1);
          return {
            billPic: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          billPic: [...state.billPic, file],
        }));
        return false;
      },
      listType: 'picture',
      fileList: billPic,
    };
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="充值"
          visible={visible}
          onOk={() => this.okHandler(record.applyId)}
          onCancel={this.hideModelHandler}
        >
          <Form {...formItemLayout} horizontal onSubmit={this.okHandler}>
            <FormItem label="充值金额" hasFeedback>
              {getFieldDecorator('investAmout', {
                initialValue: '',
                rules: [{ required: true, message: '请输入充值金额' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="充值数量（年）" hasFeedback>
              {getFieldDecorator('year', {
                initialValue: '',
                rules: [{ required: true, message: '请输入充值数量' }],
              })(<Input />)}
            </FormItem>
            <FormItem>
              <Divider orientation="left">转账回单</Divider>
              <Upload {...billProps}>
                <Button>
                  <Icon type="upload" />
                  上传
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(RechargeModal);
