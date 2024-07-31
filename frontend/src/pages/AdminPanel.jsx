import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidePanel from "../components/AdminSidePanel";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import StyledHeading from "../components/StyledHeading";

function AdminPanel() {
  const userInfo = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();

  //Send unauthorized users back to homepage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    if (userInfo.token && !userInfo.isAdmin)
      setTimeout(() => {
        navigate("/");
      }, 2000);
  }, [userInfo]);

  return (
    <>
      <main className='my-4'>
        {userInfo.isAdmin ? (
          <>
            <AdminSidePanel defaultState={location.pathname === "/admin"} />
            <Container>
              <Outlet />
            </Container>
          </>
        ) : (
          <>
            <StyledHeading custom='bg-danger container' heading='Unauthorized' />
          </>
        )}
      </main>
    </>
  );
}

export default AdminPanel;
