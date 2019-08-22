import * as React from 'react'

import {
  ComponentUI,
  InputUI,
  InputWrapperUI,
  OptionsWrapperUI,
  OptionsDropdownUI,
  TriggerUI,
  FocusIndicatorUI,
  ValidationIconUI,
  ValidationMessageUI,
} from './styles/EditableField.Input.css'

import Dropdown from '../Dropdown/DropdownV2'
import Icon from '../Icon'
import Truncate from '../Truncate'

import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import {
  ACTION_ICONS,
  findParentByClassName,
  isEllipsisActive,
  FIELDSTATES,
  FIELDTYPES,
  EDITABLEFIELD_CLASSNAMES,
  MASK_CLASSNAMES,
  INPUT_CLASSNAMES,
  OTHERCOMPONENTS_CLASSNAMES,
  TRUNCATED_CLASSNAMES,
  STATES_CLASSNAMES,
  COLOURS,
} from './EditableField.utils'
import { classNames } from '../../utilities/classNames'
import { key } from '../../constants/Keys'
import { noop } from '../../utilities/other'
import * as equal from 'fast-deep-equal'

import { InputProps, Validation } from './EditableField.types'

export class EditableFieldInput extends React.Component<InputProps> {
  static className = INPUT_CLASSNAMES.component
  static defaultProps = {
    disabled: false,
    fieldValue: '',
    isActive: false,
    inline: false,
    placeholder: '',
    state: FIELDSTATES.default,
    type: FIELDTYPES.text,
    innerRef: noop,
    onInputFocus: noop,
    onInputBlur: noop,
    onInputChange: noop,
    onOptionFocus: noop,
    onOptionSelection: noop,
    onChange: noop,
    onKeyDown: noop,
    deleteAction: noop,
    customAction: noop,
  }

  fieldInputContentRef: HTMLDivElement
  optionsDropdownRef: HTMLDivElement
  inputRef: HTMLInputElement

  setFieldInputContentNode = node => {
    this.fieldInputContentRef = node
  }

  setOptionsDropdownNode = node => {
    this.optionsDropdownRef = node
  }

  setInputNode = node => {
    this.inputRef = node
  }

  componentDidMount() {
    const { isActive } = this.props

    this.setInputTitle()

    if (isActive) {
      /* istanbul ignore next */
      if (document.activeElement !== this.optionsDropdownRef) {
        const inputNode = this.inputRef
        inputNode && inputNode.focus()
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!equal(this.props.fieldValue, nextProps.fieldValue)) {
      return true
    }

    if (this.props.isActive !== nextProps.isActive) {
      return true
    }

    if (this.props.disabled !== nextProps.disabled) {
      return true
    }

    if (this.props.state !== nextProps.state) {
      return true
    }

    return false
  }

  componentDidUpdate() {
    const { isActive } = this.props

    this.setInputTitle()

    if (isActive) {
      if (document.activeElement !== this.optionsDropdownRef) {
        const inputNode = this.inputRef

        inputNode && inputNode.focus()
      }
    }
  }

  setInputTitle = () => {
    const { fieldValue } = this.props
    const inputNode = this.inputRef
    const parentNode = findParentByClassName(
      inputNode,
      EDITABLEFIELD_CLASSNAMES.field
    )

    if (!parentNode) return

    const contentNode = parentNode.querySelector(
      `.${MASK_CLASSNAMES.value} .${OTHERCOMPONENTS_CLASSNAMES.truncateContent}`
    )
    const firstChunkNode = parentNode.querySelector(
      `.${MASK_CLASSNAMES.value} .${TRUNCATED_CLASSNAMES.firstChunk}`
    )

    /* istanbul ignore next */
    if (isEllipsisActive(contentNode) || isEllipsisActive(firstChunkNode)) {
      inputNode && inputNode.setAttribute('title', fieldValue.value)
    }
  }

  handleInputFocus = event => {
    const { name, onInputFocus } = this.props

    onInputFocus({ name, event })
  }

  handleInputBlur = event => {
    const { name, onInputBlur } = this.props
    const optionsNode = this.optionsDropdownRef

    /* istanbul ignore next */
    if (optionsNode && optionsNode.classList.contains('is-open')) return

    onInputBlur({ name, event })
  }

  handleOptionFocus = event => {
    const { disabled, name, onOptionFocus } = this.props
    /* istanbul ignore else */
    if (!disabled) {
      onOptionFocus({ name, event })
    }
  }

  handleChange = event => {
    const { onChange, onInputChange } = this.props

    onChange({
      inputValue: event.currentTarget.value,
      name: this.props.name,
      event,
    })
    /* istanbul ignore else */
    if (onInputChange) {
      onInputChange({
        inputValue: event.currentTarget.value,
        name: this.props.name,
        event,
      })
    }
  }

  handleKeyDown = event => {
    const isEnter = event.key === key.ENTER
    const isEscape = event.key === key.ESCAPE
    const isDropdownTrigger = event.target.classList.contains(
      OTHERCOMPONENTS_CLASSNAMES.dropdownTrigger
    )
    /* istanbul ignore else */
    if ((isEnter && !isDropdownTrigger) || isEscape) {
      const { name, onKeyDown } = this.props
      // const staticValueNode = this.staticValueRef
      const inputNode = this.inputRef

      onKeyDown({ event, name }).then(() => {
        // In case the value is longer than the width of the input
        // lets move the cursor to the very beginning
        // when clicking the input the cursor will be at the expected position :)
        /* istanbul ignore else */
        if (inputNode && inputNode.setSelectionRange) {
          inputNode.setSelectionRange(0, 0)
        }
      })
    }
  }

  handleDropdownSelect = selection => {
    const { name, onOptionSelection } = this.props

    onOptionSelection({ name, selection })
    this.optionsDropdownRef && this.optionsDropdownRef.focus()
  }

  renderOptions = () => {
    const { disabled, fieldValue, valueOptions } = this.props

    return (
      <OptionsWrapperUI
        className={INPUT_CLASSNAMES.optionsWrapper}
        onKeyDown={this.handleKeyDown}
      >
        <Dropdown
          className={INPUT_CLASSNAMES.dropdown}
          items={valueOptions}
          disabled={disabled}
          shouldRefocusOnClose={() => false}
          minWidth={75}
          maxWidth={200}
          onBlur={this.handleInputBlur}
          onFocus={this.handleOptionFocus}
          onSelect={this.handleDropdownSelect}
          triggerRef={this.setOptionsDropdownNode}
          renderTrigger={
            <TriggerUI className={INPUT_CLASSNAMES.optionsTrigger}>
              <OptionsDropdownUI className={INPUT_CLASSNAMES.optionsDropdown}>
                <Truncate className={INPUT_CLASSNAMES.selectedOption}>
                  {fieldValue.option}
                </Truncate>
                <Icon name={ACTION_ICONS.valueOption} />
              </OptionsDropdownUI>
              <FocusIndicatorUI className={INPUT_CLASSNAMES.focusIndicator} />
            </TriggerUI>
          }
        />
      </OptionsWrapperUI>
    )
  }

  renderValidationInfo = () => {
    const { state, validationInfo } = this.props

    if (state === FIELDSTATES.default) return null

    const DEFAULT_ICON = 'alert'

    return (
      <>
        <ValidationIconUI
          color={
            (validationInfo && validationInfo.color) || COLOURS.states[state]
          }
        >
          <Icon
            name={(validationInfo && validationInfo.icon) || DEFAULT_ICON}
          />
        </ValidationIconUI>
        <ValidationMessageUI>
          {validationInfo && validationInfo.message}
        </ValidationMessageUI>
      </>
    )
  }

  render() {
    const {
      disabled,
      fieldValue,
      isActive,
      inline,
      name,
      placeholder,
      state,
      type,
      valueOptions,
      ...rest
    } = this.props

    return (
      <ComponentUI
        className={classNames(
          INPUT_CLASSNAMES.content,
          inline && STATES_CLASSNAMES.isInline,
          state !== FIELDSTATES.default && STATES_CLASSNAMES.error
        )}
        innerRef={this.setFieldInputContentNode}
      >
        {valueOptions ? this.renderOptions() : null}

        <InputWrapperUI
          className={INPUT_CLASSNAMES.inputWrapper}
          placeholder={placeholder}
          value={fieldValue.value}
        >
          <InputUI
            {...getValidProps(rest)}
            className={INPUT_CLASSNAMES.input}
            id={name}
            innerRef={this.setInputNode}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            value={fieldValue.value}
            onBlur={this.handleInputBlur}
            onChange={this.handleChange}
            onFocus={this.handleInputFocus}
            onKeyDown={this.handleKeyDown}
          />

          {this.renderValidationInfo()}

          <FocusIndicatorUI
            className={INPUT_CLASSNAMES.focusIndicator}
            color={this.setFocusIndicatorColor()}
          />
        </InputWrapperUI>
      </ComponentUI>
    )
  }

  setFocusIndicatorColor = () => {
    const { validationInfo, state } = this.props

    let color = COLOURS.states[state]

    if (validationInfo && validationInfo.color) {
      color = validationInfo.color
    }

    return color
  }
}

export default EditableFieldInput
