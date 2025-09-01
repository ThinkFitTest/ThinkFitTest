"use client"

import { useEffect } from "react"

export function useSecurity() {
  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) ||
        (e.ctrlKey && (e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && (e.key === "P" || e.key === "p")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j"))
      ) {
        e.preventDefault()
        return false
      }
    }

    const preventTextSelection = (e: Event) => {
      e.preventDefault()
      return false
    }

    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", preventRightClick)
    document.addEventListener("keydown", preventKeyboardShortcuts)
    document.addEventListener("selectstart", preventTextSelection)
    document.addEventListener("dragstart", preventDragDrop)

    return () => {
      document.removeEventListener("contextmenu", preventRightClick)
      document.removeEventListener("keydown", preventKeyboardShortcuts)
      document.removeEventListener("selectstart", preventTextSelection)
      document.removeEventListener("dragstart", preventDragDrop)
    }
  }, [])
}
