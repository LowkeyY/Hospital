import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Input, Select } from 'antd';
import styles from '../SupplierGoods.less';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryMethod',
    });
  }

  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  };

  handleSearch = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
      }
    });
  };

  render() {
    const {
      form,
      global: { method },
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="方法学">
              <div id="methodArea" style={{ position: 'relative' }}>
                {getFieldDecorator('methodId')(
                  <Select getPopupContainer={() => document.getElementById('methodArea')}>
                    {method.map(item => (
                      <Select.Option value={item.methodId}>{item.methodName}</Select.Option>
                    ))}
                  </Select>
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="货品名称">
              {getFieldDecorator('goodsNameCn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="厂家">
              {getFieldDecorator('manufacturer')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Modals);
