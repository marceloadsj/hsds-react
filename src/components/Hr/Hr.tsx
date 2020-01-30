import * as React from 'react'
import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import { classNames } from '../../utilities/classNames'
import { HrUI } from './Hr.css'

export type HrSize = 'md' | 'sm' | 'xs' | 'none'

export interface Props {
  children?: any
  className?: string
  role: string
  size: HrSize
}

class Hr extends React.PureComponent<Props> {
  static defaultProps = {
    role: 'separator',
    size: 'md',
  }

  render() {
    const { className, children, role, size, ...rest } = this.props
    const componentClassName = classNames(
      'c-Hr',
      size && `is-${size}`,
      className
    )

    return (
      <HrUI
        {...getValidProps(rest)}
        className={componentClassName}
        role={role}
      />
    )
  }
}

export default Hr
