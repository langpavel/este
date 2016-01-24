import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, {PropTypes} from 'react';
import fetch from '../components/fetch';
import {fetchDir} from '../../common/explorer/actions';
import {pathToStorePath} from '../../common/explorer/utils';
import Entry from './Entry.react';

@fetch(fetchDir)
export default class Panel extends Component {

  static propTypes = {
    path: PropTypes.array.isRequired,
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
    const {path, explorer, actions} = this.props;

    let components = [
      <div key='..' fileName={name}>..</div>
    ];

    const entries = explorer.tree.getIn(pathToStorePath('/', path, 'entries'));
    console.log('entries', entries);
    if (entries) {
      components = entries.reduce((components, stat, name) => {
        const realPath = path;
        components.push(
          <Entry
            key={name}
            fileName={name}
            realPath={realPath}
          />
        );
        return components;
      }, components);
    }

    return (
      <div className="browser-panel">
        {components || "NOT LOADED"}
      </div>
    );
  }

}
