// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navigation/navbar';
import SuperAdminLogin from './components/superadmin/slogin';
import BranchAdminRegistration from './components/superadmin/regadmin';
import RegisteredBranchAdmins from './components/superadmin/registeredbranchadmins';
import BranchAdminLogin from './components/branchadmin/blogin';
import Branchadminhome from './components/branchadmin/branchadminhome';
import Tutorregister from './components/branchadmin/tutorregister';
import StudentRegistration from './components/branchadmin/studentregister';
import Assign from './components/branchadmin/assignstudents';
import Home from './components/navigation/navbar';
import StudentLogin from './components/students/studlogin';
import SuperAdminSidebar from './components/superadmin/sdashboard';
import Enquires from './components/branchadmin/enquires';
import EnquiresSuperAdmin from './components/superadmin/enquires';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
         <Route path='/' element={<Home />} />
          <Route path='/navbar' element={<Navbar />} />
          <Route path='/slogin' element={<SuperAdminLogin/>} />
          <Route path='/superadminsidebar' element={<SuperAdminSidebar/>} />
          <Route path='/studentlogin' element={<StudentLogin/>}/>
         <Route path='/branchreg' element={<BranchAdminRegistration />} />
         <Route path='/registeredbranchadmin' element={<RegisteredBranchAdmins />} />
         <Route path='/blogin' element={<BranchAdminLogin />} />
         <Route path='/branchadminhome' element={<Branchadminhome />} />
         <Route path='/tutorregister' element={<Tutorregister /> }/>
         <Route path='/studentregister'element={<StudentRegistration/>}/>
         <Route path='/assign' element={<Assign />} />
       <Route path='/enquires' element={<Enquires/>}/>
       <Route path='/enquiressuperadmin' element={<EnquiresSuperAdmin/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
