import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Settings } from '@mui/icons-material';
import '../students/nav.css';

function TutorHome() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLinkClick = () => {
    setIsSidebarVisible(false); // Close the sidebar when a link is clicked
  };

  const handleResize = () => {
    if (window.innerWidth > 480) {
      setIsSidebarVisible(false); // Close sidebar on resizing to larger screens
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="top-nav">
      <div className={`burger-icon ${isSidebarVisible ? 'close-icon' : ''}`} onClick={toggleSidebar}>
        {isSidebarVisible ? <CloseIcon /> : <MenuIcon />}
      </div>
      <div className={`sidebar ${isSidebarVisible ? 'show' : 'hide'}`}>
        <div className="sidebar-header">
          <AccountCircleIcon />
          <h2>Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to={`/tutoraccount/${localStorage.getItem('tutorId')}`} onClick={handleLinkClick}>
              <FolderSharedIcon /> Account
            </Link>
          </li>
          <li>
            <Link to="/studentlist" onClick={handleLinkClick}>
            <FolderSharedIcon /> Find Student
            </Link>
          </li>
          <li>
            <Link to="" onClick={handleLinkClick}>
              <Settings /> Settings
            </Link>
          </li>
          <li className="logout">
            <Link to="/navbar" onClick={handleLinkClick}>Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TutorHome;
