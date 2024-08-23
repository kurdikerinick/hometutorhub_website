import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { ref, get, child } from 'firebase/database';
import TopNav from './home';
import '../students/account.css';

function TutorAccount() {
  const [attendanceDays, setAttendanceDays] = useState([]);
  const [tutorInfo, setTutorInfo] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { studentId: urlStudentId } = useParams();
  const tutorId = urlStudentId || localStorage.getItem('tutorId'); // Get studentId from URL or local storage

  useEffect(() => {
    if (!tutorId) {
      console.error('Student ID is required');
      return;
    }

    const fetchData = async (tutorId) => {
      try {
        const tutorRef = ref(db, 'tutors');
        const tutorSnapshot = await get(child(tutorRef, tutorId));
        if (tutorSnapshot.exists()) {
          setTutorInfo([tutorSnapshot.val()]);
        } else {
          setTutorInfo([]);
        }


      

        const attendanceRef = ref(db, 'attendance');
        const attendanceSnapshot = await get(child(attendanceRef, tutorId));
        if (attendanceSnapshot.exists()) {
          const attendanceData = attendanceSnapshot.val();
          const attendanceArray = Object.keys(attendanceData).map((key) => attendanceData[key]);
          setAttendanceDays(attendanceArray);
        } else {
          setAttendanceDays([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData(tutorId);
  }, [tutorId]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`monitor-tests-container ${sidebarVisible ? 'sidebar-visible' : ''}`}>
      <TopNav isVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
      <div className={`stud-container ${sidebarVisible ? 'shifted' : ''}`}>
        <div className='section'>
          <h2>Course</h2>
        </div>

  

        {/* Tutor Section */}
        <div className="section">
          <div className='headerRow'>
            <div className='title'>Tutor Name:</div>
            <div className='title'>Education:</div>
            <div className='title'>Contact:</div>
            <div className='title'>Address:</div>
            <div className='title'>location:</div>

          </div>
          {tutorInfo.length > 0 ? (
            <div className='studentRow'>
              <div className='studentData'>{tutorInfo[0].tutor_name}</div>
              <div className='studentData'>{tutorInfo[0].education}</div>
              <div className='studentData'>{tutorInfo[0].contact}</div>
              <div className='studentData'>{tutorInfo[0].presentaddress}</div>
              <div className='studentData'>{tutorInfo[0].location}</div>

              </div>
          ) : (
            <div>No details found</div>
          )}
        </div>

    

        {/* Attendance Section */}
        <div className="section">
          <h2>Attendance</h2>
          <div className="headerRow">
            <div className="title">Date</div>
            <div className="title">Status</div>
          </div>
          {attendanceDays.length > 0 ? (
            attendanceDays.map((attendance, index) => (
              <div key={index} className="studentRow">
                <div className="studentData">{attendance.date}</div>
                <div className="studentData">{attendance.status}</div>
              </div>
            ))
          ) : (
            <div>No attendance data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorAccount;
