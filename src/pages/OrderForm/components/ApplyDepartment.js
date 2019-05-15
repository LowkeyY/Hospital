import React, { PureComponent } from 'react';
import { Modal, Form, Select, Button } from 'antd';
import Result from '@/components/Result';
import { connect } from 'dva';
import styles from '../../List/BasicList.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@connect(({ global }) => ({
  global,
}))
class ApplyDepartment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}

  showModelHandler = e => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'orderForm/updateState',
      payload: {
        done: false,
      },
    });
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        form.resetFields();
      }
    });
  };

  renderHospitalOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getHospital',
    });
  };

  renderDepartmentOption = val => {
    const {
      dispatch,
      global: { hospital },
    } = this.props;
    const { deptId } = hospital.find(item => item.hospitalBase.hospitalId === val);
    dispatch({
      type: 'global/getDepartment',
      payload: {
        deptId,
      },
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
        <Select.Option key={item.deptId} value={item.deptId}>
          {item.deptName}
        </Select.Option>
      )
    );
    return children;
  };

  getModalContent = () => {
    const {
      form: { getFieldDecorator },
      global: { hospital, department },
      done,
    } = this.props;
    if (done) {
      return (
        <Result
          type="success"
          title="申请成功"
          description="请耐心等待审核结果。"
          actions={
            <Button type="primary" onClick={this.hideModelHandler}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    return (
      <Form horizontal onSubmit={this.okHandler}>
        <Form.Item {...formItemLayout} label="选择医院">
          <div id="hospitalArea" style={{ position: 'relative' }}>
            {getFieldDecorator('hospitalId', {
              initialValue: '',
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
        <Form.Item {...formItemLayout} label="选择科室">
          <div id="departmentArea" style={{ position: 'relative' }}>
            {getFieldDecorator('deptId', {
              initialValue: '',
              rules: [{ required: true, message: '请选择科室' }],
            })(
              <Select getPopupContainer={() => document.getElementById('departmentArea')}>
                {this.getDepartment(department)}
              </Select>
            )}
          </div>
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { children, done } = this.props;
    const { visible } = this.state;
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.okHandler, onCancel: this.hideModelHandler };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal title="申请科室" visible={visible} {...modalFooter}>
          {this.getModalContent()}
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ApplyDepartment);
