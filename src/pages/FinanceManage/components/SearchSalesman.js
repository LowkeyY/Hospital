import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from '../index.less';

const FormItem = Form.Item;
moment.locale('zh-cn');
const state = [{ label: '正常', value: '1' }, { label: '停用', value: '2' }];

@connect(({ global }) => ({
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
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryAllSupplier',
    });
    dispatch({
      type: 'global/querySalesman',
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
      global: { salesman, allSupplierList },
    } = this.props;
    const { getFieldDecorator } = form;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="提成状态">
              {getFieldDecorator('deductState')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {state.map(item => (
                    <Select.Option value={item.value}>{item.label}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
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
            <FormItem label="选择业务员">
              {getFieldDecorator('deductUser')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {salesman.map(item => (
                    <Select.Option value={item.userId}>{item.userRealName}</Select.Option>
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
