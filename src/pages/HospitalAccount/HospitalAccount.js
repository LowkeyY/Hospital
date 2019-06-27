import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './HospitalAccount.less';

const FormItem = Form.Item;

@connect(({ loading, hospitalAccount }) => ({
  hospitalAccount,
  loading: loading.effects['hospitalAccount/editor'],
}))
@Form.create()
class HospitalAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'hospitalAccount/fetch' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hospitalAccount.isEditor === true) {
      this.setState({
        disabled: true,
      });
    }
  }

  componentDidUpdate() {}

  editHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalAccount/editor',
      payload: values,
    });
  };

  handlerEditor = () => {
    const { dispatch } = this.props;
    const deptType = localStorage.getItem('deptType');
    if (deptType === '2') {
      dispatch({
        type: 'hospitalAccount/updateState',
        payload: {
          isEditor: false,
        },
      });
      this.setState({
        disabled: false,
      });
    } else {
      message.error('对不起您没有权限修改信息');
    }
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
      hospitalAccount: {
        data: { hospitalId },
      },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.editHandler({ ...values, hospitalId });
      }
    });
  };

  render() {
    const {
      form,
      hospitalAccount: { data },
      loading,
    } = this.props;
    const { disabled } = this.state;
    const { getFieldDecorator } = form;
    const { hospitalName = '', registCode = '' } = data;
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
      <PageHeaderWrapper title="我的医院">
        <div>
          <Form horizontal onSubmit={this.handlerSubmit}>
            <FormItem {...formItemLayout} label="医院名称" hasFeedback={!disabled}>
              {getFieldDecorator('hospitalName', {
                initialValue: hospitalName,
                rules: [{ required: true, message: '请输入医院名称' }],
              })(<Input disabled={disabled} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="邀请码" hasFeedback={!disabled}>
              <div>{registCode}</div>
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

export default HospitalAccount;
