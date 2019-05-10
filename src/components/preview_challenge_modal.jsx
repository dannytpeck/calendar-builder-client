import React, { Component } from 'react';
import moment from 'moment';

class PreviewChallengeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamSizeVisible: false,
      unitsVisible: false,
      startDate: '',
      endDate: '',
      verified: '',
      individual: '',
      rewardOccurrence: '',
      activityTrackingType: '',
      trackingText: '',
      activityGoal: '',
      points: '',
      title: '',
      instructions: '',
      description: ''
    };

    this.setTitle = this.setTitle.bind(this);
    this.setInstructions = this.setInstructions.bind(this);
  }

  componentDidMount() {
    const challenge = this.props.challenge;
    this.setState({
      startDate: challenge.fields['Start date'],
      endDate: challenge.fields['End date'],
      verified: challenge.fields['Verified'],
      individual: challenge.fields['Team Activity'] === 'no',
      rewardOccurrence: challenge.fields['Reward Occurrence'],
      activityTrackingType: challenge.fields['Activity Tracking Type'],
      trackingText: challenge.fields['Activity Goal Text'] ? challenge.fields['Activity Goal Text'] : '',
      activityGoal: challenge.fields['Activity Goal'] ? challenge.fields['Activity Goal'] : '',
      points: challenge.fields['Points'],
      title: challenge.fields['Title'],
      instructions: challenge.fields['Instructions'] ? challenge.fields['Instructions'].replace(/<[^>]*>/g, '') : '',
      description: challenge.fields['More Information Html']
    });
  }

  setTeamSizeVisible(visible) {
    this.setState({ teamSizeVisible: visible });
  }

  setUnitsVisible(e) {
    switch (e.target.value) {
      case 'Units':
      case 'Days':
        this.setState({ unitsVisible: true });
        break;
      case 'Event':
        this.setState({ unitsVisible: false });
        break;
    }
  }

  setStartDate(e) {
    this.setState({ startDate: e.target.value });
  }

  setEndDate(e) {
    this.setState({ endDate: e.target.value });
  }

  setVerified(e) {
    this.setState({ verified: e.target.value });
  }

  setIndividual(e) {
    this.setState({ individual: e.target.value });
  }

  setRewardOccurrence(e) {
    this.setState({ rewardOccurrence: e.target.value });
  }

  setActivityTrackingType(e) {
    this.setState({ activityTrackingType: e.target.value });
  }

  setTrackingText(e) {
    this.setState({ trackingText: e.target.value });
  }

  setActivityGoal(e) {
    this.setState({ activityGoal: e.target.value });
  }

  setPoints(e) {
    this.setState({ points: e.target.value });
  }

  setTitle(e) {
    this.setState({ title: e.target.value });
  }

  setInstructions(e) {
    this.setState({ instructions: e.target.value });
  }

  trackingDetails(challenge) {
      let activityGoalText = challenge.fields['Activity Goal Text'] ? challenge.fields['Activity Goal Text'] : 'complete the activity in the description';
      let trackingDetailsText = 'To complete this, ' + activityGoalText;
      let activityGoalNumber = challenge.fields['Activity Goal Text'];

      // TODO: add 'Activity Goal Text', plus If it has it, 'Activity Goal', 'Activity Tracking Type' and 'Reward Occurrence'
      if (challenge.fields['Activity Tracking Type']  === 'Event') {
        trackingDetailsText += '.';
      } else if (challenge.fields['Activity Tracking Type']  === 'Days') {
        trackingDetailsText += ' on at least ' + challenge.fields['Activity Goal'] + ' day ' + (challenge.fields['Reward Occurrence'] === 'Weekly' ? 'each week' : '') + '.';
      } else {
        trackingDetailsText += ' at least ' + challenge.fields['Activity Goal'] + ' ' + challenge.fields['Device Units'] + '.';
      }

      return trackingDetailsText;
  }

  saveUpdatedChallenge(updatedChallenge) {
    /* global $ */
    updatedChallenge.fields['Start date'] = this.state.startDate;
    updatedChallenge.fields['End date'] = this.state.endDate;
    updatedChallenge.fields['Verified'] = this.state.verified;
    updatedChallenge.fields['Team Activity'] = this.state.individual ? 'no' : 'yes';
    updatedChallenge.fields['Reward Occurrence'] = this.state.rewardOccurrence;
    updatedChallenge.fields['Activity Tracking Type'] = this.state.activityTrackingType;
    updatedChallenge.fields['Activity Goal Text'] = this.state.trackingText;
    updatedChallenge.fields['Activity Goal'] = this.state.activityGoal;
    updatedChallenge.fields['Points'] = this.state.points;
    updatedChallenge.fields['Title'] = this.state.title;
    updatedChallenge.fields['Instructions'] = this.state.instructions;
    updatedChallenge.fields['More Information Html'] = $('.description-text').html();
    updatedChallenge.fields['Content Changed'] = 'yes';

    // Delete computed fields
    delete updatedChallenge.fields['dif_filter'];
    delete updatedChallenge.fields['dif_weeks'];

    // Update Total Points based on points and frequency
    const start = moment(this.state.startDate);
    const end = moment(this.state.endDate);
    const dayDifference = end.diff(start, 'days');
    const weeks = Math.ceil(dayDifference / 7);

    switch (this.state.rewardOccurrence) {
      case 'Weekly':
        updatedChallenge.fields['Total Points'] = (this.state.points * weeks).toString();
        break;
      case 'Bi-weekly':
        updatedChallenge.fields['Total Points'] = (this.state.points * 26).toString();
        break;
      case 'Monthly':
        updatedChallenge.fields['Total Points'] = (this.state.points * 12).toString();
        break;
      case 'Unlimited':
        updatedChallenge.fields['Total Points'] = (this.state.points * 4).toString();
        break;
      default:
        updatedChallenge.fields['Total Points'] = this.state.points;
    }

    this.props.updateEditingChallenge(updatedChallenge);
  }

  render() {
    const challenge = this.props.challenge;
    const cannotModify = this.state.instructions === 'THIS TEXT CANNOT BE MODIFIED';
    console.log(challenge);

    return (
      <div id="editChallengeModal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="edit-challenge-modal-title">Challenge Preview</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img className="item-info-image" src={challenge.fields['Header Image']} />

              <div className="more-info-container">
                <h3>{challenge.fields['Title']}</h3>
                {this.trackingDetails(challenge)}
                <hr/>
                <h4>About this activity:</h4>
                <p dangerouslySetInnerHTML={{ __html: challenge.fields['Instructions'] }}></p>
                <p dangerouslySetInnerHTML={{ __html: challenge.fields['More Information Html'] }}></p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-link" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={(e) => this.saveUpdatedChallenge(challenge)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PreviewChallengeModal;
