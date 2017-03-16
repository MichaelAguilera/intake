import Immutable from 'immutable'
import React from 'react'
import {ScreeningShowPage} from 'components/screenings/ScreeningShowPage'
import {shallow, mount} from 'enzyme'

describe('ScreeningShowPage', () => {
  describe('render', () => {
    const requiredProps = {
      actions: {fetchScreening: () => null},
      params: {id: '1'},
      participants: Immutable.List(),
      screening: Immutable.Map(),
    }

    it('renders the screening reference', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({reference: 'The Rocky Horror Picture Show'}),
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      expect(component.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the home and edit link', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      const homeLink = component.find({to: '/'})
      const editLink = component.find({to: '/screenings/1/edit'})
      expect(homeLink.html()).toContain('Home')
      expect(editLink.html()).toContain('Edit')
    })

    it('renders the screening information show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('ScreeningInformationCardView').props().mode).toEqual('show')
    })

    it('does not render the screening information show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('ScreeningInformationCardView').length).toEqual(0)
    })

    it('renders the incident information show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('IncidentInformationCardView').props().mode).toEqual('show')
    })

    it('does not render the incident information show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('IncidentInformationCardView').length).toEqual(0)
    })

    it('renders the decision show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('DecisionCardView').props().mode).toEqual('show')
    })

    it('does not render the decision show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('DecisionCardView').length).toEqual(0)
    })

    it('renders the cross report show card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('CrossReportShowView').length).toEqual(1)
    })

    it('renders the history card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('HistoryCard').length).toEqual(1)
    })

    it('renders the allegations card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('AllegationsShowView').length).toEqual(1)
    })

    it('renders the worker safety card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('WorkerSafetyShowView').length).toEqual(1)
    })

    describe('participants card', () => {
      it('renders the participants card for each participant', () => {
        const participants = Immutable.fromJS([
          {id: '1', first_name: 'Melissa', last_name: 'Powers'},
          {id: '2', first_name: 'Marshall', last_name: 'Powers'},
        ])
        const props = {
          actions: {fetchScreening: () => null},
          params: {id: '1'},
          participants,
          screening: Immutable.Map(),
        }
        const component = shallow(<ScreeningShowPage {...props} />)
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })
    })

    it('renders the narrative card after screening is loaded', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({report_narrative: 'this is a narrative report'}),
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      expect(component.find('NarrativeCardView').props().narrative).toEqual(
        'this is a narrative report'
      )
      expect(component.find('NarrativeCardView').props().mode).toEqual('show')
    })

    it('does not render the narrative card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('NarrativeCardView').length).toEqual(0)
    })
  })

  describe('componentDidMount', () => {
    const fetchScreening = jasmine.createSpy('fetchScreening')
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    beforeEach(() => {
      const props = {
        actions: {fetchScreening},
        params: {id: '222'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      fetchScreening.and.returnValue(promiseSpyObj)
      mount(<ScreeningShowPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      expect(fetchScreening).toHaveBeenCalledWith('222')
    })
  })

  describe('componentWillReceiveProps', () => {
    it('updates the component when screening is loaded', () => {
      const props = {
        actions: {},
        params: {},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      const component = shallow(<ScreeningShowPage {...props}/>)
      const screening = Immutable.fromJS({id: '1', reference: 'My New Reference'})
      component.setProps({screening})
      expect(component.find('h1').text()).toContain('My New Reference')
    })
  })

  describe('deleteParticipant', () => {
    let deleteParticipant
    let component

    beforeEach(() => {
      deleteParticipant = jasmine.createSpy('deleteParticipant')
      const props = {
        actions: {deleteParticipant},
        params: {id: '1'},
        participants: Immutable.List([
          Immutable.Map({id: '1', screening_id: '1'}),
          Immutable.Map({id: '2', screening_id: '1'}),
        ]),
        screening: Immutable.Map(),
      }
      component = shallow(<ScreeningShowPage {...props} />)
    })

    it('calls the deleteParticipant action', () => {
      component.instance().deleteParticipant('1')
      expect(deleteParticipant).toHaveBeenCalledWith('1')
    })
  })

  describe('cardSave', () => {
    let component
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const props = {
        actions: {saveScreening},
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      component = shallow(<ScreeningShowPage {...props} />)
      component.instance().setField(['report_narrative'], 'This is my new narrative')
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'])
      expect(saveScreening).toHaveBeenCalledWith({report_narrative: 'This is my new narrative'})
    })
  })
})
