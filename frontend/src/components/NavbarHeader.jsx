import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import "./NavbarHeader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NavDropdown } from "react-bootstrap";

function NavbarHeader() {
  return (
    <Navbar expand='lg' className='bg-success-subtle px-4'>
      <Navbar.Toggle
        aria-controls='basic-navbar-nav'
        className='nav-button-custom hover-color-custom border-0 shadow-none text-light p-2 px-3 my-2'
      >
        <FontAwesomeIcon icon={faBars} />
      </Navbar.Toggle>
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='m-auto'>
          <NavLink className='nav-link hover-color-custom rounded px-2' to='/'>
            Home
          </NavLink>
          <NavLink className='nav-link hover-color-custom rounded px-2' to='/products'>
            All Products
          </NavLink>

          <NavDropdown title='Categories' id='nav-dropdown'>
            <NavLink className='nav-link hover-color-custom rounded px-2' to='/products?filter=men'>
              Men
            </NavLink>
            <NavLink className='nav-link hover-color-custom rounded px-2' to='/products?filter=women'>
              Women
            </NavLink>
            <NavLink className='nav-link hover-color-custom rounded px-2' to='/products?filter=kids'>
              Kids
            </NavLink>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarHeader;
