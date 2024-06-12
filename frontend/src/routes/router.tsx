import { createBrowserRouter } from 'react-router-dom';
import InstitutionRegistration from '../pages/insitution';
import Landing from '../pages/landing';
import ReceiverRegistration from '../pages/receiver';
import Root from '../shared/components/root';
import AddRecord from '../pages/add_record';
import VerifyStatus from '../pages/verify_status';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/registration/institution',
        element: <InstitutionRegistration />,
      },
      {
        path: '/registration/receiver',
        element: <ReceiverRegistration />,
      },
      {
        path: '/record/add',
        element: <AddRecord />,
      },
      {
        path: '/record/verify',
        element: <VerifyStatus />,
      },
    ],
  },
]);
export { router };
