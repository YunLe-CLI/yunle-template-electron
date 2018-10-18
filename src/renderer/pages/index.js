import { Rate } from 'antd';
import styles from './index.less';

const App=props=>{
  return (<div className={styles.body}><Rate allowHalf defaultValue={2.5} /></div>)
}

export default App;