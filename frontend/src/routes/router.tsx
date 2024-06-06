import { createBrowserRouter } from "react-router-dom"
import InstitutionRegistration from "../pages/insitution"
import Landing from "../pages/landing"
import ReceiverRegistration from "../pages/receiver"
import Root from "../shared/components/root"


const router = createBrowserRouter([
    {
      path: '/',
      element: <Root/>, 
      children: [
        {
          path: '/',
          element: <Landing/>
        }, 
        {
          path: '/registration/institution',
          element: <InstitutionRegistration/>
        },
        {
          path: '/registration/receiver',
          element: <ReceiverRegistration />
        },
      ] 
    }
  ]
)
  export { router }