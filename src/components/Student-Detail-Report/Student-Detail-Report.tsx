import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

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
const StudentDetailReport: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  useEffect(() => {
    // Fetch students when the component mounts
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get<Student[]>("https://localhost:7016/api/Students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleStudentChange = async (selectedStudentId: number) => {
    // Fetch student details based on the selected studentId
    try {
      const response = await axios.get<Student>(`https://localhost:7016/api/Students/${selectedStudentId}`);
      const studentData = response.data;

      // Update the state with the selected student details
      setStudentDetails(studentData);
      setSelectedStudentId(selectedStudentId);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  return (
    <Container fluid="sm" style={{ maxWidth: "900px" }}>
      <h1 className="mb-4">Student Details</h1>

      <Form>
        <Row>
          <Col md={6}>
            <FormGroup row>
              <Label for="studentId" sm={4}>
                Select Student:
              </Label>
              <Col sm={8}>
                <Input type="select" id="studentId" onChange={(e) => handleStudentChange(Number(e.target.value))} value={selectedStudentId || ""}>
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.studentId} value={student.studentId}>
                      {`${student.firstName} ${student.lastName}`}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="studentName" sm={4}>
                First Name:
              </Label>
              <Col sm={8}>
                <Input type="text" id="studentName" value={studentDetails?.firstName} readOnly />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="studentName" sm={4}>
                Last Name:
              </Label>
              <Col sm={8}>
                <Input type="text" id="studentName" value={studentDetails?.lastName} readOnly />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="contactPerson" sm={4}>
                Contact Person:
              </Label>
              <Col sm={8}>
                <Input type="text" id="contactPerson" value={studentDetails?.contactPerson} readOnly />
              </Col>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup row>
              <Label for="contactNo" sm={4}>
                Contact No.:
              </Label>
              <Col sm={8}>
                <Input type="text" id="contactNo" value={studentDetails?.contactNo} readOnly />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="emailAddress" sm={4}>
                Email Address:
              </Label>
              <Col sm={8}>
                <Input type="text" id="emailAddress" value={studentDetails?.emailAddress} readOnly />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="dateOfBirth" sm={4}>
                Date of Birth:
              </Label>
              <Col sm={8}>
                <Input type="text" id="dateOfBirth" value={studentDetails?.dateOfBirth} readOnly />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="age" sm={4}>
                Age:
              </Label>
              <Col sm={8}>
                <Input type="text" id="age" value={studentDetails?.age} readOnly />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default StudentDetailReport;
