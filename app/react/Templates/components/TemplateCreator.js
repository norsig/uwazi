import 'app/Templates/scss/templates.scss';

import { DragDropContext } from 'react-dnd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ShowIf from 'app/App/ShowIf';
import { saveRelationType } from 'app/RelationTypes/actions/relationTypeActions';
import { resetTemplate, saveTemplate, saveEntity } from '../actions/templateActions';
import MetadataTemplate from './MetadataTemplate';
import PropertyOption from './PropertyOption';

export class TemplateCreator extends Component {
  componentWillUnmount() {
    this.props.resetTemplate();
  }

  render() {
    let environment = 'document';
    let save = this.props.saveTemplate;
    let backUrl = '/settings/documents';

    if (this.props.entity) {
      save = this.props.saveEntity;
      backUrl = '/settings/entities';
      environment = 'entity';
    }

    if (this.props.relationType) {
      save = this.props.saveRelationType;
      backUrl = '/settings/connections';
      environment = 'relationship';
    }

    return (
      <div className="metadata">
        <div className="panel panel-default">
          <div className="panel-heading">
            Metadata creator
          </div>
          <div className="panel-body">
            <div className="row">
              <main className="col-xs-12 col-sm-9">
                <MetadataTemplate saveTemplate={save} backUrl={backUrl} relationType={this.props.relationType}/>
              </main>
              { environment !== 'relationship' &&
                <aside className="col-xs-12 col-sm-3">
                  <div className="metadataTemplate-constructor">
                    <div><i>Properties</i></div>
                    <ul className="list-group">
                      <PropertyOption label="Text" type="text"/>
                      <PropertyOption label="Numeric" type="numeric"/>
                      <PropertyOption label="Select" type="select" disabled={this.props.noDictionaries} />
                      <PropertyOption label="Multi Select" type="multiselect" disabled={this.props.noDictionaries} />
                      { environment !== 'relationship' &&
                        <PropertyOption label="Relationship" type="relationship" disabled={this.props.noRelationtypes} />
                      }
                      <PropertyOption label="Date" type="date"/>
                      <PropertyOption label="Date Range" type="daterange"/>
                      <PropertyOption label="Multi Date" type="multidate"/>
                      <PropertyOption label="Multi Date Range" type="multidaterange"/>
                      { environment === 'document' && <PropertyOption label="Preview" type="preview"/> }
                      <PropertyOption label="Rich Text" type="markdown"/>
                      <PropertyOption label="Multimedia" type="multimedia"/>
                      <PropertyOption label="Geolocation" type="geolocation"/>
                      <ShowIf if={this.props.project === 'cejil'}>
                        <PropertyOption label="Violated articles" type="nested"/>
                      </ShowIf>
                    </ul>
                    <ShowIf if={this.props.noRelationtypes}>
                      <div className="alert alert-warning">
                        Relationship fields can not be added untill you have at least one relationship type to select.
                      </div>
                    </ShowIf>
                  </div>
                </aside>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TemplateCreator.defaultProps = {
  entity: false,
  relationType: false,
  noRelationtypes: true,
  noDictionaries: true,
  project: ''
};

TemplateCreator.propTypes = {
  resetTemplate: PropTypes.func.isRequired,
  saveTemplate: PropTypes.func.isRequired,
  saveEntity: PropTypes.func.isRequired,
  saveRelationType: PropTypes.func.isRequired,
  entity: PropTypes.bool,
  relationType: PropTypes.bool,
  noRelationtypes: PropTypes.bool,
  noDictionaries: PropTypes.bool,
  project: PropTypes.string
};

TemplateCreator.contextTypes = {
  router: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetTemplate, saveTemplate, saveEntity, saveRelationType }, dispatch);
}

const mapStateToProps = ({ settings, relationTypes, thesauris }) => ({
    project: settings.collection.toJS().project,
    noRelationtypes: !relationTypes.size,
    noDictionaries: !thesauris.size
});

export default DragDropContext(HTML5Backend)(
  connect(mapStateToProps, mapDispatchToProps)(TemplateCreator)
);
