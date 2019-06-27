import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const { Step } = Steps;
@connect(({ addNewDistribution }) => ({
  addNewDistribution,
}))
export default class StepForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/updateState',
      payload: {
        distributionList: [],
      },
    });
  }

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'fill-form':
        return 0;
      case 'goodsList':
        return 1;
      case 'distribution':
        return 2;
      case 'result':
        return 3;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper title="新建配货单" tabActiveKey={location.pathname}>
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写配货信息" />
              <Step title="添加货品" />
              <Step title="提交配货单" />
              <Step title="完成" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
