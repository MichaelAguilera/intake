import PropTypes from 'prop-types'
import React from 'react'
import PHONE_NUMBER_TYPE from 'PhoneNumberType'
import InputField from 'components/common/InputField'
import SelectField from 'components/common/SelectField'

const PhoneNumberField = ({Number, Type, onChange}) => (
  <div>
    <InputField
      gridClassName='col-md-6'
      id='number'
      type='tel'
      placeholder='Ex: 910-435-3223'
      label='Phone Number'
      value={Number}
      onChange={(event) => onChange('number', event.target.value)}
    />
    <SelectField
      gridClassName='col-md-6'
      label='Phone Number Type'
      id='type'
      value={Type}
      onChange={(event) => onChange('type', event.target.value || null)}
    >
      <option key='' />
      {
        PHONE_NUMBER_TYPE.map((item) => <option key={item} value={item}>{item}</option>)
      }
    </SelectField>
  </div>
)
PhoneNumberField.propTypes = {
  Number: PropTypes.string,
  Type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}
export default PhoneNumberField
