import React, { FC, FormEvent, useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, CardImg, Card, CardBody, Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import AlertModal from "../modal/modal";
// Assuming the structure of a Classroom object
interface Classroom {
  classroomId: number;
  classroomName: string;
}
interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  contactPerson: string;
  contactNo: string;
  emailAddress: string;
  dateOfBirth: string;
  age: string;
  classroomId: number;
}

const StudentRegistration = () => {
  //Classroom State to fetch the Classroom and show in Dropdown
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<Student>({
    studentId: 0,
    firstName: "",
    lastName: "",
    contactPerson: "",
    contactNo: "",
    emailAddress: "",
    dateOfBirth: "",
    age: "",
    classroomId: 0, // This will hold the actual classroomId
  });

  // Add state variables for error messages
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [contactPersonError, setContactPersonError] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [classroomError, setClassroomError] = useState("");

  //modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const toggleSuccessModal = () => setIsSuccessModalOpen(!isSuccessModalOpen);
  const toggleErrorModal = () => setIsErrorModalOpen(!isErrorModalOpen);

  const [editStudentId, setEditStudentId] = useState<number | null>(null);

  // Fetch classrooms when the component mounts
  useEffect(() => {
    fetchClassrooms(); //Fetching Classroom to Displays in the dropdown
    fetchstudents(); //Fetching Students to Display in the Table
  }, []);

  //Classroom Fetch methdod
  const fetchClassrooms = async () => {
    try {
      const response = await axios.get("https://localhost:7016/api/Classrooms");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };
  //Students Fetch Method
  const fetchstudents = async () => {
    try {
      const response = await axios.get<Student[]>("https://localhost:7016/api/Students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };
  //Caculate the Age of the Student based on the DOB Dropdown
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageDiff = today.getFullYear() - birthDate.getFullYear();

    // Check if birthday has occurred this year
    const hasBirthdayOccurred =
      today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    const age = hasBirthdayOccurred ? ageDiff : ageDiff - 1;

    setFormData((prevData) => ({
      ...prevData,
      age: age.toString(),
      dateOfBirth: dateOfBirth,
    }));
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update age when DOB changes
    if (name === "dateOfBirth") {
      calculateAge(value);
    }

    // Handle changes in the classroom dropdown
    if (name === "classroom") {
      // Assuming that the value is the classroomId
      setFormData((prevData) => ({
        ...prevData,
        classroomId: parseInt(value),
      }));
    }
  };
  const handleEmailChange = (value: any) => {
    // Call the validation function and set the error message for email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
    } else if (!emailPattern.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  //Insert Student Details--------------------------------------------------------------------------
  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    // Validation for each field
    setFirstNameError(formData.firstName.trim() === "" ? "First Name is required" : "");
    setLastNameError(formData.lastName.trim() === "" ? "Last Name is required" : "");
    setContactPersonError(formData.contactPerson.trim() === "" ? "Contact Person is required" : "");
    setContactNoError(/^\d+$/.test(formData.contactNo) ? "" : "Please enter a valid phone number");
    handleEmailChange(formData.emailAddress);
    setDobError(formData.dateOfBirth.trim() === "" ? "Date of Birth is required" : "");
    setAgeError(/^\d+$/.test(formData.age) ? "" : "Please enter a valid age");
    setClassroomError(formData.classroomId === 0 ? "Classroom is required" : "");

    // Check if there are any validation errors
    if (!firstNameError && !lastNameError && !contactPersonError && !contactNoError && !emailError && !dobError && !ageError && !classroomError) {
      setModalTitle("Error");
      setModalMessage("An error occurred while Inserting the student.");
      toggleErrorModal();
    }

    try {
      // Post student registration data
      await axios.post("https://localhost:7016/api/Students", formData);
      //console.log("Student registration successful!");
      console.log(formData);
      setModalTitle("Success");
      setModalMessage("Student registration successful!");
      toggleSuccessModal();

      //console.log(formData);
    } catch (error) {
      //console.error("Error submitting student registration:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred during submission.");
      setIsErrorModalOpen(true);
    }
  };

  //Delete Student Details
  const handleEditStudent = async (student: Student) => {
    if (!firstNameError && !lastNameError && !contactPersonError && !contactNoError && !emailError && !dobError && !ageError && !classroomError) {
    }
    try {
      await axios.put(`https://localhost:7016/api/Students/${student.studentId}`, formData);
      fetchstudents();
      setModalTitle("Success");
      setModalMessage("Teacher edited successfully!");
      setEditStudentId(null);
      toggleSuccessModal();
    } catch (error) {
      console.error("Error editing teacher:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while editing the teacher.");
      toggleErrorModal();
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await axios.delete(`https://localhost:7016/api/Students/${studentId}`);
      fetchstudents();
      setModalTitle("Success");
      setModalMessage("Teacher deleted successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while deleting the teacher.");
      toggleErrorModal();
    }
  };
  const handleEditButtonClick = (student: Student) => {
    setEditStudentId(student.studentId);
    setFormData({ ...student }); // Set the newTeacher state with the values of the selected teacher
  };

  return (
    //StudentRegistration Component
    <Container>
      <AlertModal isOpen={isSuccessModalOpen} toggle={toggleSuccessModal} title={modalTitle} message={modalMessage} isSuccess={true} />
      <AlertModal isOpen={isErrorModalOpen} toggle={toggleErrorModal} title={modalTitle} message={modalMessage} isSuccess={false} />
      <center>
        <Row className="d-flex justify-content-center align-items-center">
          <Col>
            <Card className="my-5 rounded-3" style={{ maxWidth: "800px" }}>
              {/* <CardImg
              src="https://ps-attachments.s3.amazonaws.com/dcef5fb6-4869-4aa4-aaf3-c78a66099450/qCYDt4R5R0kPL-K6EBBNBQ.png"
              className="w-100 rounded-top"
              alt="Sample photo"
              style={{
                height: 180,
                objectFit: "cover",
              }}
            /> */}
              <CardBody>
                <h3>Student Registration</h3>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="firstName">First Name</Label>
                      <span className="text-danger">{firstNameError}</span>
                      <Input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lastName">Last Name</Label> <span className="text-danger">{lastNameError}</span>
                      <Input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="contactPerson">Contact Person</Label> <span className="text-danger">{contactPersonError}</span>
                      <Input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="contactNo">Contact Number</Label> <span className="text-danger">{contactNoError}</span>
                      <Input type="text" id="contactNo" name="contactNo" value={formData.contactNo} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="emailAddress">Email Address</Label> <span className="text-danger">{emailError}</span>
                      <Input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="dateOfBirth">Date of Birth</Label> <span className="text-danger">{dobError}</span>
                      <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="age">Age</Label> <span className="text-danger">{ageError}</span>
                      <Input type="text" id="age" name="age" value={formData.age} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="classroom">Classroom</Label> <span className="text-danger">{classroomError}</span>
                      <Input type="select" id="classroom" name="classroom" value={formData.classroomId} onChange={handleChange}>
                        <option disabled>Select Classroom</option>
                        {/* <option>Class 1</option>
                      <option>Class 2</option>
                      <option>Class 3</option> */}
                        {classrooms.map((classroom) => (
                          <option key={classroom.classroomId} value={classroom.classroomId}>
                            {classroom.classroomName}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <Button color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </CardBody>
            </Card>
            <Card className="mb-4">
              <CardBody>
                <Table className="mt-3">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Contact Person</th>
                      <th>Contact No</th>
                      <th>Email</th>
                      <th>Date of Birth</th>
                      <th>Age</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.studentId}>
                        <td>{student.studentId}</td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, firstName: e.target.value }))}
                            />
                          ) : (
                            student.firstName
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, lastName: e.target.value }))}
                            />
                          ) : (
                            student.lastName
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.contactPerson}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, contactPerson: e.target.value }))}
                            />
                          ) : (
                            student.contactNo
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.contactNo}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, contactNo: e.target.value }))}
                            />
                          ) : (
                            student.contactNo
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.emailAddress}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, emailAddress: e.target.value }))}
                            />
                          ) : (
                            student.emailAddress
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.dateOfBirth}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, dateOfBirth: e.target.value }))}
                            />
                          ) : (
                            student.dateOfBirth
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <Input
                              type="text"
                              value={formData.age}
                              onChange={(e) => setFormData((prevTeacher) => ({ ...prevTeacher, age: e.target.value }))}
                            />
                          ) : (
                            student.age
                          )}
                        </td>
                        <td>
                          {editStudentId === student.studentId ? (
                            <div className="d-grid gap-2">
                              <Button color="success" onClick={() => handleEditStudent(student)}>
                                Save
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Row xs="2">
                                <Col>
                                  <div className="d-grid gap-2">
                                    <Button color="warning" onClick={() => handleEditButtonClick(student)}>
                                      Edit
                                    </Button>
                                  </div>
                                </Col>
                                <Col>
                                  <div className="d-grid gap-2">
                                    <Button color="danger" onClick={() => handleDeleteStudent(student.studentId)}>
                                      Delete
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </center>
    </Container>
  );
};
export default StudentRegistration;
