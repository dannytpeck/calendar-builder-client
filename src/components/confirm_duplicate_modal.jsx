import React from 'react';

function ConfirmDuplicateModal() {
  return (
    <div id="duplicate-modal" className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="duplicate-modal-title">Duplicate Challenge</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            ...
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-link" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary">Duplicate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDuplicateModal;
