import { faChevronLeft, faChevronRight, faClipboard, faShirt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import "./AdminSidePanel.css";
function AdminSidePanel({ defaultState = false }) {
  const [show, setShow] = useState(defaultState);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className='position-fixed start-0 z-2 sm-position-bottom pb-3' style={{ width: "50px" }}>
      <Button
        className='bg-transparent text-black shadow-none border-0 bg-danger-subtle rounded-start-0 side-button'
        onClick={handleShow}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} className='bg-danger-subtle'>
        <Offcanvas.Header className='d-flex justify-content-between'>
          <Offcanvas.Title>Menu</Offcanvas.Title>
          <Button className='bg-transparent text-black shadow-none border-0' onClick={handleClose}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavLink to='products' className='text-decoration-none' onClick={handleClose}>
            <Button className='bg-transparent text-black shadow-none border-0 w-100 hover-color-custom gap-2 d-flex align-items-center'>
              <span>Manage Products</span>
              <FontAwesomeIcon icon={faShirt} />
            </Button>
          </NavLink>

          <NavLink to='orders' className='text-decoration-none' onClick={handleClose}>
            <Button className='bg-transparent text-black shadow-none border-0 w-100 hover-color-custom gap-2 d-flex align-items-center'>
              <span>Manage Orders</span>
              <FontAwesomeIcon icon={faClipboard} />
            </Button>
          </NavLink>

          <NavLink to='users' className='text-decoration-none' onClick={handleClose}>
            <Button className='bg-transparent text-black shadow-none border-0 w-100 hover-color-custom gap-2 d-flex align-items-center'>
              <span>Manage Users</span>
              <FontAwesomeIcon icon={faUser} className='text-right' />
            </Button>
          </NavLink>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default AdminSidePanel;
