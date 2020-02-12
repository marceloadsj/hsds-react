import styled from '../../styled'
import { isHSApp } from '../../../styles/utilities/theme'
import Animate from '../../Animate'
import Card from '../../Card'

export const config = {
  closeOffset: '10px',
  offset: '8px',
  wrapperMaxHeight: '98%',
  wrapperMaxWidth: '75%',
  theme: {
    app: {
      marginTop: '50px',
      marginBottom: '30px',
      maxWidth: '560px',
    },
  },
}

export const ModalUI = styled('div')`
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  min-height: 0;
  left: 0;
  padding: ${config.offset};
  position: fixed;
  right: 0;
  top: 0;

  &.v2.is-danger {
    .c-Icon {
      color: #e52f28;
    }
  }

  &.v2.is-default {
    .c-ModalBody {
      padding: 40px 90px 50px;
    }
  }

  &.v2.is-branded {
    .c-ModalBody {
      margin: 0px 90px 50px;
      text-align: center;
    }
  }

  &.v2.is-alert {
    .c-ModalBody {
      margin: 0px 90px 50px;
      text-align: center;
    }
  }
`

export const InnerWrapperUI = styled('div')`
  display: flex;
  justify-content: center;
  max-height: ${config.wrapperMaxHeight};
  max-width: ${config.wrapperMaxWidth};
  min-height: 0;
  position: relative;
  width: auto;
  z-index: 1;

  ${props => makeHSAppInnerWrapperStyles(props)};

  &.v2 {
    position: absolute;
    top: 50px;
    width: 680px;
    min-height: 400px;

    &.is-alert {
      min-height: 179px;
    }
  }
`

export const AnimatedCardContainerUI = styled(Animate)`
  display: flex;
  max-width: 100%;
  min-height: 0;
`

export const CardUI = styled(Card)`
  border: none;
  box-shadow: rgba(42, 59, 71, 0.1) 0px 1px 1px,
    rgba(42, 59, 71, 0.25) 0px 10px 30px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  outline: none;
  overflow: hidden;

  &.is-alert {
    min-width: 440px;
  }
`

export const CloseUI = styled('div')`
  position: absolute;
  right: ${config.closeOffset};
  top: ${config.closeOffset};
  transform: translateZ(0);
  z-index: 3;
`

function makeHSAppInnerWrapperStyles(props) {
  if (!isHSApp(props)) return ''

  return `
    margin-bottom: ${config.theme.app.marginBottom};
    margin-top: ${config.theme.app.marginTop};
    max-height: calc(
      ${config.wrapperMaxHeight} -
      ${config.theme.app.marginTop} -
      ${config.theme.app.marginBottom}
    );
    max-width: ${config.theme.app.maxWidth};
  `
}

export default ModalUI
