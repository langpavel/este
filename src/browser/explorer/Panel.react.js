import Component from 'react-pure-render/component';
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
    const {path, explorer} = this.props;

    let components = [
      <div key=".." fileName={name}>..</div>
    ];

    const entries = explorer.tree.getIn(pathToStorePath('/', path, 'entries'));
    if (entries) {
      components = entries
        .sortBy(entry => {
          const stat = entry.get('stat');
          return stat ? stat.size : 0;
        })
        .sortBy(entry => {
          const stat = entry.get('stat');
          return stat && stat.isDirectory() ? -1 : 0;
        })
        .reduce((components, entry, name) => {
          components.push(
            <Entry
              key={name}
              fileName={name}
              path={path}
              entry={entry}
            />
          );
          return components;
        }, components);
    }

    return (
      <div className="browser-panel">
        {components || 'NOT LOADED'}
      </div>
    );
  }

}
