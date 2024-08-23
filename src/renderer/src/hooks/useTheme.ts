import { useLayoutEffect, useState } from 'react'

export const useTheme = (): [string, React.Dispatch<React.SetStateAction<string>>, () => void] => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('app-theme') || 'dark')
  const swapTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('app-theme', theme)
  }, [theme])

  return [theme, setTheme, swapTheme]
}
