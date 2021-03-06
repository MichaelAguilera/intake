import * as Immutable from 'immutable'
import HistoryCard from 'components/screenings/HistoryCard'
import React from 'react'
import {shallow, mount} from 'enzyme'
import clipboard from 'clipboard-js'

describe('HistoryCard', () => {
  const requiredProps = {
    actions: {},
    involvements: Immutable.fromJS({screenings: [], referrals: [], cases: []}),
    participants: Immutable.List(),
    screeningId: '33',
  }

  describe('#componentDidMount', () => {
    let fetchHistoryOfInvolvements

    beforeEach(() => {
      fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
    })

    describe('when participants are not empty', () => {
      it('fetches history of involvements', () => {
        const props = {
          ...requiredProps,
          actions: {fetchHistoryOfInvolvements},
          participants: Immutable.fromJS([
            {id: 1},
            {id: 2},
          ]),
        }
        mount(<HistoryCard {...props}/>)
        expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith(props.screeningId)
      })
    })

    describe('when participants are empty', () => {
      it('does not fetch history of involvements', () => {
        const props = {
          ...requiredProps,
          actions: {fetchHistoryOfInvolvements},
          participants: Immutable.List(),
        }
        mount(<HistoryCard {...props}/>)
        expect(fetchHistoryOfInvolvements).not.toHaveBeenCalled()
      })
    })
  })

  describe('#componentWillReceiveProps', () => {
    let component
    let fetchHistoryOfInvolvements

    beforeEach(() => {
      fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
      const props = {
        ...requiredProps,
        actions: {fetchHistoryOfInvolvements},
        participants: Immutable.List(),
      }
      component = shallow(<HistoryCard {...props}/>)
    })

    describe('when participants change', () => {
      beforeEach(() => {
        const updatedProps = {
          participants: Immutable.fromJS([
            {id: 1},
            {id: 2},
          ]),
        }
        component.setProps(updatedProps)
      })

      it('fetches history of involvements', () => {
        expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith(requiredProps.screeningId)
      })
    })

    describe('when participants are the same', () => {
      beforeEach(() => {
        const updatedProps = {participants: Immutable.List()}
        component.setProps(updatedProps)
      })

      it('does not fetch history of involvements', () => {
        expect(fetchHistoryOfInvolvements).not.toHaveBeenCalled()
      })
    })
  })

  describe('copy button', () => {
    const involvements = Immutable.fromJS({screenings: [Immutable.fromJS({id: 1})]})
    it('does not render if there are no involvements', () => {
      const component = shallow(<HistoryCard {...requiredProps} />)
      expect(component.find('button[children="Copy"]').length).toEqual(0)
    })
    it('has an onClick callback', () => {
      const component = shallow(<HistoryCard {...requiredProps} involvements={involvements} />)
      const copyButton = component.find('button[children="Copy"]')
      expect(copyButton.props().onClick).toEqual(jasmine.any(Function))
    })
    it('calls the clipboard library', () => {
      const copySpy = spyOn(clipboard, 'copy').and.callThrough()
      const wrapper = mount(<HistoryCard {...requiredProps} involvements={involvements} />)
      const resultsTable = wrapper.find('table').node
      wrapper.find('button[children="Copy"]').simulate('click')
      expect(copySpy).toHaveBeenCalledWith({
        'text/plain': resultsTable.innerText,
        'text/html': resultsTable.outerHTML,
      })
    })
  })

  describe('#render', () => {
    it("renders 'Add a person...' Copy when no involvements are present", () => {
      const component = shallow(<HistoryCard {...requiredProps}/>)
      expect(component.find('table').length).toEqual(0)
      expect(component.text()).toContain('Add a person in order to see History of Involvement')
    })

    it('does not render table when no involvements are present', () => {
      const component = shallow(<HistoryCard {...requiredProps}/>)
      expect(component.find('table').length).toEqual(0)
    })

    it('renders table headings when there are involvements', () => {
      const involvements = Immutable.fromJS({screenings: [{}]})
      const props = {...requiredProps, involvements}
      const component = shallow(<HistoryCard {...props}/>)

      const tr = component.find('thead tr')
      expect(tr.text()).toContain('Date')
      expect(tr.text()).toContain('Type/Status')
      expect(tr.text()).toContain('County/Office')
      expect(tr.text()).toContain('People and Roles')
    })

    it('renders screenings, if present', () => {
      const involvements = Immutable.fromJS({screenings: [{}]})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const screeningCards = component.find('HistoryCardScreening')
      expect(screeningCards.length).toEqual(1)
    })

    it('does not render screenings if empty', () => {
      const involvements = Immutable.fromJS({screenings: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const screeningCards = component.find('HistoryCardScreening')
      expect(screeningCards.length).toEqual(0)
    })

    it('renders referrals, if present', () => {
      const involvements = Immutable.fromJS({referrals: [{}]})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const referralCards = component.find('HistoryCardReferral')
      expect(referralCards.length).toEqual(1)
    })

    it('does not render referrals if empty', () => {
      const involvements = Immutable.fromJS({referrals: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const referralCards = component.find('HistoryCardReferral')
      expect(referralCards.length).toEqual(0)
    })

    it('renders cases, if present', () => {
      const involvements = Immutable.fromJS({cases: [{}]})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const caseCards = component.find('HistoryCardCase')
      expect(caseCards.length).toEqual(1)
    })

    it('does not render cases if empty', () => {
      const involvements = Immutable.fromJS({cases: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const caseCards = component.find('HistoryCardCase')
      expect(caseCards.length).toEqual(0)
    })
  })
})
