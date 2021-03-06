import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Form, Icon, Input, InputNumber, DatePicker, Popconfirm } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './SupplierDistribution.less';

let cloneKey = -1;
const FormItem = Form.Item;
const EditableContext = React.createContext();
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM-DD';

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    if (inputType === 'date') {
      return <DatePicker format={dateFormat} />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, ...restProps } = this.props;
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
                    initialValue:
                      inputType === 'date'
                        ? record[dataIndex]
                          ? moment(record[dataIndex], dateFormat)
                          : ''
                        : record[dataIndex],
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

@connect(({ loading, supplierDistribution }) => ({
  supplierDistribution,
  loading: loading.effects['supplierDistribution/fetch'],
  sumbitting: loading.effects['supplierDistribution/addDistribution'],
}))
@Form.create()
class SupplierDistribution extends PureComponent {
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
        fixed: 'left',
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
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 250,
        fixed: 'left',
        render: (text, record) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
        ),
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.goodsBase.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        width: 150,
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (text, record) => record.deptGoodsConfig.unitPrice,
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        editable: true,
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        editable: true,
        // render: (text, record) => (
        //   <Input onChange={(value) => this.changeNum(value, record)} />
        // ),
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
        editable: true,
        // render: (text, record) => (
        //   <DatePicker />
        // ),
      },
      {
        title: '灭菌日期',
        dataIndex: 'sterilizationDate',
        key: 'sterilizationDate',
        editable: true,
        // render: (text, record) => (
        //   <DatePicker />
        // ),
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
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

  componentDidMount() {}

  deleteKey = arr => {
    arr.map(item => delete item.detailId);
    return arr;
  };

  okHandler = () => {
    const {
      form,
      supplierDistribution: { list },
      dispatch,
      location,
    } = this.props;
    const { purchaseHospatisId, purchaseId, deptId } = location.query;
    form.validateFields(['distributor', 'phoneNumber', 'arrivalTime'], (err, values) => {
      if (!err) {
        form.resetFields();
        const res = {
          distributeData: JSON.stringify(this.deleteKey(list)),
          hospitalId: purchaseHospatisId,
          purchaseId,
          deptId,
          ...values,
          arrivalTime: values.arrivalTime.format('YYYY-MM-DD'),
          totalPrice: this.getTotal(list),
        };
        dispatch({
          type: 'supplierDistribution/addDistribution',
          payload: res,
        });
      }
    });
  };

  handlerAddClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierDistribution/addRow',
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
      type: 'supplierDistribution/deleteRow',
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

  getTotal = arr => {
    let sum = 0;
    arr.map(item => {
      sum += item.goodsNumber * item.deptGoodsConfig.unitPrice || 0;
    });
    return sum;
  };

  save(form, key) {
    const { dispatch } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      dispatch({
        type: 'supplierDistribution/updateRow',
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

  renderTitle = total => {
    return (
      <div className={styles.title}>
        <div>配货单</div>
        <div>{`配货单总金额:${total}`}</div>
      </div>
    );
  };

  render() {
    const {
      supplierDistribution: { list },
      loading,
      sumbitting,
      form: { getFieldDecorator },
    } = this.props;
    const { editingKey = '' } = this.state;
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
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <Form layout="inline" onSubmit={this.okHandler}>
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
          </Form>
          <EditableContext.Provider value={this.props.form}>
            <Table
              title={() => this.renderTitle(this.getTotal(list))}
              components={components}
              dataSource={list}
              columns={columns}
              loading={loading}
              pagination={false}
              scroll={{ x: 1400 }}
            />
          </EditableContext.Provider>
          <div className={styles.button}>
            <Button
              disabled={editingKey !== ''}
              loading={sumbitting}
              type="primary"
              onClick={this.okHandler}
            >
              提交
            </Button>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SupplierDistribution;
