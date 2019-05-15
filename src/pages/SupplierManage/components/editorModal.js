import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Upload, Button, Icon, Divider } from 'antd';
import { baseUrl } from '@/utils/config';

const FormItem = Form.Item;

class EditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      businessPic: [],
      medicalPic: [],
      defaultBusiness: [],
      defaultMedical: [],
    };
  }

  getPicUrl = arr => {
    const newArr = [];
    arr.map((item, i) =>
      newArr.push({
        uid: `-${i}`,
        status: 'done',
        url: item,
      })
    );
    return newArr;
  };

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

  showModelHandler = e => {
    const {
      record: { licensePhotoPath, yiliaoPhotoPath },
    } = this.props;
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
      defaultBusiness:
        licensePhotoPath && licensePhotoPath !== ''
          ? this.getPicUrl(licensePhotoPath.split(','))
          : [],
      defaultMedical:
        yiliaoPhotoPath && yiliaoPhotoPath !== '' ? this.getPicUrl(yiliaoPhotoPath.split(',')) : [],
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
    const {
      onOk,
      form,
      record: { suppilerId },
    } = this.props;
    const { businessPic, medicalPic, defaultMedical, defaultBusiness } = this.state;
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
        onOk(formData);
        this.hideModelHandler();
        form.resetFields();
        this.setState({
          defaultBusiness: [],
          defaultMedical: [],
        });
      }
    });
  };

  render() {
    const { children, form, record, title = '' } = this.props;
    const { visible, businessPic, medicalPic, defaultBusiness, defaultMedical } = this.state;
    const { getFieldDecorator } = form;
    const {
      suppilerName = '',
      suppilerShortName = '',
      suppilerLicense = '',
      conractsName = '',
      conractsPhone = '',
      conractsEmail = '',
      conractsAddress = '',
    } = record;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };

    const businessProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.businessPic.indexOf(file);
          const newFileList = state.businessPic.slice();
          const res = defaultBusiness.filter(item => item.uid !== file.uid);
          newFileList.splice(index, 1);
          return {
            businessPic: newFileList,
            defaultBusiness: res,
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
      defaultFileList: [...this.getPath(defaultBusiness)],
      listType: 'picture',
    };
    const medicalProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.medicalPic.indexOf(file);
          const newFileList = state.medicalPic.slice();
          const res = defaultMedical.filter(item => item.uid !== file.uid);
          newFileList.splice(index, 1);
          return {
            medicalPic: newFileList,
            defaultMedical: res,
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
      defaultFileList: [...this.getPath(defaultMedical)],
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
                    initialValue: suppilerName,
                    rules: [{ required: true, message: '请输入所在机构' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="公司简称" hasFeedback>
                  {getFieldDecorator('suppilerShortName', {
                    initialValue: suppilerShortName,
                    rules: [{ required: true, message: '请输入公司简称' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="许可证号" hasFeedback>
                  {getFieldDecorator('suppilerLicense', {
                    initialValue: suppilerLicense,
                    rules: [{ required: true, message: '请输入许可证号' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人" hasFeedback>
                  {getFieldDecorator('conractsName', {
                    initialValue: conractsName,
                    rules: [{ required: true, message: '请输入联系人' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人手机号" hasFeedback>
                  {getFieldDecorator('conractsPhone', {
                    initialValue: conractsPhone,
                    rules: [{ required: true, message: '请输入联系人手机号' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系邮箱" hasFeedback>
                  {getFieldDecorator('conractsEmail', {
                    initialValue: conractsEmail,
                    rules: [{ required: false, message: '请输入联系人邮箱' }],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系地址" hasFeedback>
                  {getFieldDecorator('conractsAddress', {
                    initialValue: conractsAddress,
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

export default Form.create()(EditorModal);
