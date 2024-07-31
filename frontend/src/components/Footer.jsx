import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className='container-fluid bg-custom text-light py-3'>
      <div className='row text-center'>
        <div className='col-md-3'>
          <h4>
            <NavLink className='link-custom-unstyled' to='/products?filter=women'>
              Women
            </NavLink>
          </h4>
        </div>
        <div className='col-md-3'>
          <h4>
            <NavLink className='link-custom-unstyled' to='/products?filter=men'>
              Men
            </NavLink>
          </h4>
        </div>
        <div className='col-md-3'>
          <h4>
            <NavLink className='link-custom-unstyled' to='/products?filter=kids'>
              Kids
            </NavLink>
          </h4>
        </div>

        <div className='col-md-3'>
          <h4>Links</h4>
          <ul className='list-unstyled'>
            <li>
              <NavLink className='link-custom-unstyled' to='/'>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className='link-custom-unstyled' to='/login'>
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <hr className='m-2 border-3 mx-auto' style={{ width: "90%" }} />
      <p className='text-center p-2 pb-3'>Copyright ©TrendBlender 2024</p>
    </footer>
  );
}

export default Footer;
