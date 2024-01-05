import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {RiShoppingBagFill} from 'react-icons/ri'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const {history} = props

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-con">
      <Link to="/" className="nav-img-linkk">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-img"
        />
      </Link>
      <div className="header-con-pc">
        <ul className="nav-menu">
          <li className="nav-menu-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>
        <button type="button" className="nav-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="header-con-mob">
        <ul className="nav-menu-mob">
          <li className="nav-menu-item-mob">
            <Link to="/">
              <AiFillHome className="nav-link-mob" />
            </Link>
          </li>
          <li className="nav-menu-item-mob">
            <Link to="/jobs">
              <RiShoppingBagFill className="nav-link-mob" />
            </Link>
          </li>
          <li className="nav-menu-item-mob">
            <button
              onClick={onLogout}
              type="button"
              aria-label="logout-con"
              className="mob-btn"
            >
              <FiLogOut className="nav-link-mob" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
