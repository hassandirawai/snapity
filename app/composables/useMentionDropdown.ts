import type { MentionItem } from '~/types/mention'

export interface MentionDropdownState {
  isOpen: boolean
  isLoading: boolean
  items: MentionItem[]
  selectedIndex: number
  command: ((item: MentionItem) => void) | null
  x: number
  y: number
  getReferenceRect: (() => DOMRect | null | undefined) | null
}

export function useMentionDropdown() {
  const state = useState<MentionDropdownState>(
    'mention-dropdown',
    () => ({
      isOpen: false,
      isLoading: false,
      items: [],
      selectedIndex: 0,
      command: null,
      x: 0,
      y: 0,
      getReferenceRect: null,
    }),
  )

  return {
    state,
  }
}
