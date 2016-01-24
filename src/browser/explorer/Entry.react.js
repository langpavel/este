import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {fetchStat} from '../../common/explorer/actions';
import {connect} from 'react-redux';
import {pathToStorePath} from '../../common/explorer/utils';

const mapStateToProps = (state, props) => {
  return {
    stat: state.explorer.tree.getIn(pathToStorePath(props.realPath))
  };
};

const mapDispatchToProps = {
  fetchStat
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Entry extends Component {

  static propTypes = {
    fileName: PropTypes.string.isRequired,
    path: PropTypes.array.isRequired,
    entry: PropTypes.object,
    fetchStat: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.fetchStat({path: this.props.path.join('/') + '/' + this.props.fileName});
  }

  render() {
    const {fileName, entry} = this.props;
    const stat = entry.get('stat');

    return (
      <div className="file-entry">
        {stat && stat.isDirectory() ? '/' : ''}
        {fileName} {' | '}
        {!stat ? 'NOT LOADED' :
          stat.size
        }
      </div>
    );
  }

}
