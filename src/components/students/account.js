import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { ref, get, child } from 'firebase/database';
import TopNav from './home';
import '../students/account.css';

function MonitorTests() {
  const [testDetails, setTestDetails] = useState([]);
  const [studentInfo, setStudentInfo] = useState([]);
  const [attendanceDays, setAttendanceDays] = useState([]);
  const [tutorInfo, setTutorInfo] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { studentId: urlStudentId } = useParams();
  const studentId = urlStudentId || localStorage.getItem('studentId'); // Get studentId from URL or local storage

  useEffect(() => {
    if (!studentId) {
      console.error('Student ID is required');
      return;
    }

    const fetchData = async (studentId) => {
      try {
        const tutorRef = ref(db, 'tutors');
        const tutorSnapshot = await get(child(tutorRef, studentId));
        if (tutorSnapshot.exists()) {
          setTutorInfo([tutorSnapshot.val()]);
        } else {
          setTutorInfo([]);
        }

        const studentRef = ref(db, 'students');
        const studentSnapshot = await get(child(studentRef, studentId));
        if (studentSnapshot.exists()) {
          setStudentInfo([studentSnapshot.val()]);
        } else {
          setStudentInfo([]);
        }

        const testsRef = ref(db, 'tests');
        const testsSnapshot = await get(child(testsRef, studentId));
        if (testsSnapshot.exists()) {
          const testsData = testsSnapshot.val();
          const testsArray = Object.keys(testsData).map((key) => testsData[key]);
          setTestDetails(testsArray);
        } else {
          setTestDetails([]);
        }

        const attendanceRef = ref(db, 'attendance');
        const attendanceSnapshot = await get(child(attendanceRef, studentId));
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

    fetchData(studentId);
  }, [studentId]);

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

        <div className='section'>
          <div className='headerRow'>
            <div className='title'>Name:</div>
            <div className='title'>Class:</div>
            <div className='title'>Board:</div>
            <div className='title'>Address Proof:</div>
          </div>
          {studentInfo.length > 0 ? (
            <div className='studentRow'>
              <div className='studentData'>{studentInfo[0].stud_name || 'N/A'}</div>
              <div className='studentData'>{studentInfo[0].class || 'N/A'}</div>
              <div className='studentData'>{studentInfo[0].board || 'N/A'}</div>
              <div className='studentData'>{studentInfo[0].addressproof || 'N/A'}</div>
            </div>
          ) : (
            <div>No details found</div>
          )}
        </div>

        {/* Tutor Section */}
        <div className="section">
          <div className='headerRow'>
            <div className='title'>Tutor Name:</div>
            <div className='title'>Education:</div>
            <div className='title'>Contact:</div>
            <div className='title'>Address:</div>
          </div>
          {tutorInfo.length > 0 ? (
            <div className='studentRow'>
              <div className='studentData'>{tutorInfo[0].tutor_name}</div>
              <div className='studentData'>{tutorInfo[0].education}</div>
              <div className='studentData'>{tutorInfo[0].contact}</div>
              <div className='studentData'>{tutorInfo[0].presentaddress}</div>
            </div>
          ) : (
            <div>No details found</div>
          )}
        </div>

        {/* Tests Section */}
        <div className="section">
          <h2>Tests</h2>
          <div className="headerRow">
            <div className="title">Subject</div>
            <div className="title">Topic</div>
            <div className="title">Total</div>
            <div className="title">Obtained</div>
          </div>
          {testDetails.length > 0 ? (
            testDetails.map((test, index) => (
              <div key={index} className="studentRow">
                <div className="studentData">{test.subject_name}</div>
                <div className="studentData">{test.topic}</div>
                <div className="studentData">{test.total}</div>
                <div className="studentData">{test.obtained}</div>
              </div>
            ))
          ) : (
            <div>No test details available</div>
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

export default MonitorTests;
