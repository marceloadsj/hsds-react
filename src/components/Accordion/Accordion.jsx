import React, { createContext, useState, useEffect, useContext } from 'react'
import getValidProps from '@helpscout/react-utils/dist/getValidProps'
import AccordionBody from './Accordion.Body'
import AccordionHeading from './Accordion.Heading'
import AccordionLink from './Accordion.Link'
import AccordionSection from './Accordion.Section'
import AccordionSubheading from './Accordion.Subheading'
import AccordionTitle from './Accordion.Title'
import { classNames } from '../../utilities/classNames'
import { noop } from '../../utilities/other'
import { AccordionUI } from './Accordion.css'
import { stringifyArray } from './Accordion.utils'
import { PageContext } from '../Page/Page'
import Sortable from '../Sortable'
import { GlobalContext } from '../HSDS/Provider'

export const classNameStrings = {
  baseComponentClassName: 'c-Accordion',
  isAllowMultipleClassName: 'is-allow-multiple',
  isPageClassName: 'is-page',
  isSeamlessClassName: 'is-seamless',
  isSortableClassName: 'is-sortable',
  isSortingClassName: 'is-sorting',
}

const getComponentClassName = ({
  allowMultiple,
  className,
  isPage,
  isSeamless,
  isSorting,
  isSortable,
}) => {
  const {
    baseComponentClassName,
    isAllowMultipleClassName,
    isPageClassName,
    isSeamlessClassName,
    isSortableClassName,
    isSortingClassName,
  } = classNameStrings
  return classNames(
    baseComponentClassName,
    allowMultiple && isAllowMultipleClassName,
    isPage && isPageClassName,
    isSeamless && isSeamlessClassName,
    isSortable && isSortableClassName,
    isSorting && isSortingClassName,
    className
  )
}

export const getSortableProps = ({ distance, pressDelay }) => {
  return distance > 0 ? { distance } : { pressDelay }
}

const useSectionState = (originalState, allowMultiple) => {
  const [openSections, setOpenSections] = useState(originalState)

  const setSectionState = (uuid, isOpen) => {
    setOpenSections(isOpen ? [uuid] : [])
  }

  const setMultipleState = (uuid, isOpen) => {
    if (isOpen) {
      const newSections = [...openSections, uuid]
      setOpenSections(
        newSections.filter((item, pos) => newSections.indexOf(item) == pos)
      )
    } else {
      setOpenSections(openSections.filter(id => id !== uuid))
    }
  }

  return [openSections, allowMultiple ? setMultipleState : setSectionState]
}

export const AccordionContext = createContext(null)

const Accordion = props => {
  const {
    allowMultiple,
    children,
    duration,
    isPage: isPageProps,
    isSeamless: isSeamlessProps,
    isSortable,
    onSortEnd,
    openSectionIds,
    size,
    useWindowAsScrollContainer,
    ...rest
  } = props

  const [isSorting, setIsSorting] = useState(false)
  const [openSections, setSectionState] = useSectionState(
    openSectionIds,
    allowMultiple
  )

  const { accordion = {} } = useContext(PageContext)
  const { getCurrentScope } = React.useContext(GlobalContext) || {}

  const scope = getCurrentScope ? getCurrentScope() : null

  const isPage = accordion.isPage || isPageProps
  const isSeamless = accordion.isSeamless || isSeamlessProps

  const onClose = uuid => {
    props.onClose(uuid, openSections)
  }

  const onOpen = uuid => {
    props.onOpen(uuid, openSections)
  }

  const getContainer = () => {
    if (scope) {
      return document.querySelector(`.${scope}`)
    }

    return document.body
  }

  const contextValue = {
    duration,
    isPage,
    isSeamless,
    isSortable,
    isSorting,
    onClose,
    onOpen,
    // WARN: we use the internal state only if there is no outside method to update the list of open sections
    openSections: props.setSectionState ? openSectionIds : openSections,
    setSectionState: props.setSectionState || setSectionState,
    size,
  }

  let content = children
  if (isSortable) {
    content = (
      <Sortable
        helperClass="is-sorting-item"
        lockAxis="y"
        helperContainer={getContainer}
        onSortStart={() => setIsSorting(true)}
        onSortEnd={(...args) => {
          setIsSorting(false)
          onSortEnd(...args)
        }}
        useWindowAsScrollContainer={useWindowAsScrollContainer}
        {...getSortableProps(rest)}
      >
        {children}
      </Sortable>
    )
  }

  return (
    <AccordionUI
      {...getValidProps(rest)}
      className={getComponentClassName({
        ...props,
        isSeamless,
        isPage,
        isSortable,
        isSorting,
      })}
      role="tablist"
    >
      <AccordionContext.Provider value={contextValue}>
        {content}
      </AccordionContext.Provider>
    </AccordionUI>
  )
}

Accordion.defaultProps = {
  'data-cy': 'Accordion',
  distance: 5,
  isPage: false,
  isSeamless: false,
  isSortable: false,
  onClose: noop,
  onOpen: noop,
  onSortEnd: noop,
  openSectionIds: [],
  pressDelay: 0,
  size: 'md',
  useWindowAsScrollContainer: false,
}

Accordion.Body = AccordionBody
Accordion.Heading = AccordionHeading
Accordion.Link = AccordionLink
Accordion.Section = AccordionSection
Accordion.Subheading = AccordionSubheading
Accordion.Title = AccordionTitle

export default Accordion
