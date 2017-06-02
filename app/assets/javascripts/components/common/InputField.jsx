import MaskedInput from 'react-maskedinput'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const InputField = ({gridClassName, labelClassName, id, label, onChange, value, placeholder, type, maxLength, mask, blurPlaceholder, focusPlaceholder, errorMessages}) => {
  let input = (<input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}/>)

  if (!_.isEmpty(errorMessages)) {
    gridClassName = `${gridClassName} input-error`.trim()
    labelClassName = `${labelClassName} input-error-label`.trim()
  }

  if (!_.isEmpty(mask)) {
    input =
      <MaskedInput id={id} type={type} value={value} mask={mask} placeholder={placeholder}
        onBlur={(event) => {
          event.target.placeholder = blurPlaceholder
        }}
        onFocus={(event) => {
          event.target.placeholder = focusPlaceholder
        }}
        onChange={onChange}
      />
  }

  let errorDisplay
  if (!_.isEmpty(errorMessages)) {
    errorDisplay = errorMessages.map((errorMessage, key) => <span key={key} className='input-error-message'>{errorMessage}</span>)
  }

  return (
    <div className={gridClassName}>
      <label className={labelClassName} htmlFor={id}>{label}</label>
      {input}
      {errorDisplay}
    </div>
  )
}

InputField.defaultProps = {
  type: 'text',
  mask: '',
  errorMessages: [],
}
InputField.propTypes = {
  blurPlaceholder: PropTypes.string,
  focusPlaceholder: PropTypes.string,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  errorMessages: PropTypes.array,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  mask: PropTypes.string,
  maxLength: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
export default InputField
