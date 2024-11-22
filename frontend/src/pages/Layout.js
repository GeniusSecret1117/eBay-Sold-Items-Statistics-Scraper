import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="container">
      {/* <nav className="navbar navbar-expand-sm bg-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li>
            <Link className="nav-link" to="/about">About</Link>
          </li>
        </ul>
      </nav> */}

      <Outlet />
    </div>
  )
};

export default Layout;