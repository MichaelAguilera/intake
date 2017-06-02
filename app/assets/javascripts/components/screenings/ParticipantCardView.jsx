import ParticipantEditView from 'components/screenings/ParticipantEditView'
import ParticipantShowView from 'components/screenings/ParticipantShowView'
import PropTypes from 'prop-types'
import React from 'react'
import Validator from 'validatorjs'

export default class ParticipantCardView extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      mode: this.props.mode,
    }
    this.validationRules = {
      ssn: [
        'regex:/^\\d{3}-\\d{2}-\\d{4}$/'
      ],
    }
    this.validationMessages = {
      'regex.ssn':'The social security number is fewer than 9 characters',
    }
    this.validate = () => {
      this.validation = new Validator(this.props.participant.toJS(), this.validationRules, this.validationMessages)
      return this.validation.passes()
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.props.participant.get('id'))
  }

  onSave() {
    this.props.onSave(this.props.participant)
    this.setState({mode: 'show'})
  }

  onChange(fieldSeq, value) {
    const participant = this.props.participant.setIn(fieldSeq, value)
    this.props.onChange(this.props.participant.get('id'), participant)
  }

  render() {
    const {mode} = this.state

    const sharedProps = {
      onDelete: this.props.onDelete,
      participant: this.props.participant,
      validate: this.validate,
      validation: this.validation,
    }

    const allProps = {
      edit: {
        onCancel: this.onCancel,
        onChange: this.onChange,
        onSave: this.onSave,
      },
      show: {
        onEdit: this.onEdit,
      },
    }

    const ParticipantView = (mode === 'edit') ? ParticipantEditView : ParticipantShowView
    const props = Object.assign(allProps[mode], sharedProps)
    return <ParticipantView {...props} />
  }
}

ParticipantCardView.propTypes = {
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  participant: PropTypes.object.isRequired,
}
