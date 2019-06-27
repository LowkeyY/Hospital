import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Input, Select } from 'antd';
import styles from '../HospitalOrder.less';

const FormItem = Form.Item;

@connect(({ global, hospitalOrder }) => ({
  global,
  hospitalOrder,
}))
class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const deptType = localStorage.getItem('deptType');
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'global/getSupplier',
        payload: { deptId },
      });
    }
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
      global: { supplier },
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="货品名称">
              {getFieldDecorator('goodsName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('suppilerId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {supplier.map((item, i) => (
                    <Select.Option key={i} value={item.suppilerBase.suppilerId}>
                      {item.suppilerBase.suppilerName}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
