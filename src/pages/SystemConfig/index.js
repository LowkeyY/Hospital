import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ loading, systemConfig }) => ({
  systemConfig,
  loading: loading.effects['systemConfig/editor'],
}))
@Form.create()
class SystemConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'systemConfig/fetch' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.systemConfig.isEditor === true) {
      this.setState({
        disabled: true,
      });
    }
  }

  componentDidUpdate() {}

  editHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemConfig/editor',
      payload: values,
    });
  };

  handlerEditor = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemConfig/updateState',
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
      systemConfig: {
        data: { configId },
      },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.editHandler({ ...values, configId });
      }
    });
  };

  render() {
    const {
      form,
      systemConfig: { data },
      loading,
    } = this.props;
    const { disabled } = this.state;
    const { getFieldDecorator } = form;
    const { annualFee = '', slsUserDeduct = '' } = data;
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

    return (
      <PageHeaderWrapper title="系统配置">
        <div>
          <Form horizontal onSubmit={this.handlerSubmit}>
            <FormItem {...formItemLayout} label="年费充值价格" hasFeedback={!disabled}>
              {getFieldDecorator('annualFee', {
                initialValue: annualFee,
                rules: [{ required: true, message: '请输入年费充值价格' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="业务员提成百分比" hasFeedback={!disabled}>
              {getFieldDecorator('slsUserDeduct', {
                initialValue: slsUserDeduct,
                rules: [{ required: true, message: '请输入业务员提成百分比' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <Form.Item {...tailFormItemLayout}>
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
            </Form.Item>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SystemConfig;
