import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import MethodologyModal from './components/modal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Methodology.less';

@connect(({ loading, methodology }) => ({
  methodology,
  loading: loading.effects['methodology/fetch'],
}))
class Methodology extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'methodology/fetch',
    });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'methodology/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'methodology/editor',
      payload: {
        ...values,
        methodId: id,
      },
    });
  };

  deleteMethod = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'methodology/deleteMethod',
      payload: {
        methodId: id,
      },
    });
  };

  render() {
    const {
      methodology: { list },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
      },
      {
        title: '顺序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <MethodologyModal
              record={record}
              onOk={values => this.editHandler(record.methodId, values)}
            >
              <Button type="primary" ghost size="small">
                编辑
              </Button>
            </MethodologyModal>
            {/*<Popconfirm title="确定删除?" onConfirm={() => this.deleteMethod(record.methodId)}>*/}
            {/*<Icon className={styles.icon} type="delete" />*/}
            {/*</Popconfirm>*/}
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <div>
            <MethodologyModal record={{}} onOk={this.createHandler}>
              <Button type="primary" style={{ marginBottom: '10px' }}>
                新建方法学
              </Button>
            </MethodologyModal>
          </div>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.methodId}
            pagination={false}
            loading={loading}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Methodology;
