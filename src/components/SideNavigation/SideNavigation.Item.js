import React from 'react'

import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import { classNames } from '../../utilities/classNames'
import { noop } from '../../utilities/other'

import Icon from '../Icon'
import FadeInOut from './SideNavigation.FadeInOut'

import { ItemUI, ButtonUI, CountUI, IconUI } from './SideNavigation.css'

export const Item = ({
  children,
  className,
  iconName,
  count,
  href,
  active,
  muted,
  disabled,
  onClick,
  collapsed,
  danger,
  ...rest
}) => {
  const componentClassName = classNames(
    'c-SideNavigation__Item',
    active ? 'is-active' : '',
    muted ? 'is-muted' : '',
    disabled ? 'is-disabled' : '',
    danger ? 'is-danger' : '',
    className
  )

  const buttonClassName = classNames(
    danger ? 'is-danger' : '',
    active && !danger ? 'is-primary' : ''
  )

  return (
    <ItemUI {...getValidProps(rest)} className={componentClassName}>
      <ButtonUI
        href={href}
        disabled={disabled}
        onClick={onClick}
        className={buttonClassName}
      >
        {iconName && (
          <IconUI>
            <Icon name={iconName} size={24} />
          </IconUI>
        )}
        <FadeInOut>
          {children}
          {count && <CountUI>{count}</CountUI>}
        </FadeInOut>
      </ButtonUI>
    </ItemUI>
  )
}

Item.defaultProps = {
  active: false,
  danger: false,
  muted: false,
  disabled: false,
  onClick: noop,
}

export default Item
