import React, { PureComponent } from 'react';
import { Form, Select } from 'antd';
import { connect } from 'dva';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};

@connect(({ global }) => ({
  global,
}))
class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getDept',
    });
  }

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        form.resetFields();
      }
    });
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

  handlerSelect = val => {
    const { onSelect } = this.props;
    onSelect(val);
  };

  render() {
    const {
      form,
      global: { dept },
      deptId,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form {...formItemLayout}>
        <Form.Item label="选择科室">
          <div id="departmentArea" style={{ position: 'relative' }}>
            {getFieldDecorator('deptId', {
              initialValue: deptId,
            })(
              <Select
                getPopupContainer={() => document.getElementById('departmentArea')}
                onSelect={val => this.handlerSelect(val)}
              >
                {this.getDepartment(dept)}
              </Select>
            )}
          </div>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Department);
