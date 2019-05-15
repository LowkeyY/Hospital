import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Select } from 'antd';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
class GoodsBoardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryClassify',
    });
    dispatch({
      type: 'global/queryMethod',
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
        onOk(values);
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
      global: { method, classify },
      isEdit = false,
    } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const {
      goodsNameCn = '',
      goodsNameEn = '',
      registMark = '',
      manufacturer = '',
      isImportef = '0',
      goodsSpec = '',
      goodsUnit = '',
      methodId = '',
      dirId = '',
      goodsRemark = '',
    } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.userId ? '修改' : '添加'}货品`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <Form.Item {...formItemLayout} label="货品分类">
              <div id="classifyArea" style={{ position: 'relative' }}>
                {getFieldDecorator('dirId', {
                  initialValue: dirId,
                  rules: [{ required: true, message: '请输入许可证号' }],
                })(
                  <Select
                    disabled={isEdit}
                    getPopupContainer={() => document.getElementById('classifyArea')}
                  >
                    {classify.map(item => (
                      <Select.Option value={item.dirId}>{item.dirName}</Select.Option>
                    ))}
                  </Select>
                )}
              </div>
            </Form.Item>
            <FormItem {...formItemLayout} label="注册号" hasFeedback={!isEdit}>
              {getFieldDecorator('registMark', {
                initialValue: registMark,
                rules: [{ required: true, message: '注册号不能为空' }],
              })(<Input disabled={isEdit} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="货品中文名" hasFeedback={!isEdit}>
              {getFieldDecorator('goodsNameCn', {
                initialValue: goodsNameCn,
                rules: [{ required: true, message: '货品中文名必须输入' }],
              })(<Input disabled={isEdit} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="货品英文名" hasFeedback={!isEdit}>
              {getFieldDecorator('goodsNameEn', {
                initialValue: goodsNameEn,
                rules: [{ required: true, message: '货品英文名必须输入' }],
              })(<Input disabled={isEdit} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="生产厂家（选填）" hasFeedback={!isEdit}>
              {getFieldDecorator('manufacturer', {
                initialValue: manufacturer,
                rules: [{ required: false, message: '请输入生产厂家' }],
              })(<Input disabled={isEdit} />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="产地">
              {getFieldDecorator('isImportef', {
                initialValue: isImportef,
              })(
                <Radio.Group disabled={isEdit}>
                  <Radio value="0">进口</Radio>
                  <Radio value="1">国产</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="规格" hasFeedback={!isEdit}>
              {getFieldDecorator('goodsSpec', {
                initialValue: goodsSpec,
                rules: [{ required: true, message: '请输入规格' }],
              })(<Input disabled={isEdit} />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="方法学">
              <div id="methodArea" style={{ position: 'relative' }}>
                {getFieldDecorator('methodId', {
                  initialValue: methodId,
                  rules: [{ required: true, message: '请输入许可证号' }],
                })(
                  <Select
                    disabled={isEdit}
                    getPopupContainer={() => document.getElementById('methodArea')}
                  >
                    {method.map(item => (
                      <Select.Option value={item.methodId}>{item.methodName}</Select.Option>
                    ))}
                  </Select>
                )}
              </div>
            </Form.Item>
            <FormItem {...formItemLayout} label="单位" hasFeedback={!isEdit}>
              {getFieldDecorator('goodsUnit', {
                initialValue: goodsUnit,
                rules: [{ required: true, message: '单位不能为空' }],
              })(<Input disabled={isEdit} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注" hasFeedback>
              {getFieldDecorator('goodsRemark', {
                initialValue: goodsRemark,
                rules: [{ required: false, message: '请输入规格' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(GoodsBoardModal);
