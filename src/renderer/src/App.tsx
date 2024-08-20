import { NavigateFunction, RouterProvider } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { roots } from './routes/roots'

export const navigate: { current: NavigateFunction } = {
  current: () => {}
}

function App(): JSX.Element {
  useTheme()
  return (
    <>
      <RouterProvider router={roots} />
    </>
  )
}

export default App
