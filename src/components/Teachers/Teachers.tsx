import React, { FC, useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Table, Container, Card, CardBody, Row, Col } from "reactstrap";
import axios from "axios";
import AlertModal from "../modal/modal";

interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  emailAddress: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    teacherId: 0,
    firstName: "",
    lastName: "",
    contactNo: "",
    emailAddress: "",
  });
  const [newTeacherError, setNewTeacherError] = useState<string>("");
  const [editTeacherId, setEditTeacherId] = useState<number | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const toggleSuccessModal = () => setIsSuccessModalOpen(!isSuccessModalOpen);
  const toggleErrorModal = () => setIsErrorModalOpen(!isErrorModalOpen);

  //Fetch the Teacher Data from the Endpoint
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get<Teacher[]>("https://localhost:7016/api/Teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.firstName.trim() || !newTeacher.lastName.trim() || !newTeacher.emailAddress.trim() || !newTeacher.contactNo.trim()) {
      setNewTeacherError("All fields are required");
      return;
    }

    try {
      await axios.post("https://localhost:7016/api/Teachers", newTeacher);
      setNewTeacher({
        teacherId: 0,
        firstName: "",
        lastName: "",
        contactNo: "",
        emailAddress: "",
      });
      setNewTeacherError("");
      fetchTeachers();
      setModalTitle("Success");
      setModalMessage("Teacher added successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error adding teacher:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while adding the teacher.");
      toggleErrorModal();
    }
  };

  const handleEditTeacher = async (teacher: Teacher) => {
    if (!newTeacher.firstName.trim() || !newTeacher.lastName.trim() || !newTeacher.emailAddress.trim()) {
      setNewTeacherError("All fields are required");
      return;
    }

    try {
      await axios.put(`https://localhost:7016/api/Teachers/${teacher.teacherId}`, newTeacher);

      fetchTeachers();
      setModalTitle("Success");
      setModalMessage("Teacher edited successfully!");
      setEditTeacherId(null);
      toggleSuccessModal();
    } catch (error) {
      console.error("Error editing teacher:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while editing the teacher.");
      toggleErrorModal();
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    try {
      await axios.delete(`https://localhost:7016/api/Teachers/${teacherId}`);
      fetchTeachers();
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
  const handleEditButtonClick = (teacher: Teacher) => {
    setEditTeacherId(teacher.teacherId);
    setNewTeacher({ ...teacher }); // Set the newTeacher state with the values of the selected teacher
  };

  return (
    <Container fluid="sm" style={{ maxWidth: "900px" }}>
      <AlertModal isOpen={isSuccessModalOpen} toggle={toggleSuccessModal} title={modalTitle} message={modalMessage} isSuccess={true} />
      <AlertModal isOpen={isErrorModalOpen} toggle={toggleErrorModal} title={modalTitle} message={modalMessage} isSuccess={false} />
      <h2>Teachers</h2>
      <Card className="mb-4">
        <CardBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={newTeacher.firstName}
                    onChange={(e) => {
                      setNewTeacherError("");
                      setNewTeacher((prevTeacher) => ({ ...prevTeacher, firstName: e.target.value }));
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={newTeacher.lastName}
                    onChange={(e) => {
                      setNewTeacherError("");
                      setNewTeacher((prevTeacher) => ({ ...prevTeacher, lastName: e.target.value }));
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="contactNo">Contact No</Label>
                  <Input
                    type="text"
                    id="contactNo"
                    value={newTeacher.contactNo}
                    onChange={(e) => {
                      setNewTeacherError("");
                      setNewTeacher((prevTeacher) => ({ ...prevTeacher, contactNo: e.target.value }));
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={newTeacher.emailAddress}
                    onChange={(e) => {
                      setNewTeacherError("");
                      setNewTeacher((prevTeacher) => ({ ...prevTeacher, emailAddress: e.target.value }));
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            {newTeacherError && <span className="text-danger">{newTeacherError}</span>}
            <div className="d-grid gap-2 col-6 mx-auto">
              <Button
                color="primary"
                onClick={editTeacherId === null ? handleAddTeacher : () => handleEditTeacher(teachers.find((t) => t.teacherId === editTeacherId)!)}>
                {editTeacherId === null ? "Add Teacher" : "Edit Teacher"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Card className="mb-4">
        <CardBody>
          <Table className="mt-3">
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>ContactNo</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.teacherId}>
                  <td>{teacher.teacherId}</td>
                  <td>
                    {editTeacherId === teacher.teacherId ? (
                      <Input
                        type="text"
                        value={newTeacher.firstName}
                        onChange={(e) => setNewTeacher((prevTeacher) => ({ ...prevTeacher, firstName: e.target.value }))}
                      />
                    ) : (
                      teacher.firstName
                    )}
                  </td>
                  <td>
                    {editTeacherId === teacher.teacherId ? (
                      <Input
                        type="text"
                        value={newTeacher.lastName}
                        onChange={(e) => setNewTeacher((prevTeacher) => ({ ...prevTeacher, lastName: e.target.value }))}
                      />
                    ) : (
                      teacher.lastName
                    )}
                  </td>
                  <td>
                    {editTeacherId === teacher.teacherId ? (
                      <Input
                        type="text"
                        value={newTeacher.contactNo}
                        onChange={(e) => setNewTeacher((prevTeacher) => ({ ...prevTeacher, contactNo: e.target.value }))}
                      />
                    ) : (
                      teacher.contactNo
                    )}
                  </td>
                  <td>
                    {editTeacherId === teacher.teacherId ? (
                      <Input
                        type="text"
                        value={newTeacher.emailAddress}
                        onChange={(e) => setNewTeacher((prevTeacher) => ({ ...prevTeacher, emailAddress: e.target.value }))}
                      />
                    ) : (
                      teacher.emailAddress
                    )}
                  </td>
                  <td>
                    {editTeacherId === teacher.teacherId ? (
                      <div className="d-grid gap-2">
                        <Button color="success" onClick={() => handleEditTeacher(teacher)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Row xs="2">
                          <Col>
                            <div className="d-grid gap-2">
                              <Button color="warning" onClick={() => handleEditButtonClick(teacher)}>
                                Edit
                              </Button>
                            </div>
                          </Col>
                          <Col>
                            <div className="d-grid gap-2">
                              <Button color="danger" onClick={() => handleDeleteTeacher(teacher.teacherId)}>
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
    </Container>
  );
};

export default Teachers;
