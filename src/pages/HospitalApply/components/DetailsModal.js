import { connect } from 'dva';
import React, { Component } from 'react';
import { Modal, Skeleton } from 'antd';
import { baseUrl } from '@/utils/config';
import styles from './DetailsModal.less';

@connect(({ hospitalApply, loading }) => ({
  hospitalApply,
  loading: loading.effects['hospitalApply/queryDetails'],
}))
class DetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      children,
      hospitalApply: { details },
      loading,
    } = this.props;
    const { visible } = this.state;
    const {
      suppilerName = '',
      suppilerShortName = '',
      suppilerLicense = '',
      conractsName = '',
      conractsPhone = '',
      conractsEmail,
      conractsAddress,
      licensePhotoPath,
      yiliaoPhotoPath,
    } = details;
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={suppilerName}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          footer={null}
        >
          {!loading ? (
            <div className={styles.info}>
              <div>{`简称：${suppilerShortName !== 'null' ? suppilerShortName : '-'}`}</div>
              <div>{`许可证号：${suppilerLicense || '-'}`}</div>
              <div>{`联系人：${conractsName || '-'}`}</div>
              <div>{`联系人电话：${conractsPhone || '-'}`}</div>
              <div>{`邮箱：${conractsEmail !== 'null' ? conractsEmail : '-'}`}</div>
              <div>{`地址：${conractsAddress !== 'null' ? conractsAddress : '-'}`}</div>
              <div className={styles.imagebox}>
                <div>营业执照</div>
                {licensePhotoPath
                  ? licensePhotoPath.split(',').map(item => (
                      <a target="_blank" href={`${baseUrl}${item}`}>
                        <img src={`${baseUrl}${item}`} alt="" />
                      </a>
                    ))
                  : '未上传'}
              </div>
              <div className={styles.imagebox}>
                <div>医疗器械经营许可证</div>
                {yiliaoPhotoPath
                  ? yiliaoPhotoPath.split(',').map(item => (
                      <a target="_blank" href={`${baseUrl}${item}`}>
                        <img src={`${baseUrl}${item}`} alt="" />
                      </a>
                    ))
                  : '未上传'}
              </div>
            </div>
          ) : (
            <Skeleton />
          )}
        </Modal>
      </span>
    );
  }
}

export default DetailsModal;
