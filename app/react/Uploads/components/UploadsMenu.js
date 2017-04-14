import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {newEntity} from 'app/Uploads/actions/uploadsActions';

export class UploadsMenu extends Component {
  renderNormalMenu() {
    return (
      <div>
        <div className="btn btn-success"
             onClick={this.props.newEntity.bind(null, this.props.templates.toJS().filter((template) => template.isEntity))}>
          <i className="fa fa-plus"></i>
          <span className="btn-label">Entity</span>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.hide) {
      return null;
    }

    return this.renderNormalMenu();
  }
}

UploadsMenu.propTypes = {
  hide: PropTypes.bool,
  newEntity: PropTypes.func,
  templates: PropTypes.object
};

function mapStateToProps(state) {
  return {
    hide: !!state.uploads.uiState.get('selectedDocuments').size,
    templates: state.templates
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({newEntity}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadsMenu);
