import { APIURL } from 'app/config.js';
import * as actions from 'app/Templates/actions/templatesActions';
import backend from 'fetch-mock';

describe('templatesActions', () => {
  describe('async actions', () => {
    let dispatch;
    beforeEach(() => {
      const documentsUsingTemplate = 2;
      backend.restore();
      backend
      .delete(`${APIURL}templates?_id=templateId`, { body: JSON.stringify({ testBackendResult: 'ok' }) })
      .get(`${APIURL}documents/count_by_template?templateId=templateWithDocuments`, { body: JSON.stringify(documentsUsingTemplate) })
      .get(`${APIURL}documents/count_by_template?templateId=templateWithoutDocuments`, { body: JSON.stringify(0) });
      dispatch = jasmine.createSpy('dispatch');
    });

    afterEach(() => backend.restore());

    describe('checkTemplateCanBeDeleted', () => {
      it('should reject a promise if the template has documents', (done) => {
        const template = { _id: 'templateWithDocuments' };

        actions.checkTemplateCanBeDeleted(template)(dispatch)
        .then(() => {
          expect('Promise to be rejected').toBe(false);
          done();
        })
        .catch(() => {
          done();
        });
      });
    });

    describe('deleteTemplate', () => {
      it('should delete the template and dispatch a DELETE_TEMPLATE action with the template id', (done) => {
        const template = { _id: 'templateId' };

        actions.deleteTemplate(template)(dispatch)
        .then(() => {
          expect(dispatch).toHaveBeenCalledWith({ type: 'templates/REMOVE', value: template });
          done();
        });
      });
    });
  });
});
