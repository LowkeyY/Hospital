import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Upload, Button, Icon, Divider, Select } from 'antd';
import md5 from 'md5';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
class SupplierModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      businessPic: [],
      medicalPic: [],
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
    const { businessPic, medicalPic } = this.state;
    form.validateFields((err, values) => {
      const res = {
        ...values,
        userPwd: md5(values.userPwd),
      };
      if (!err) {
        const formData = new FormData();
        Object.keys(res).map(key => formData.append(key, res[key]));
        businessPic.forEach(file => {
          formData.append('licensePhoto', file);
        });
        medicalPic.forEach(file => {
          formData.append('yiliaoPhoto', file);
        });
        onOk(formData);
        this.hideModelHandler();
        form.resetFields();
      }
    });
  };

  render() {
    const {
      children,
      form,
      title = '',
      global: { salesman },
    } = this.props;
    const { visible, businessPic, medicalPic } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };

    const businessProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.businessPic.indexOf(file);
          const newFileList = state.businessPic.slice();
          newFileList.splice(index, 1);
          return {
            businessPic: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          businessPic: [...state.businessPic, file],
        }));
        return false;
      },
      businessPic,
      listType: 'picture',
    };
    const medicalProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.medicalPic.indexOf(file);
          const newFileList = state.medicalPic.slice();
          newFileList.splice(index, 1);
          return {
            medicalPic: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          medicalPic: [...state.medicalPic, file],
        }));
        return false;
      },
      medicalPic,
      listType: 'picture',
    };
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={800}
          title={title}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Row justify="space-around">
            <Col span={12} offset={2}>
              <Form horizontal onSubmit={this.okHandler}>
                <FormItem {...formItemLayout} label="所在机构全称" hasFeedback>
                  {getFieldDecorator('suppilerName', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入所在机构' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="公司简称" hasFeedback>
                  {getFieldDecorator('suppilerShortName', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入公司简称' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="许可证号" hasFeedback>
                  {getFieldDecorator('suppilerLicense', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入许可证号' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="用户名" hasFeedback>
                  {getFieldDecorator('userName', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="密码" hasFeedback>
                  {getFieldDecorator('userPwd', {
                    initialValue: '',
                    rules: [{ required: false, message: '请输入密码' }],
                  })(<Input />)}
                </FormItem>
                <Form.Item {...formItemLayout} label="选择业务员">
                  <div id="salesmanArea" style={{ position: 'relative' }}>
                    {getFieldDecorator('slsmUserId', {
                      initialValue: '',
                      rules: [{ required: true, message: '请输入许可证号' }],
                    })(
                      <Select getPopupContainer={() => document.getElementById('salesmanArea')}>
                        {salesman.map(item => (
                          <Select.Option key={item.userId} value={item.userId}>
                            {item.userRealName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </Form.Item>
                <FormItem {...formItemLayout} label="联系人" hasFeedback>
                  {getFieldDecorator('conractsName', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入联系人' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人手机号" hasFeedback>
                  {getFieldDecorator('conractsPhone', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入联系人手机号' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系邮箱" hasFeedback>
                  {getFieldDecorator('conractsEmail', {
                    initialValue: '',
                    rules: [{ required: false, message: '请输入联系人邮箱' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系地址" hasFeedback>
                  {getFieldDecorator('conractsAddress', {
                    initialValue: '',
                    rules: [{ required: false, message: '请输入联系人手机号' }],
                  })(<Input />)}
                </FormItem>
              </Form>
            </Col>
            <Col span={8}>
              <div>
                <Divider orientation="left">营业执照(上传照片)</Divider>
                <Upload {...businessProps}>
                  <Button>
                    <Icon type="upload" />
                    上传
                  </Button>
                </Upload>
              </div>
              <div>
                <Divider orientation="left">医疗器械经营许可证</Divider>
                <Upload {...medicalProps}>
                  <Button>
                    <Icon type="upload" />
                    上传
                  </Button>
                </Upload>
              </div>
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(SupplierModal);
