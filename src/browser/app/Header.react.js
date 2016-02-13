import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {IndexLink, Link} from 'react-router';
import {connect} from 'react-redux';

@connect(state => ({
  msg: state.intl.msg.app.links,
  viewer: state.users.viewer
}))
export default class Header extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const {msg, viewer} = this.props;

    return (
      <nav>
        <ul>
          <li><IndexLink activeClassName="active" to="/">{msg.home}</IndexLink></li>
          <li><Link activeClassName="active" to="/todos">{msg.todos}</Link></li>
          <li><Link activeClassName="active" to="/me">{msg.me}</Link></li>
          {!viewer &&
            <li><Link activeClassName="active" to="/login">{msg.login}</Link></li>
          }
        </ul>
      </nav>
    );
  }

}
