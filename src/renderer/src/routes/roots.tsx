import Menu from '@renderer/pages/menu/Menu'
import NewSave from '@renderer/pages/newSave/NewSave'
import Options from '@renderer/pages/options/Options'
import Saves from '@renderer/pages/saves/Saves'
import Test from '@renderer/pages/test/Test'
import { createBrowserRouter, Navigate } from 'react-router-dom'

export const roots = createBrowserRouter([
  {
    path: '/',
    element: <Menu />
  },
  {
    path: '/NewGame',
    element: <NewSave />
  },
  {
    path: '/Saves',
    element: <Saves />
  },
  {
    path: '/Options',
    element: <Options />
  },
  {
    path: '/Test',
    element: <Test />
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
])
