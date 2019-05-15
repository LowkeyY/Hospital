import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import {
  Table,
  Button,
  Form,
  Icon,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './style.less';

let cloneKey = -1;
const FormItem = Form.Item;
const EditableContext = React.createContext();
moment.locale('zh-cn');

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    if (inputType === 'date') {
      return <DatePicker />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `请输入${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@connect(({ loading, addNewDistribution }) => ({
  addNewDistribution,
  loading: loading.effects['addNewDistribution/fetch'],
  sumbitting: loading.effects['addNewDistribution/addDistribution'],
}))
@Form.create()
class Step2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
    };
    this.columns = [
      {
        title: '',
        dataIndex: 'add',
        key: 'add',
        render: (text, record) => (
          <Icon
            className={styles.add}
            type={record.isClone ? `minus-square` : `plus-square`}
            onClick={
              record.isClone
                ? () => this.handlerDeleteClick(record)
                : () => this.handlerAddClick(record)
            }
          />
        ),
      },
      {
        title: '货品',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        width: '8%',
        editable: true,
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        width: '10%',
        editable: true,
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
        width: '15%',
        editable: true,
      },
      {
        title: '灭菌日期',
        dataIndex: 'sterilizationDate',
        key: 'sterilizationDate',
        width: '15%',
        editable: true,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: '8%',
        editable: true,
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="取消将不会保存修改！"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                  配货
                </a>
              )}
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/getHospital',
    });
  }

  onPrev = () => {
    router.push('/backstage/Add-supplier/goodsList');
  };

  okHandler = () => {
    const {
      form,
      addNewDistribution: { distributionList },
      dispatch,
    } = this.props;
    form.validateFields(
      ['distributor', 'phoneNumber', 'arrivalTime', 'hospitalId', 'deptId'],
      (err, values) => {
        if (!err) {
          form.resetFields();
          const res = {
            distributeData: JSON.stringify(distributionList),
            ...values,
            arrivalTime: values.arrivalTime.format('YYYY-MM-DD'),
            totalPrice: this.getTotal(distributionList),
          };
          dispatch({
            type: 'addNewDistribution/addDistribution',
            payload: res,
          });
        }
      }
    );
  };

  handlerAddClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/addRow',
      payload: {
        ...record,
        isClone: true,
        key: (cloneKey -= 1),
      },
    });
  };

  handlerDeleteClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/deleteRow',
      payload: record.key,
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  getInputType = col => {
    if (col.dataIndex === 'unitPrice' || col.dataIndex === 'goodsNumber') {
      return 'number';
    }
    if (col.dataIndex === 'sterilizationDate' || col.dataIndex === 'termOfValidity') {
      return 'date';
    }
    return 'text';
  };

  save(form, key) {
    const { dispatch } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      dispatch({
        type: 'addNewDistribution/updateRow',
        payload: {
          ...row,
          sterilizationDate: row.sterilizationDate.format('YYYY-MM-DD'),
          termOfValidity: row.termOfValidity.format('YYYY-MM-DD'),
          key,
        },
      });
      this.setState({ editingKey: '' });
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  getTotal = arr => {
    let sum = 0;
    arr.map(item => {
      sum += item.goodsNumber * item.unitPrice || 0;
    });
    return sum;
  };

  renderTitle = total => {
    return (
      <div className={styles.title}>
        <div>配货单</div>
        <div>{`配货单总金额:${total}`}</div>
      </div>
    );
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

  render() {
    const {
      addNewDistribution: { distributionList, hospital, department },
      loading,
      sumbitting,
      form: { getFieldDecorator },
    } = this.props;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: this.getInputType(col),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Fragment>
        <div className={styles.commonList}>
          <Form onSubmit={this.okHandler}>
            <FormItem label="配货人" hasFeedback>
              {getFieldDecorator('distributor', {
                initialValue: '',
                rules: [{ required: true, message: '请输入配货人' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="配货电话" hasFeedback>
              {getFieldDecorator('phoneNumber', {
                initialValue: '',
                rules: [{ required: true, message: '请输入配货电话' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="预计到货时间" hasFeedback>
              {getFieldDecorator('arrivalTime', {
                initialValue: '',
                rules: [{ required: true, message: '请选择到货时间' }],
              })(<DatePicker />)}
            </FormItem>
            <Form.Item label="选择医院">
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
            <Form.Item label="选择科室">
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
          <EditableContext.Provider value={this.props.form}>
            <Table
              title={() => this.renderTitle(this.getTotal(distributionList))}
              components={components}
              dataSource={distributionList}
              columns={columns}
              loading={loading}
              pagination={false}
            />
          </EditableContext.Provider>
          <div className={styles.button}>
            <Button onClick={this.onPrev} style={{ marginRight: 8 }}>
              上一步
            </Button>
            <Button loading={sumbitting} type="primary" onClick={this.okHandler}>
              提交
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Step2;
