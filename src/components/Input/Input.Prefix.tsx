import * as React from 'react'
import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import { classNames } from '../../utilities/classNames'
import { PrefixUI } from './Input.css'
import { InputPrefixProps } from './Input.types'

class Prefix extends React.PureComponent<InputPrefixProps> {
  static displayName = 'InputPrefix'

  static defaultProps = {
    isSeamless: false,
  }

  render() {
    const { className, isSeamless, ...rest } = this.props

    const componentClassName = classNames(
      'c-InputPrefix',
      'c-Input__item',
      'c-Input__prefix',
      isSeamless && 'is-seamless',
      className
    )

    return <PrefixUI {...getValidProps(rest)} className={componentClassName} />
  }
}

export default Prefix
