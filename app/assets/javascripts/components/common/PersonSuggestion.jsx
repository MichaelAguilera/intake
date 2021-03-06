import AddressInfo from 'components/common/AddressInfo'
import AgeInfo from 'components/common/AgeInfo'
import GenderRaceAndEthnicity from 'components/common/GenderRaceAndEthnicity'
import Languages from 'components/common/LanguageInfo'
import NAME_SUFFIXES from 'NameSuffixes'
import PropTypes from 'prop-types'
import React from 'react'
import PhoneNumberInfo from 'components/common/PhoneNumberInfo'
import sanitizeHtml from 'sanitize-html'

const PersonSuggestion = ({firstName, lastName, middleName, nameSuffix, dateOfBirth, gender, languages, races, ethnicity, ssn, address, phoneNumber}) => {
  const fullName = [firstName, middleName, lastName, NAME_SUFFIXES[nameSuffix]].filter(Boolean).join(' ')
  const sanitizedField = (field) => ({
    dangerouslySetInnerHTML: {
      __html: sanitizeHtml(field, {allowedTags: ['em']}),
    },
  })
  return (
    <div className='row'>
      <div className='col-md-2'>
        <img src='/assets/default-profile.svg' />
      </div>
      <div className='col-md-4'>
        <strong {...sanitizedField(fullName)} />
          <GenderRaceAndEthnicity gender={gender} races={races} ethnicity={ethnicity} />
          <AgeInfo dateOfBirth={dateOfBirth} />
          <Languages languages={languages} />
          {
            ssn && <div>
              <strong className='c-gray half-pad-right'>SSN</strong>
              <span {...sanitizedField(ssn)} />
            </div>
          }
        </div>
        <div className='col-md-6'>
          {address && <AddressInfo {...address} /> }
          {phoneNumber && <PhoneNumberInfo {...phoneNumber} />}
        </div>
      </div>
  )
}

PersonSuggestion.propTypes = {
  address: PropTypes.object,
  dateOfBirth: PropTypes.string,
  ethnicity: PropTypes.object,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  languages: PropTypes.array,
  lastName: PropTypes.string,
  middleName: PropTypes.string,
  nameSuffix: PropTypes.string,
  phoneNumber: PropTypes.object,
  races: PropTypes.array,
  ssn: PropTypes.string,
}

export default PersonSuggestion
