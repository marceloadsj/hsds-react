// @flow
type InputNode = HTMLInputElement | HTMLTextAreaElement

export const COMPONENT_KEY = 'Input'
export const ADDON_COMPONENT_KEY = 'Input.AddOn'
export const STATIC_COMPONENT_KEY = 'Input.Static'

/**
 * Get the total number of lines (rows) of a textarea
 *
 * @param   {InputNode} textarea
 * @returns {number}
 */
export const getTextAreaLineTotal = (textarea: ?InputNode): number => {
  if (!textarea) return 0
  return textarea.value.split(/\r*\n/).length
}

/**
 * Get the current line (row) of the textarea based on cursor position.
 *
 * @param   {InputNode} textarea
 * @returns {number}
 */
export const getTextAreaLineCurrent = (textarea: ?InputNode): number => {
  if (!textarea) return 0
  return textarea.value.substr(0, textarea.selectionStart).split('\n').length
}

/**
 * Moves the cursor caret to the end of the Input value
 * Source: https://css-tricks.com/snippets/javascript/move-cursor-to-end-of-input/
 *
 * @param   {InputNode} inputNode
 */
export const moveCursorToEnd = (input: ?InputNode) => {
  // Extra failsafe guard
  if (!input) return
  if (typeof input.selectionStart === 'number') {
    input.selectionStart = input.selectionEnd = input.value.length
  } else if (typeof input.createTextRange !== 'undefined') {
    input.focus()
    // $FlowFixMe
    let range = input.createTextRange()
    range.collapse(false)
    range.select()
  }
}

/**
 * Check to see if Node is a textarea.
 *
 * @param   {HTMLElement} node
 * @returns {boolean}
 */
export function isTextArea(node: HTMLElement): boolean {
  return !!(node && node.tagName === 'TEXTAREA')
}
