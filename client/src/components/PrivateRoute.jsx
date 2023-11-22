import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'; // to show the cildren of the current user that is profile section
//It is to add the functionality if the user has not sign in then he she cannot access the profile page
export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
  
}
