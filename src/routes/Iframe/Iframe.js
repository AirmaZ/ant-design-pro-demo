import React from 'react';
import { getQueryVariable, isUrl } from '../../utils/utils';
import { routerRedux } from 'dva/router';
import PageNotFind from '../Exception/404';
import style from './index.less';

let browserVersion = window.navigator.userAgent.toUpperCase();
let isOpera = browserVersion.indexOf("OPERA") > -1;
let isFireFox = browserVersion.indexOf("FIREFOX") > -1;
let isChrome = browserVersion.indexOf("CHROME") > -1;
let isSafari = browserVersion.indexOf("SAFARI") > -1;
let isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
let isIE9More = (! -[1,] === false);

class Iframe extends React.Component {
  constructor(props) {
    super(props);
  }

  reinitIframe = (iframeId, minHeight=600) => {
    try {
      let iframe = document.getElementById(iframeId);
      let bHeight = 0;
      if (isChrome === false && isSafari === false) {
        try {
          bHeight = iframe.contentWindow.document.body.scrollHeight;
        } catch (ex) {
        }
      }
      let dHeight = 0;
      if (isFireFox === true)
        dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;//如果火狐浏览器高度不断增加删除+2
      else if (isIE === false && isOpera === false && iframe.contentWindow) {
        try {
          dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        } catch (ex) {
        }
      }
      else if (isIE === true && isIE9More) {//ie9+
        let heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeId);
        if (heightDeviation === 0) {
          bHeight += 3;
        } else if (heightDeviation !== 3) {
          eval("window.IE9MoreRealHeight" + iframeId + "=" + bHeight);
          bHeight += 3;
        }
      }
      else//ie[6-8]、OPERA
        bHeight += 3;

      let height = Math.max(bHeight, dHeight);
      if (height < minHeight) height = minHeight;
      //alert(iframe.contentWindow.document.body.scrollHeight + "~" + iframe.contentWindow.document.documentElement.scrollHeight);
      iframe.style.height = height + "px";
    } catch (ex) { }
  };

  componentDidMount(){
    this.reinitIframe('moble-iframe',600)
  }

  render() {
    const url = getQueryVariable(this.props.location.search, 'link');
    const isUrlStatus = isUrl(url);
    return (
      <div className={style['iframe-box']}>
        {isUrlStatus && (
          <iframe
            id='moble-iframe'
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              frameborder: 'none',
            }}
            src={url}
          />
        )}
        {!isUrlStatus && <PageNotFind />}
      </div>
    );
  }
}

export default Iframe;
