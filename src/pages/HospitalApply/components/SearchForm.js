import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from '../HospitalApply.less';

const FormItem = Form.Item;
moment.locale('zh-cn');
const state = [
  { label: '未审核', value: '0' },
  { label: '审核通过', value: '1' },
  { label: '审核失败', value: '2' },
  { label: '已停用', value: '3' },
];

@connect(({ global, loading }) => ({
  global,
}))
class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }

  componentDidMount() {
    const { dispatch, deptId } = this.props;
    dispatch({
      type: 'global/getSupplier',
      payload: { deptId },
    });
  }

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  };

  handleSearch = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { beginDate = '', endDate = '' } = values;
        const res = {
          ...values,
          queryBeginDate: beginDate !== '' ? beginDate.format('YYYY-MM-DD') : '',
          queryEndDate: endDate !== '' ? endDate.format('YYYY-MM-DD') : '',
        };
        onOk(res);
      }
    });
  };

  render() {
    const {
      form,
      global: { supplier },
    } = this.props;
    const { getFieldDecorator } = form;
    const { startValue, endValue, endOpen } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('suppilerId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {supplier.map(item => (
                    <Select.Option value={item.suppilerBase.suppilerId}>
                      {item.suppilerBase.suppilerName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
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
            <FormItem label="开始时间">
              {getFieldDecorator('beginDate', {
                initialValue: '',
              })(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  value={startValue}
                  placeholder="开始时间"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束时间">
              {getFieldDecorator('endDate', {
                initialValue: '',
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  placeholder="结束时间"
                  onChange={this.onEndChange}
                  value={endValue}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
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
