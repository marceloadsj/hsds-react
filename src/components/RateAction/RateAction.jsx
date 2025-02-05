import React from 'react'
import PropTypes from 'prop-types'
import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import Emoticon from '../Emoticon'
import classNames from 'classnames'
import { RateActionUI } from './RateAction.css'
import { getName } from '../Emoticon/Emoticon.utils'

export class RateAction extends React.PureComponent {
  static className = 'c-RateAction'

  state = {
    isActive: this.props.isActive,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isActive !== this.state.isActive) {
      this.setState({
        isActive: nextProps.isActive,
      })
    }
  }

  handleOnClick = event => {
    this.setState({
      isActive: true,
    })

    this.props.onClick(event)
  }

  getClassName() {
    const { className, name, size } = this.props
    const { isActive } = this.state

    return classNames(
      RateAction.className,
      isActive && `is-active`,
      name && `is-${getName(name)}`,
      size && `is-${size}`,
      className
    )
  }

  render() {
    const {
      name,
      disabled,
      innerRef,
      size,
      onBlur,
      onFocus,
      withCircle,
      ...rest
    } = this.props

    return (
      <RateActionUI
        {...getValidProps(rest)}
        className={this.getClassName()}
        disabled={disabled}
        ref={innerRef}
        onBlur={this.handleOnBlur}
        onClick={this.handleOnClick}
        onFocus={this.handleOnFocus}
        name={name}
        size={size}
        withCircle={withCircle}
      >
        <Emoticon
          size={size}
          name={getName(name)}
          isActive={this.state.isActive}
          isDisabled={disabled}
        />
      </RateActionUI>
    )
  }
}

function noop() {}

RateAction.defaultProps = {
  'data-cy': 'RateAction',
  disabled: false,
  innerRef: noop,
  isActive: false,
  name: 'reaction-happy',
  onClick: noop,
  size: 'lg',
  withCircle: false,
}

RateAction.propTypes = {
  /** Custom class names to be added to the component. */
  className: PropTypes.string,
  /** Data attr for Cypress tests. */
  'data-cy': PropTypes.string,
  /** Determines the emoticon color. Default `true`. */
  isActive: PropTypes.bool,
  /** Disables the emoticon from interactions. Default `false`. */
  disabled: PropTypes.bool,
  /** Determines the Emoticon image. One of 'reaction-happy', 'reaction-sad', 'reaction-okay' */
  name: PropTypes.oneOf([
    'happy',
    'sad',
    'meh',
    'reaction-happy',
    'reaction-sad',
    'reaction-okay',
  ]),
  /** Adjusts the size of the component. One of 'lg', 'md', 'sm' */
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  /** Obtain the DOM node of the button */
  innerRef: PropTypes.func,
  /** Callback on click */
  onClick: PropTypes.func,
  /** Shows a big border around the icon */
  withCircle: PropTypes.bool,
}

export default RateAction
