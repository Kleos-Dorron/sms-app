import React from 'react';
import { Navbar, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink, NavItem, UncontrolledDropdown, NavbarBrand } from 'reactstrap';
import { FaUser, FaBook, FaChalkboardTeacher, FaBuilding, FaFile, FaThList } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';
const AppNavbar = () => {
  return (
    <Navbar color="primary" expand="md" dark>
      <NavbarBrand href="/">
        <img
          alt="logo"
          src="/BrandLogo.svg"
          style={{
            height: 40,
            width: 50
          }}
        />
        SMS
      </NavbarBrand>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <Nav className="navbar-nav ml-auto">
          <Link to="/StudentRegistration" className="nav-link">
            <FaUser /> Students
          </Link>
          <Link to="/Subjects" className="nav-link">
            <FaBook /> Subjects
          </Link>
          <Link to="/teachers" className="nav-link">
            <FaChalkboardTeacher /> Teachers
          </Link>
          <Link to="/Classrooms" className="nav-link">
            <FaBuilding /> Classrooms
          </Link>
          <NavItem>
            <UncontrolledDropdown>
              <DropdownToggle nav caret>
                Allocations
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem tag={Link} to="/AllocateClassrooms">
                  Classroom Allocations
                </DropdownItem>
                <DropdownItem tag={Link} to="/AllocateSubjects">
                  Subject Allocations
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </NavItem>
        </Nav>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
