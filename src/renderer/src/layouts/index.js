import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

function BasicLayout(props) {
  return (
    <Scrollbars className={styles.normal}>
      { props.children }
    </Scrollbars>
  );
}

export default BasicLayout;
