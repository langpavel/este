import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, {PropTypes} from 'react';
import Panel from './Panel.react';
import fetch from '../components/fetch';
import {fetchDir} from '../../common/explorer/actions';

export default class Explorer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    explorer: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired
  };

  // constructor(props) {
  //   super(props);
  //   // Read why we bind event handlers explicitly.
  //   // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
  //   this.onFormSubmit = ::this.onFormSubmit;
  // }

  render() {
    const {actions, explorer} = this.props;

    return (
      <div className="explorer">
        {explorer.panels.map((panel, key) =>
          <Panel key={key} path={panel.get('path')} {...this.props} />
        )}
      </div>
    );
  }

}
