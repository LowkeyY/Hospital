import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal } from 'antd';
import { trim } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Warehousing.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({ loading, warehousing }) => ({
  warehousing,
  loading: loading.effects['warehousing/add'],
}))
@Form.create()
class Warehousing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlerSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'warehousing/add',
          payload: {
            code: trim(values.code),
          },
        });
      }
      form.resetFields();
    });
  };

  handleEnterKey = e => {
    if (e.which === 13) {
      this.handlerSubmit();
    }
  };

  handlerShowConfirm = () => {
    confirm({
      title: '确定要入库吗?',
      content: '点击确定按钮执行入库操作',
      onOk: this.handlerSubmit,
      okText: '确认',
      cancelText: '取消',
    });
  };

  handlerRecord = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-warehouseing/record',
      })
    );
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderWrapper title="入库">
        <div className={styles.outer}>
          <Form layout="inline">
            <FormItem placeholder="请输入扫描" hasFeedback>
              {getFieldDecorator('code', {
                initialValue: '',
                rules: [{ required: true, message: '入库码必须填写' }],
              })(<Input size="large" autoFocus onKeyUp={this.handleEnterKey} />)}
            </FormItem>
            <Form.Item>
              <Button
                style={{ marginRight: '20px' }}
                loading={loading}
                type="primary"
                size="large"
                onClick={this.handlerSubmit}
              >
                确定
              </Button>
              <Button type="primary" ghost size="large" onClick={this.handlerRecord}>
                入库记录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Warehousing;
