import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import { trim } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ExWarehouse.less';

const FormItem = Form.Item;

@connect(({ loading, exWarehousing }) => ({
  exWarehousing,
  loading: loading.effects['exWarehousing/add'],
}))
@Form.create()
class ExWarehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlerSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'exWarehousing/add',
          payload: {
            code: trim(values.code),
          },
        });
        form.resetFields();
      }
    });
  };

  handlerRecord = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-ex-warehouse/record',
      })
    );
  };

  handleEnterKey = e => {
    if (e.which === 13) {
      this.handlerSubmit();
    }
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderWrapper title="出库">
        <div className={styles.outer}>
          <Form layout="inline">
            <FormItem placeholder="请输入扫描" hasFeedback>
              {getFieldDecorator('code', {
                initialValue: '',
                rules: [{ required: true, message: '出库码必须填写' }],
              })(<Input size="large" autoFocus onKeyUp={this.handleEnterKey} />)}
            </FormItem>
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                size="large"
                style={{ marginRight: '20px' }}
                onClick={this.handlerSubmit}
              >
                确定
              </Button>
              <Button type="primary" ghost size="large" onClick={this.handlerRecord}>
                出库记录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ExWarehouse;
