import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, {PropTypes} from 'react';

export default class Page extends Component {

  static propTypes = {
    msg: PropTypes.object
  };

  render() {
    const {msg} = this.props;
    const title = 'Explorer';

    return (
      <div className="explorer-page">
        <Helmet title={title} />
        PANELS
      </div>
    );
  }

}