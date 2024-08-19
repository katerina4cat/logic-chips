import Menu from '@renderer/pages/menu/Menu'
import NewSave from '@renderer/pages/newSave/NewSave'
import { createBrowserRouter } from 'react-router-dom'

export const roots = createBrowserRouter([
  {
    path: '/',
    element: <Menu />
  },
  {
    path: '/NewSave',
    element: <NewSave />
  }
])
