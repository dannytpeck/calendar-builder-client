import React from 'react';
import moment from 'moment';
import { Draggable } from 'react-beautiful-dnd';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

function Challenge({ challenge, index, openPreviewChallengeModal, updateChallenges, toggleFeaturedChallengeInCalendar, deleteChallengeFromCalendar, selectedCalendar }) {
  /* globals $ */

  function updateCalendarUpdated() {
    base('Calendars').update(selectedCalendar.id, {
      'updated': moment().format('l')
    }, function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  function openFeaturedConfirmModal(challenge, isFeatured) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');

    $('#featured-modal').modal();

    // updates the modal content based on whether we would be setting or disabling this challenge as Featured
    if (isFeatured) {
      $('.modal-body').html('<p>Would you like to remove this tile from the Featured Activity banner?</p>');
      $('.modal-footer .btn-primary').html('Stop Featuring');
    } else {
      $('.modal-body').html('<p>Would you like to add this tile to the Featured Activity banner?</p>');
      $('.modal-footer .btn-primary').html('Feature Activity');
    }

    $('.modal-footer .btn-primary').off('click');
    $('.modal-footer .btn-primary').click(() => toggleFeaturedChallengeInCalendar(challenge, isFeatured));
  }

  function openDeleteConfirmModal(challenge) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#featured-modal').modal('hide');

    $('#confirm-modal').modal();
    $('.modal-body').html('<p>Are you sure you want to delete this challenge?</p>');
    $('.modal-footer .btn-danger').off('click');
    $('.modal-footer .btn-danger').click(() => deleteChallengeFromCalendar(challenge));
  }

  function validateStartDate(e, challenge) {
    let startDate = moment(e.target.value);
    let endDate = moment(challenge.fields['End Date']);

    // alert user if the end date is before the start date
    if (endDate.isBefore(startDate)) {
      alert('Error: The Start Date must be before the End Date.');
      $('#editingStartDate').addClass('invalid');
    } else {
      // do other actions because end date is valid
      $('#editingStartDate').removeClass('invalid');
      $('#editingStartDate').parent().html(`${moment(challenge.fields['Start Date']).format('L')}`);

      challenge.fields['Start Date'] = e.target.value;
      updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges 2.0').update(challenge.id, {
        'Start Date': e.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
      });
    }
  }

  function editStartDate(e, challenge) {
    let td = e.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingStartDate" value="${challenge.fields['Start Date']}" />`;

    $('#editingStartDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingStartDate').blur((ev) => {
      validateStartDate(ev, challenge);
    });

    // When user hits enter, also change it back
    $('#editingStartDate').on('keypress', (ev) => {
      if (event.key === 'Enter') {
        validateStartDate(ev, challenge);
      }
    });

  }

  function validateEndDate(e, challenge) {
    let startDate = moment(challenge.fields['Start Date']);
    let endDate = moment(e.target.value);

    // alert user if the end date is before the start date
    if (endDate.isBefore(startDate)) {
      alert('Error: The Start Date must be before the End Date.');
      $('#editingEndDate').addClass('invalid');
    } else {
      // do other actions because end date is valid
      $('#editingEndDate').removeClass('invalid');
      $('#editingEndDate').parent().html(`${moment(challenge.fields['End Date']).format('L')}`);

      challenge.fields['End Date'] = e.target.value;
      updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges 2.0').update(challenge.id, {
        'End Date': e.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
      });
    }
  }

  function editEndDate(e, challenge) {
    let td = e.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingEndDate" value="${challenge.fields['End Date']}" />`;

    $('#editingEndDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingEndDate').blur((ev) => {
      validateEndDate(ev, challenge);
    });

    // When user hits enter, also change it back
    $('#editingEndDate').on('keypress', (ev) => {
      if (event.key === 'Enter') {
        validateEndDate(ev, challenge);
      }
    });
  }

  function editPoints(event, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="text" class="form-control" id="editingPoints" value="${challenge.fields['Points']}" />`;

    // Since autofocus wasn't working, focus using jquery
    $('#editingPoints').focus();

    // Math for weekly calculation
    const start = moment(challenge.fields['Start Date']);
    const end = moment(challenge.fields['End Date']);
    const dayDifference = end.diff(start, 'days');
    const weeks = Math.ceil(dayDifference / 7);

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingPoints').blur((event) => {
      challenge.fields['Points'] = event.target.value;
      challenge.fields['Total Points'] = challenge.fields['Reward Occurrence'] === 'Weekly' ?
                                         event.target.value * weeks :
                                         event.target.value;

      $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
      updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges 2.0').update(challenge.id, {
        'Points': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
      });
    });

    // When user hits enter, also change it back
    $('#editingPoints').on('keypress', (event) => {
      if (event.key === 'Enter') {
        challenge.fields['Points'] = event.target.value;
        challenge.fields['Total Points'] = challenge.fields['Reward Occurrence'] === 'Weekly' ?
                                           event.target.value * weeks :
                                           event.target.value;

        $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
        updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').show().html('Saving...');
        base('Challenges 2.0').update(challenge.id, {
          'Points': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          updateCalendarUpdated();
          $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
        });
      }
    });
  }

  function hpImage(category) {
    switch (category) {
      case 'Health and Fitness':
        return 'images/HP_Icon_Health_Fitness.png';
      case 'Growth and Development':
        return 'images/HP_Icon_Growth_Development.png';
      case 'Contribution and Sustainability':
        return 'images/HP_Icon_Contribution_Sustainability.png';
      case 'Money and Prosperity':
        return 'images/HP_Icon_Money_Prosperity.png';
      default:
        return 'images/HP_Icon_All.png';
    }
  }

  function teamImage(team) {
    if (team === 'yes') {
      return 'images/icon_team.svg';
    } else {
      return 'images/icon_individual.svg';
    }
  }

  const startDate = moment(challenge.fields['Start Date']).format('YYYY-MM-DD');
  const endDate = moment(challenge.fields['End Date']).format('YYYY-MM-DD');
  const points = challenge.fields['Points'];
  const frequency = challenge.fields['Reward Occurrence'];

  const isFeatured = challenge.fields['Featured Activity'] === 'yes';
  const isTeam = (challenge.fields['Team Activity'] === 'yes');
  const hasBeenEdited = challenge.fields['Content Changed'] === 'yes';

  return (
    <Draggable draggableId={challenge.id} index={index} key={challenge.id}>
      {(provided) => (
        <tr
          {...provided.draggableProps}
          ref = {provided.innerRef}
        >
          <td>
            <img className="table-icon drag-icon" {...provided.dragHandleProps} src="images/icon_drag.svg" title="Drag row"/>
            <img className="table-icon-wide" src={challenge.fields['Header Image']} title="View image" onClick={() => openPreviewChallengeModal(challenge)} />
          </td>
          <td scope="row">
            <span className="challenge-title" title="View content" onClick={() => openPreviewChallengeModal(challenge)}>
              {challenge.fields['Challenge Name']}
            </span>
            { isFeatured ? <div><p className="featured-badge">Featured</p></div> : '' }
          </td>
          <td title="Tracking type">{challenge.fields['Tracking']}</td>
          <td className="text-center">
            <img className="table-icon category-icon" src={hpImage(challenge.fields['Category'])} title={(challenge.fields['Category'])} />
            <img className="table-icon team-icon" src={teamImage(challenge.fields['Team Activity'])} title={ isTeam ? 'Team' : 'Individual' } />
          </td>
          <td title="Start Date" onDoubleClick={(e) => editStartDate(e, challenge)}><span className="start-date">{moment(startDate).format('L')}</span></td>
          <td title="End Date" onDoubleClick={(e) => editEndDate(e, challenge)}><span className="end-date">{moment(endDate).format('L')}</span></td>
          <td title="Reward Occurrence">{challenge.fields['Reward Occurrence']}</td>
          <td title="Points (Total Points)" onDoubleClick={(e) => editPoints(e, challenge)}><span className="points-text">{challenge.fields['Points']} ({challenge.fields['Total Points']})</span></td>
          <td className="actions text-center">
            <img className="table-icon featured-icon" src={ isFeatured ? 'images/icon_star_notification.svg' : 'images/icon_star.svg' } title="Toggle Featured activity" onClick={() => openFeaturedConfirmModal(challenge, isFeatured)} />
            <img className="table-icon delete-icon" src="images/icon_delete.svg" title="Delete row" onClick={() => openDeleteConfirmModal(challenge)} />
          </td>
        </tr>
      )}
    </Draggable>
  );
}

export default Challenge;