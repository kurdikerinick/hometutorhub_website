// firebaseTableStructure.js
const studentStructure = {
  "students": {
    "1": {
      "stud_name": null,
      "email": null,
      "password": null,
      "board": null,
      "class": null,
      "contact": null,
      "presentaddress": null,
      "primelocation": null,
      "branch": null,
      "addressproof": null,
      "dob": null,
      "gender": null,
      "days": null,
      "fees": null,
      "subject": null,
      "reset_token": null,
      "reset_token_expires": null,
      "created_at": null,
      "updated_at": null
    },
  },
  "stud_ref": {
    "1": {
      "student_id": null,
      "stud_name": null,
      "board": null,
      "class": null,
      "contact": null,
      "subject": null,
      "fees": null,
      "month": null,
    },
    
  },
  "assignments": {
    "1": {
      "stud_name": null,
      "tutor_name": null,
      "student_id": null,
      "tutor_id": null,
      "education": null,
      "presentaddress": null,
      "contact": null
    },
  },
  "attendance": {
    "1": {
      "match_timestamp": null,
      "tutor_id": null,
      "remark": null,
      "days": null,
      "remaining_days": null
    },
  },

  "location_matches": {
    "1": {
      "tutor_id": null,
      "student_latitude": null,
      "student_longitude": null,
      "tutor_latitude": null,
      "tutor_longitude": null,
      "sign_in_timestamp": null,
      "sign_out_timestamp": null,
      "match_timestamp": null,
      "remark": null,
      "days": null,
      "remaining_days": null
    },
  },

 

  "subjects": {
    "1": {
      "subject_name": null,
      "class_planned": null,
      "class_languages": null,
      "class_pending": null,
      "portion_covered": null,
      "portion_pending": null,
      "student_id": null,
      "subject_topics": null,
    },
  },

  "syllabus": {
    "1": {
      "subject_topics": null,
      "student_id": null,
      "tutor_id": null,
      "subject_name": null,
    },
  },
  "tests": {
    "1": {
      "test_topic": null,
      "test_date": null,
      "marks": null,
      "maximum_marks": null,
      "student_id": null,
      "subject_name": null,
      "tutor_id": null,
    },
  },
};

export default studentStructure;
