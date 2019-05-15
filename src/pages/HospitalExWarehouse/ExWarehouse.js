import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
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
          payload: values,
        });
      }
    });
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderWrapper title="出库">
        <div className={styles.outer}>
          <Form layout="inline" onSubmit={this.handlerSubmit}>
            <FormItem placeholder="请输入扫描" hasFeedback>
              {getFieldDecorator('code', {
                initialValue: '',
                rules: [{ required: true, message: '出库码必须填写' }],
              })(<Input size="large" />)}
            </FormItem>
            <Button
              loading={loading}
              type="primary"
              size="large"
              style={{ marginLeft: '10px' }}
              onClick={this.handlerSubmit}
            >
              确定
            </Button>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ExWarehouse;
