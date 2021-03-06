import Immutable from 'immutable'
import React from 'react'
import DecisionEditView from 'components/screenings/DecisionEditView'
import {shallow, mount} from 'enzyme'
import SCREENING_DECISION_OPTIONS from 'ScreeningDecisionOptions'

describe('conditional decision options', () => {
  let component
  beforeEach(() => {
    const props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      screening: Immutable.fromJS({
        screening_decision: 'promote_to_referral',
        screening_decision_detail: 'immediate',
      }),
    }
    component = mount(<DecisionEditView {...props} />)
  })

  it('renders input for Differential response', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'differential_response',
      screening_decision_detail: 'Service name text',
    })})
    expect(component.find('#decisionDetail').props().value).toEqual('Service name text')
    expect(component.find('#decisionDetail').props().maxLength).toEqual('64')
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Service name')
  })
  it('renders input for Information to child welfare services', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'information_to_child_welfare_services',
      screening_decision_detail: 'Staff name text',
    })})
    expect(component.find('#decisionDetail').props().value).toEqual('Staff name text')
    expect(component.find('#decisionDetail').props().maxLength).toEqual('64')
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Staff name')
  })
  it('renders options for Promote to referral', () => {
    const options = component.find('#decisionDetail').find('option')
    const optionList = Object.keys(SCREENING_DECISION_OPTIONS.promote_to_referral.values).map((key) => (
      SCREENING_DECISION_OPTIONS.promote_to_referral.values[key]
    ))
    options.map((option) => {
      if (option.props().value) {
        expect(optionList).toContain(option.props().children)
      }
    })
    expect(options.length).toEqual(optionList.length + 1)
    expect(component.find('#decisionDetail').props().required).toEqual(true)
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Response time')
  })
  it('renders options for Screen out', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'screen_out',
      screening_decision_detail: 'Consultation',
    })})
    const optionList = Object.keys(SCREENING_DECISION_OPTIONS.screen_out.values).map((key) => (
      SCREENING_DECISION_OPTIONS.screen_out.values[key]
    ))
    const options = component.find('#decisionDetail').find('option')
    options.map((option) => {
      if (option.props().value) {
        expect(optionList).toContain(option.props().children)
      }
    })
    expect(options.length).toEqual(optionList.length + 1)
    expect(component.find('#decisionDetail').props().required).toBeFalsy()
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Category')
  })

  it('renders non-required Staff name field for Information to child welfare services', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'information_to_child_welfare_services',
    })})
    expect(component.find('#decisionDetail').props().required).toBeFalsy()
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Staff name')
  })

  it('renders non-required Service name field for Differential response', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'differential_response',
    })})
    expect(component.find('#decisionDetail').props().required).toBeFalsy()
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Service name')
  })
})

describe('DecisionEditView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      screening: Immutable.fromJS({
        screening_decision: 'differential_response',
        additional_information: 'more info',
        screening_decision_detail: 'Name of the service',
      }),
    }
    component = shallow(<DecisionEditView {...props} />)
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toEqual('Decision')
  })

  it('renders the report narrative label as required', () => {
    expect(component.find('SelectField[label="Screening Decision"]').props().required)
      .toEqual(true)
  })

  it('renders the input fields', () => {
    expect(component.find('SelectField[label="Screening Decision"]').props().value)
      .toEqual('differential_response')
    expect(component.find('InputField[label="Service name"]').props().value)
      .toEqual('Name of the service')
    expect(component.find('SelectField[label="Category"]').length).toEqual(0)
    expect(component.find('textarea#additional_information').props().value)
      .toEqual('more info')
  })

  it('displays a select list when the decision option requires one', () => {
    props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      screening: Immutable.fromJS({
        screening_decision: 'screen_out',
        screening_decision_detail: 'Consultation',
      }),
    }
    component = shallow(<DecisionEditView {...props} />)
    expect(component.find('SelectField[label="Category"]').length).toEqual(1)
    expect(component.find('InputField[label="Service name"]').length).toEqual(0)
  })

  it('renders the save button', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  it('fires the onChange call when a field changes', () => {
    component.find('#additional_information').simulate('change', {target: {value: 'the decision is taken'}})
    expect(props.onChange).toHaveBeenCalledWith(['additional_information'], 'the decision is taken')
  })

  it('calls onSave', () => {
    component = shallow(<DecisionEditView {...props} />)
    component.find('.btn.btn-primary').simulate('click')
    expect(props.onSave).toHaveBeenCalled()
  })

  it('calls onCancel', () => {
    component = shallow(<DecisionEditView {...props} />)
    component.find('.btn.btn-default').simulate('click')
    expect(props.onCancel).toHaveBeenCalled()
  })
})
