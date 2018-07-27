import React from 'react'
import { connect } from 'dva';

class GetMenuInfo extends React.Component{
  constructor(props){
    super(props);
    this.props.dispatch({type:'global/fetchMenuData'})
  }
  render(){
    return (
      this.props.children
    )
  }
}

export default connect ()(GetMenuInfo);
