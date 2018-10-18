import React from 'react'
import styles from './404.less'
import { Button,Icon } from 'antd';
import { connect } from 'dva';

export default connect()(({ dispatch }) => {
  return (
  <div className={styles.error}>
    <Icon type="frown-o" />
    <h1>home page</h1>
  </div>
  );
});

