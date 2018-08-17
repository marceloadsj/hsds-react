// @flow
import React, { PureComponent as Component } from 'react'
import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import classNames from '../../utilities/classNames'
import FormGroup from '../FormGroup'
import { includes } from '../../utilities/arrays'
import { isComponentNamed, namespaceComponent } from '../../utilities/component'
import { createUniqueIDFactory } from '../../utilities/id'
import { isObject } from '../../utilities/is'
import { noop } from '../../utilities/other'
import { ChoiceGroupUI } from './styles/ChoiceGroup.css.js'
import { COMPONENT_KEY as RADIO_KEY } from '../Radio/utils'
import { COMPONENT_KEY as RADIOCARD_KEY } from '../RadioCard/utils'
import { COMPONENT_KEY } from './utils'

type Props = {
  align: 'horizontal' | 'vertical',
  className: string,
  children?: any,
  onBlur: (event: Event) => void,
  onChange: (event: Event) => void,
  onFocus: (event: Event) => void,
  multiSelect: boolean,
  name: string,
  value: any,
}

type State = {
  id: string,
  multiSelect: boolean,
  selectedValue: any,
}

const uniqueID = createUniqueIDFactory('ChoiceGroup')

class ChoiceGroup extends Component<Props, State> {
  static defaultProps = {
    align: 'vertical',
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
  }

  multiSelect: boolean = true

  constructor(props: Props) {
    super(props)

    this.state = {
      id: uniqueID(),
      multiSelect: false,
      selectedValue: props.value ? [].concat(props.value) : [],
    }
  }

  componentWillMount() {
    const child = this.props.children ? this.props.children[0] : false
    let multiSelect

    if (child) {
      multiSelect =
        !isComponentNamed(child, RADIO_KEY) &&
        !isComponentNamed(child, RADIOCARD_KEY)
    }
    // Override auto-setting based on children
    multiSelect =
      this.props.multiSelect !== undefined
        ? this.props.multiSelect
        : multiSelect

    multiSelect = !!multiSelect

    this.setState({ multiSelect })
    this.multiSelect = multiSelect
  }

  getMultiSelectValue(value: any) {
    const { selectedValue } = this.state
    const valueIndex = selectedValue.indexOf(value)

    if (valueIndex < 0) {
      return selectedValue.concat(value)
    }

    selectedValue.splice(valueIndex, 1)
    return selectedValue
  }

  handleOnChange = (value: any, checked: boolean) => {
    if (isObject(value) && value.target) return

    const { multiSelect } = this.state
    const selectedValue = multiSelect ? this.getMultiSelectValue(value) : value

    this.setState({ selectedValue })
    this.props.onChange(selectedValue)
  }

  getChildrenMarkup = () => {
    const { onBlur, onFocus, children, name } = this.props

    const { id, selectedValue } = this.state

    return (
      children &&
      React.Children.map(children, (child, index) => {
        return (
          <FormGroup.Choice key={`${id}-${index}`}>
            {React.cloneElement(child, {
              checked: includes(selectedValue, child.props.value),
              onBlur,
              onChange: this.handleOnChange,
              onFocus,
              name,
            })}
          </FormGroup.Choice>
        )
      })
    )
  }

  render() {
    const {
      align,
      className,
      children,
      onBlur,
      onChange,
      onFocus,
      multiSelect: multiSelectSetting,
      name,
      ...rest
    } = this.props

    const { id, multiSelect } = this.state
    const isMultiSelect = multiSelectSetting || multiSelect

    const componentClassName = classNames(
      'c-ChoiceGroup',
      align && `is-align-${align}`,
      isMultiSelect && 'is-multi-select',
      className
    )

    const childrenMarkup = this.getChildrenMarkup()

    return (
      <ChoiceGroupUI
        {...getValidProps(rest)}
        className={componentClassName}
        id={id}
      >
        {childrenMarkup}
      </ChoiceGroupUI>
    )
  }
}

namespaceComponent(COMPONENT_KEY)(ChoiceGroup)

export default ChoiceGroup
