import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { Table, Button, Form, Icon, Input, InputNumber, DatePicker, Popconfirm, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './style.less';

let cloneKey = -1;
const FormItem = Form.Item;
const { confirm } = Modal;
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
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
        fixed: 'left',
        width: 200,
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.isImportef === '0' ? '进口' : '国产'),
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
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: '8%',
        render: (text, record) => record.deptGoodsConfig.unitPrice,
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
                        href="javascript:;"
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
      {
        title: '删除',
        key: 'delete',
        fixed: 'right',
        render: (text, record) => {
          return (
            <a href="javascript:;" onClick={() => this.deleteItem(record.key)}>
              删除
            </a>
          );
        },
      },
    ];
  }

  componentDidMount() {}

  deleteItem = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/deleteGoods',
      payload: {
        key,
      },
    });
  };

  onPrev = () => {
    router.push('/backstage/Add-supplier/goodsList');
  };

  okHandler = () => {
    const {
      form,
      addNewDistribution: { distributionList, info },
      dispatch,
    } = this.props;
    form.validateFields(err => {
      if (!err) {
        form.resetFields();
        const res = {
          distributeData: JSON.stringify(distributionList),
          ...info,
          totalPrice: this.getTotal(distributionList),
        };
        dispatch({
          type: 'addNewDistribution/addDistribution',
          payload: res,
        });
      }
    });
  };

  handlerShowConfirm = () => {
    const {
      addNewDistribution: { distributionList },
    } = this.props;
    confirm({
      title: '确定要配货吗?',
      content: (
        <div className={styles.submitInfo}>
          <p>{`共选择${distributionList.length}件货品`}</p>
          <span>
            总金额: <span>{this.getTotal(distributionList)}</span>元
          </span>
        </div>
      ),
      onOk: () => this.okHandler(),
      okText: '确认',
      cancelText: '取消',
    });
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
      sum += item.goodsNumber * item.deptGoodsConfig.unitPrice || 0;
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

  render() {
    const {
      addNewDistribution: { distributionList },
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
      <Fragment>
        <div className={styles.commonList}>
          <EditableContext.Provider value={this.props.form}>
            <Table
              title={() => this.renderTitle(this.getTotal(distributionList))}
              components={components}
              dataSource={distributionList}
              columns={columns}
              loading={loading}
              pagination={false}
              scroll={{ x: 1400 }}
            />
          </EditableContext.Provider>
          <div className={styles.button}>
            <Button onClick={this.onPrev} style={{ marginRight: '20px' }}>
              上一步
            </Button>
            <Button
              disabled={editingKey !== ''}
              loading={sumbitting}
              type="primary"
              onClick={this.handlerShowConfirm}
            >
              提交
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Step2;
