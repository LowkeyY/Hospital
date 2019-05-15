import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ addNewDistribution }) => ({
  addNewDistribution,
}))
class Step3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      router.push('/backstage/Add-supplier/goodsList');
    };
    const onFinish2 = () => {
      router.push('/backstage/Supplier-distribution-list');
    };

    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          再添加一单
        </Button>
        <Button onClick={onFinish2}>查看配货单</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="已添加新的配货单"
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
