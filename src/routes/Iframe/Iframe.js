import React from 'react';
import { getPageQuery, isUrl } from '../../utils/utils';
import { routerRedux } from 'dva/router';
import PageNotFind from '../Exception/404';
import style from './index.less';

class Iframe extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = getPageQuery().link;
    const isUrlStatus = isUrl(url);
    return (
      <div className={style['iframe-box']}>
        {
          isUrlStatus &&
          <iframe
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              frameborder: 'none',
            }}
            src={url}/>
        }
        {
          !isUrlStatus &&
          <PageNotFind/>
        }
      </div>
    );
  }
}

export default Iframe;
