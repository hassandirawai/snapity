import type { MentionItem } from '~/types/mention'
import { Node, nodeInputRule } from '@tiptap/core'
import Mention from '@tiptap/extension-mention'

export function createMentionExtension() {
  const { state } = useMentionDropdown()

  return Mention
    .extend({
      atom: true,
      addKeyboardShortcuts() {
        return {
          ArrowLeft: () => {
            const { selection } = this.editor.state

            const { $from } = selection

            const nodeBefore = $from.nodeBefore

            if (nodeBefore?.type.name === 'mention') {
              const pos = $from.pos - nodeBefore.nodeSize

              this.editor.commands.setTextSelection(pos)

              return true
            }

            return false
          },

          ArrowRight: () => {
            const { selection } = this.editor.state

            const { $from } = selection

            const nodeAfter = $from.nodeAfter

            if (nodeAfter?.type.name === 'mention') {
              const pos = $from.pos + nodeAfter.nodeSize

              /* console.warn({
                pos: $from.pos + nodeAfter.nodeSize,
              }) */

              this.editor.commands.setTextSelection(pos)

              return true
            }

            return false
          },
        }
      },
    })
    .configure({
      HTMLAttributes: {
        class: 'mention rounded-md bg-primary/10 px-1 py-0.5 text-primary font-medium cursor-pointer',
      },

      suggestion: {
        char: '@',
        startOfLine: false,
        allowedPrefixes: [' ', '\n'],

        items: async ({ query }) => {
          if (!query.trim().length) {
            return []
          }

          state.value.isLoading = true
          const usersData = await useMentionableUsers(query)

          state.value.isLoading = false
          return usersData.map(userData => ({
            id: userData.id,
            username: userData.username,
            fullName: userData.fullName,
            avatar: userData.avatar,
          }))
        },

        render: () => ({
          onStart({ editor, clientRect, items, range }) {
            const cursorPosition = clientRect?.()

            if (!cursorPosition) {
              return
            }

            state.value.isOpen = true
            state.value.items = items
            state.value.selectedIndex = 0
            state.value.x = cursorPosition.left
            state.value.y = cursorPosition.bottom + 8
            state.value.getReferenceRect = clientRect ?? null

            state.value.command = ({ id, username }: MentionItem) => {
              if (!range) {
                return
              }

              editor
                .chain()
                .focus()
                .insertContentAt(range, [{
                  type: 'mention',
                  attrs: { id, label: username },
                }])
                .run()

              state.value.isOpen = false
            }
          },
          onUpdate: ({ editor, range, items, clientRect }) => {
            state.value.items = items

            state.value.command = ({ id, username }: MentionItem) => {
              if (!range) {
                return
              }

              editor
                .chain()
                .focus()
                .insertContentAt(range, [{
                  type: 'mention',
                  attrs: { id, label: username },
                }])
                .run()

              state.value.isOpen = false
            }

            const cursorPosition = clientRect?.()

            if (!cursorPosition) {
              return
            }

            state.value.x = cursorPosition.left
            state.value.y = cursorPosition.bottom + 8
            state.value.getReferenceRect = clientRect ?? null
          },
          onKeyDown({ event }) {
            if (event.key === 'Escape') {
              state.value.isOpen = false

              return true
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()

              state.value.selectedIndex
                = (state.value.selectedIndex + (state.value.items.length - 1))
                  % state.value.items.length

              return true
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault()

              state.value.selectedIndex
                = (state.value.selectedIndex + 1)
                  % state.value.items.length

              return true
            }

            if (event.key === 'Enter') {
              event.preventDefault()

              const item = state.value.items[state.value.selectedIndex]

              if (item) {
                state.value.command?.(item)
              }

              return true
            }

            return false
          },
          onExit() {
            state.value.isOpen = false
            state.value.selectedIndex = 0
            state.value.getReferenceRect = null
            state.value.items = []
          },
        }),
      },
    })
}

export function createHashtagExtenstion() {
  return Node.create({
    name: 'hashtag',
    group: 'inline',
    inline: true,
    // atom: true,

    addAttributes() {
      return {
        tag: {
          default: null,
        },
      }
    },

    parseHTML() {
      return [{
        tag: 'span[data-type="hashtag"]',
      }]
    },

    renderHTML({ HTMLAttributes }) {
      return [
        'span',
        {
          ...HTMLAttributes,
          'data-type': 'hashtag',
        },
        `#${HTMLAttributes.tag}`,
      ]
    },

    addInputRules() {
      return [
        nodeInputRule({
          find: /#(\w+)$/,
          type: this.type,
          getAttributes: (match) => {
            console.warn(match)

            return {
              tag: match[1],
            }
          },
        }),
      ]
    },
  })
}
