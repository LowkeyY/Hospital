import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Upload, Button, Icon, Divider, Row, Col, message } from 'antd';
import { baseUrl } from '@/utils/config';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SupplierAccount.less';

const FormItem = Form.Item;

@connect(({ loading, supplierAccount }) => ({
  supplierAccount,
  loading: loading.effects['supplierAccount/editor'],
}))
@Form.create()
class SupplierAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessPic: [],
      medicalPic: [],
      disabled: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'supplierAccount/fetch' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.supplierAccount.isEditor === true) {
      this.setState({
        disabled: true,
        businessPic: [],
        medicalPic: [],
      });
    }
  }

  componentDidUpdate() {}

  getPath = arr => {
    const newArr = [];
    if (arr.length > 0) {
      arr.map(item =>
        newArr.push({
          ...item,
          url: `${baseUrl}${item.url}`,
        })
      );
      return newArr;
    } else {
      return [];
    }
  };

  editHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAccount/editor',
      payload: values,
    });
  };

  handlerEditor = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAccount/updateState',
      payload: {
        isEditor: false,
      },
    });

    this.setState({
      disabled: false,
    });
  };

  handlerCancel = () => {
    window.location.reload();
    this.setState({
      disabled: true,
    });
  };

  handlerSubmit = () => {
    const {
      form,
      supplierAccount: {
        data: { suppilerId },
        defaultBusiness,
        defaultMedical,
      },
    } = this.props;
    const { businessPic, medicalPic } = this.state;
    const getString = arr => {
      const newArr = [];
      arr.map(item => newArr.push(item.url));
      return newArr.join(',');
    };
    form.validateFields((err, values) => {
      const res = {
        ...values,
        suppilerId,
        licensePhotoPath: getString(defaultBusiness) || '',
        yiliaoPhotoPath: getString(defaultMedical) || '',
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
        this.editHandler(formData);
      }
    });
  };

  render() {
    const {
      form,
      supplierAccount: { data, defaultBusiness, defaultMedical },
      loading,
    } = this.props;
    const { businessPic, medicalPic, disabled } = this.state;
    const { getFieldDecorator } = form;
    const {
      suppilerName = '',
      suppilerShortName = '',
      suppilerLicense = '',
      conractsName = '',
      conractsPhone = '',
      conractsEmail = '',
      conractsAddress = '',
    } = data;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 6,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    };

    const businessProps = {
      onRemove: file => {
        if (this.state.disabled) {
          message.error('请先点击修改按钮');
        } else {
          this.props.dispatch({
            type: 'supplierAccount/updateState',
            payload: {
              defaultBusiness: defaultBusiness.filter(item => item.uid !== file.uid),
            },
          });
          this.setState(state => {
            const index = state.businessPic.indexOf(file);
            const newFileList = state.businessPic.slice();
            newFileList.splice(index, 1);
            return {
              businessPic: newFileList,
            };
          });
        }
      },
      beforeUpload: file => {
        this.setState(state => ({
          businessPic: [...state.businessPic, file],
        }));
        return false;
      },
      businessPic,
      fileList: [...this.getPath(defaultBusiness), ...this.state.businessPic],
      listType: 'picture',
    };
    const medicalProps = {
      onRemove: file => {
        if (this.state.disabled) {
          message.error('请先点击修改按钮');
        } else {
          this.props.dispatch({
            type: 'supplierAccount/updateState',
            payload: {
              defaultMedical: defaultMedical.filter(item => item.uid !== file.uid),
            },
          });
          this.setState(state => {
            const index = state.medicalPic.indexOf(file);
            const newFileList = state.medicalPic.slice();
            newFileList.splice(index, 1);
            return {
              medicalPic: newFileList,
            };
          });
        }
      },
      beforeUpload: file => {
        this.setState(state => ({
          medicalPic: [...state.medicalPic, file],
        }));
        return false;
      },
      medicalPic,
      fileList: [...this.getPath(defaultMedical), ...this.state.medicalPic],
      listType: 'picture',
    };
    return (
      <PageHeaderWrapper>
        <div justify="space-around">
          <Form {...formItemLayout} horizontal onSubmit={this.handlerSubmit}>
            <FormItem label="所在机构全称" hasFeedback={!disabled}>
              {getFieldDecorator('suppilerName', {
                initialValue: suppilerName,
                rules: [{ required: true, message: '请输入所在机构' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem label="公司简称" hasFeedback={!disabled}>
              {getFieldDecorator('suppilerShortName', {
                initialValue: suppilerShortName,
                rules: [{ required: true, message: '请输入公司简称' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem label="许可证号" hasFeedback={!disabled}>
              {getFieldDecorator('suppilerLicense', {
                initialValue: suppilerLicense,
                rules: [{ required: true, message: '请输入许可证号' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem label="联系人" hasFeedback={!disabled}>
              {getFieldDecorator('conractsName', {
                initialValue: conractsName,
                rules: [{ required: true, message: '请输入联系人' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem label="联系人手机号" hasFeedback={!disabled}>
              {getFieldDecorator('conractsPhone', {
                initialValue: conractsPhone,
                rules: [{ required: true, message: '请输入联系人手机号' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem label="联系邮箱" hasFeedback={!disabled}>
              {getFieldDecorator('conractsEmail', {
                initialValue: conractsEmail,
                rules: [{ required: false, message: '请输入联系人邮箱' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem label="联系地址" hasFeedback={!disabled}>
              {getFieldDecorator('conractsAddress', {
                initialValue: conractsAddress,
                rules: [{ required: false, message: '请输入联系人手机号' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
          </Form>
          <Row>
            <Col span={12} offset={6}>
              <Divider orientation="left">营业执照(上传照片)</Divider>
              <Upload {...businessProps}>
                <Button disabled={disabled}>
                  <Icon type="upload" />
                  上传
                </Button>
              </Upload>
              <Divider orientation="left">医疗器械经营许可证/备案信息</Divider>
              <Upload {...medicalProps}>
                <Button disabled={disabled}>
                  <Icon type="upload" />
                  上传
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row type="flex" justify="end" style={{ marginTop: '30px' }}>
            <Col span={18} offset={2}>
              <span style={{ marginRight: '20px', display: disabled ? 'none' : 'inline-block' }}>
                <Button onClick={this.handlerCancel}>取消</Button>
              </span>
              <span style={{ display: !disabled ? 'none' : 'inline-block' }}>
                <Button type="primary" onClick={this.handlerEditor}>
                  修改
                </Button>
              </span>
              <span style={{ display: disabled ? 'none' : 'inline-block' }}>
                <Button loading={loading} type="primary" onClick={this.handlerSubmit}>
                  保存
                </Button>
              </span>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SupplierAccount;
