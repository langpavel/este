import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, {PropTypes} from 'react';
import fetch from '../components/fetch';
import {fetchStat} from '../../common/explorer/actions';
import {connect} from 'react-redux';
import {pathToStorePath} from '../../common/explorer/utils';

const mapStateToProps = (state, props) => {
  return {
    stat: state.explorer.tree.getIn(pathToStorePath(props.realPath))
  }
};

const mapDispatchToProps = {
  fetchStat
};

@connect(mapStateToProps, mapDispatchToProps)
export default class FileEntry extends Component {

  static propTypes = {
    fileName: PropTypes.string.isRequired,
    realPath: PropTypes.array.isRequired,
    stat: PropTypes.object,
    msg: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.fetchStat({path: this.props.realPath.join('/') + '/' + this.props.fileName});
  }

  render() {
    const {explorer, actions, realPath, fileName} = this.props;

    return (
      <div className="file-entry">
        {realPath.join('/') + '/' + fileName}
      </div>
    );
  }

}
