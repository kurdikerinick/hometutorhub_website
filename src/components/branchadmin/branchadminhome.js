import React from 'react';
import { Link } from 'react-router-dom';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../branchadmin/branchadminhome.css'; 
import FolderSharedIcon from '@mui/icons-material/FolderShared';

function BranchAdminSidebar({ userEmail }) {
  return (
    <div>
      
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <AccountCircleIcon /> <span>{userEmail}</span> 
        </div>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/enquires"><ContactMailIcon />Enquiries</Link></li>
        <li><Link to="/studentregister"><PersonAddAltIcon /> Student Registration</Link></li>
        <li><Link to="/tutorregister"><PersonAddAltIcon />Tutor Registration</Link></li>
        <li><Link to="/assign"><GroupAddIcon /> Assign Tutor</Link></li>
        <li><Link to="/payments"><ReceiptIcon /> Fees</Link></li>
        {/* <li><Link to="/report"><AssessmentIcon /> Report</Link></li> */}
        <li><Link to="/students"><FolderSharedIcon /> Accounts</Link></li>
      </ul>
      <div className='logout'><Link to="/navbar"> Logout</Link></div>
    </div>
    </div>
  );
}

export default BranchAdminSidebar;
