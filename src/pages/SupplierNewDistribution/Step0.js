import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './style.less';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
moment.locale('zh-cn');
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
      offset: 4,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

@connect(({ loading, addNewDistribution }) => ({
  addNewDistribution,
  loading: loading.effects['addNewDistribution/fetch'],
}))
@Form.create()
class Step0 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/getHospital',
    });
  }

  okHandler = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        form.resetFields();
        const res = {
          ...values,
          arrivalTime: values.arrivalTime.format(dateFormat),
        };
        dispatch({
          type: 'addNewDistribution/updateState',
          payload: {
            info: res,
          },
        });
        router.push('/backstage/Add-supplier/goodsList');
      }
    });
  };

  getHospital = (arr = []) => {
    const children = [];
    arr.map(item =>
      children.push(
        <Select.Option key={item.hospitalBase.hospitalId} value={item.hospitalBase.hospitalId}>
          {item.hospitalBase.hospitalName}
        </Select.Option>
      )
    );
    return children;
  };

  getDepartment = (arr = []) => {
    const children = [];
    arr.map(item =>
      children.push(
        <Select.Option key={item.deptBase.deptId} value={item.deptBase.deptId}>
          {item.deptBase.deptName}
        </Select.Option>
      )
    );
    return children;
  };

  renderDepartmentOption = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/getDepartment',
      payload: {
        hospitalId: val,
      },
    });
  };

  renderHospitalOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/getHospital',
    });
  };

  render() {
    const {
      addNewDistribution: { hospital, department, info },
      form: { getFieldDecorator },
    } = this.props;
    const {
      distributor = '',
      phoneNumber = '',
      arrivalTime = '',
      hospitalId = '',
      deptId = '',
    } = info;
    return (
      <Fragment>
        <div className={styles.commonList}>
          <Form {...formItemLayout} onSubmit={this.okHandler}>
            <FormItem label="配货人" hasFeedback>
              {getFieldDecorator('distributor', {
                initialValue: distributor,
                rules: [{ required: true, message: '请输入配货人' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="配货电话" hasFeedback>
              {getFieldDecorator('phoneNumber', {
                initialValue: phoneNumber,
                rules: [{ required: true, message: '请输入配货电话' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="预计到货时间" hasFeedback>
              {getFieldDecorator('arrivalTime', {
                initialValue: arrivalTime ? moment(arrivalTime, dateFormat) : '',
                rules: [{ required: true, message: '请选择到货时间' }],
              })(<DatePicker format={dateFormat} />)}
            </FormItem>
            <Form.Item label="选择医院">
              <div id="hospitalArea" style={{ position: 'relative' }}>
                {getFieldDecorator('hospitalId', {
                  initialValue: hospitalId,
                  rules: [{ required: true, message: '请选医院' }],
                })(
                  <Select
                    onDropdownVisibleChange={this.renderHospitalOption}
                    getPopupContainer={() => document.getElementById('hospitalArea')}
                    onSelect={val => this.renderDepartmentOption(val)}
                  >
                    {this.getHospital(hospital)}
                  </Select>
                )}
              </div>
            </Form.Item>
            <Form.Item label="选择科室">
              <div id="departmentArea" style={{ position: 'relative' }}>
                {getFieldDecorator('deptId', {
                  initialValue: deptId,
                  rules: [{ required: true, message: '请选择科室' }],
                })(
                  <Select getPopupContainer={() => document.getElementById('departmentArea')}>
                    {this.getDepartment(department)}
                  </Select>
                )}
              </div>
            </Form.Item>
            <Form.Item {...tailFormItemLayout} label="">
              <Button type="primary" onClick={this.okHandler}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}

export default Step0;
