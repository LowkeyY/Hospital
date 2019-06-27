import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Select } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;
const state = [
  { label: '即将过期', value: '1' },
  { label: '正常', value: '2' },
  { label: '欠费', value: '3' },
];
@connect(({ global }) => ({
  global,
}))
class Modals extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryAllSupplier',
    });
    dispatch({
      type: 'global/queryAllHospital',
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
      global: { allSupplierList, allHospitalList },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('sState')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {state.map(item => (
                    <Select.Option value={item.value}>{item.label}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('suppilerId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {allSupplierList.map(item => (
                    <Select.Option value={item.suppilerId}>{item.suppilerName}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="医院">
              {getFieldDecorator('hospitalId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {allHospitalList.map(item => (
                    <Select.Option value={item.hospitalId}>{item.hospitalName}</Select.Option>
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
