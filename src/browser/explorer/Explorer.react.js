import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Panel from './Panel.react';

export default class Explorer extends Component {

  static propTypes = {
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
    const {explorer} = this.props;

    return (
      <div className="explorer">
        {explorer.panels.map((panel, key) =>
          <Panel key={key} path={panel.get('path')} {...this.props} />
        )}
      </div>
    );
  }

}
