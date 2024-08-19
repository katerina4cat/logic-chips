import { RouterProvider } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { roots } from './routes/roots'

function App(): JSX.Element {
  const [theme, setTheme] = useTheme()
  return (
    <>
      <RouterProvider router={roots} />
    </>
  )
}

export default App
