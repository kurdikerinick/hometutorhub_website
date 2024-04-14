import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import BranchAdminSidebar from './branchadminhome';
import '../branchadmin/assignstudents.css';

const Assign = () => {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log("Fetching tutors...");
    const db = getDatabase();
    const tutorsRef = ref(db, 'tutor_ref');
    const studentsRef = ref(db, 'stud_ref');
    const assignmentsRef = ref(db, 'assignments');

    const fetchTutors = () => {
      onValue(tutorsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Tutors fetched:", data);
          setTutors(Object.values(data));
        }
      });
    };

    const fetchStudents = () => {
      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Students fetched:", data);
          setStudents(Object.values(data));
        }
      });
    };

    const fetchAssignments = () => {
      onValue(assignmentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Assignments fetched:", data);
          setAssignments(Object.values(data));
        }
      });
    };

    fetchTutors();
    fetchStudents();
    fetchAssignments();

    return () => {
      // Clean up listeners to avoid memory leaks
    };
  }, []);

  const handleDragStart = (student) => {
    console.log("Student dragged:", student);
    setDraggedStudent(student);
  };

  const handleDrop = (tutor) => {
    if (!draggedStudent || !draggedStudent.student_id) {
      console.error("Invalid dragged student:", draggedStudent);
      return;
    }
  
    console.log("Student dropped onto tutor:", draggedStudent,tutor);
  
    const studentId = draggedStudent.student_id;
  
    const assignmentRef = ref(getDatabase(), `assignments/${studentId}`);
  
    const assignmentData = {
      student_id:studentId,
      tutor_id: tutor.tutor_id, // Using tutor.tutor_id directly
      stud_name: draggedStudent.stud_name,
      tutor_name: tutor.tutor_name,
    };
  
    set(assignmentRef, assignmentData)
      .then(() => {
        const studentRef = ref(getDatabase(), `stud_ref/${studentId}`);
        remove(studentRef)
          .then(() => {
            setStudents(prevStudents => prevStudents.filter(student => student.student_id !== studentId));
          })
          .catch(error => {
            console.error("Error removing student from stud_ref table:", error);
          });
      })
      .catch(error => {
        console.error("Error assigning tutor:", error);
      });
  
    setDraggedStudent(null);
  };
  

  return (
   
      
    <div className="assign-container">
    <BranchAdminSidebar/> 
    <div className="top-section">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="branch-select">
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">Select Branch</option>
          <option value="branch1">Branch 1</option>
          <option value="branch2">Branch 2</option>
          <option value="branch3">Branch 3</option>
        </select>
      </div>
    </div>

      <div className="tables-container">

      <div className="students-list">
  <h2>Students List</h2>
  <table>
    <thead>
      <tr>
        <th>Student Name</th>
        <th> Contact</th>
        <th>Class</th>

      </tr>
    </thead>
    <tbody>
      {students.map(student => (
        <tr
          key={student.student_id}
          draggable
          onDragStart={() => handleDragStart(student)}
        >
          <td>{student.stud_name}</td>
          <td>{student.contact}</td>
          <td>{student.class}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      <div className="tutors-list">
  <h2>Tutors List</h2>
  <table>
    <thead>
      <tr>
        <th>Tutor Name</th>
        <th>Contact</th>
        <th>Gender</th>
        <th>Category</th>
      </tr>
    </thead>
    <tbody>
      {tutors.map(tutor => (
        <tr key={tutor.tutor_id}>
          <td
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(tutor)}
          >
            {tutor.tutor_name}
          </td>
          <td>{tutor.contact}</td>
          <td>{tutor.gender}</td>
          <td>{tutor.ccategory}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


<div className="assignments-list">
  <h2>Assignments List</h2>
  <table>
    <thead>
      <tr>
        <th>Tutor</th>
        <th>Student</th>
      </tr>
    </thead>
    <tbody>
      {assignments.map(assignment => (
        <tr key={assignment.student_id}>
          <td>{assignment.tutor_name}</td>
          <td>{assignment.stud_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
    </div>
  );
};

export default Assign;
