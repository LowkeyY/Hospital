import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Warehousing.less';

const FormItem = Form.Item;

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
          payload: values,
        });
      }
    });
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderWrapper title="入库">
        <div className={styles.outer}>
          <Form layout="inline" onSubmit={this.handlerSubmit}>
            <FormItem placeholder="请输入扫描" hasFeedback>
              {getFieldDecorator('code', {
                initialValue: '',
                rules: [{ required: true, message: '入库码必须填写' }],
              })(<Input size="large" />)}
            </FormItem>
            <Form.Item>
              <Button loading={loading} type="primary" size="large" onClick={this.handlerSubmit}>
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Warehousing;
