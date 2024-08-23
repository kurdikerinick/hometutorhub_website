import React from 'react'
//import BranchAdminRegistration from './bar'
import { Link } from "react-router-dom";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../branchadmin/branchadminhome.css'; 
import FolderSharedIcon from '@mui/icons-material/FolderShared';
function SuperAdminSidebar({ userEmail }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <AccountCircleIcon /> <span>{userEmail}</span> 
        </div>
      </div>
      <ul className="sidebar-menu">
        
        <li><Link to="/branchreg"><PersonAddAltIcon />Branch Admin Register</Link></li>
        <li><Link to="/registeredbranchadmin"><FolderSharedIcon />Registered admins</Link></li>
        <li><Link to="/enquiressuperadmin"><ContactMailIcon />Enquiries</Link></li>

      </ul>
      <div className='logout'><Link to="/navbar"> Logout</Link></div>
    </div>
  );
}



export default SuperAdminSidebar;
