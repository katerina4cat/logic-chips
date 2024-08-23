import Edit from '@renderer/pages/edit/Edit'
import Menu from '@renderer/pages/menu/Menu'
import NewSave from '@renderer/pages/newSave/NewSave'
import Options from '@renderer/pages/options/Options'
import Saves from '@renderer/pages/saves/Saves'
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
    path: '/Edit',
    element: <Edit />
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
])
