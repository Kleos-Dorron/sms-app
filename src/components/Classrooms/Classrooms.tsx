import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Table, Container, Card, CardBody, Row, Col } from "reactstrap";
import axios from "axios";
import AlertModal from "../modal/modal";

interface Classroom {
  classroomId: number;
  classroomName: string;
}

const Classrooms: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [newClassroom, setNewClassroom] = useState<string>("");
  const [newClassroomError, setNewClassroomError] = useState<string>("");
  const [editClassroomId, setEditClassroomId] = useState<number | null>(null);

  //
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const toggleSuccessModal = () => setIsSuccessModalOpen(!isSuccessModalOpen);
  const toggleErrorModal = () => setIsErrorModalOpen(!isErrorModalOpen);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get<Classroom[]>("https://localhost:7016/api/Classrooms");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const handleAddClassroom = async () => {
    if (!newClassroom.trim()) {
      setNewClassroomError("Classroom name is required");
      return;
    }
    try {
      await axios.post("https://localhost:7016/api/Classrooms", { classroomName: newClassroom });
      setNewClassroom("");
      setNewClassroomError("");
      fetchClassrooms();
      setModalTitle("Success");
      setModalMessage("Classroom added successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error adding classroom:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while adding the classroom.");
      toggleErrorModal();
    }
  };

  const handleEditClassroom = async (classroom: Classroom) => {
    if (!newClassroom.trim()) {
      setNewClassroomError("Classroom name is required");
      return;
    }
    try {
      await axios.put(`https://localhost:7016/api/Classrooms/${classroom.classroomId}`, { classroomName: newClassroom });
      setEditClassroomId(null);
      fetchClassrooms();
      setModalTitle("Success");
      setModalMessage("Classroom edited successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error editing classroom:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while editing the classroom.");
      toggleErrorModal();
    }
  };

  const handleDeleteClassroom = async (classroomId: number) => {
    try {
      await axios.delete(`https://localhost:7016/api/Classrooms/${classroomId}`);
      fetchClassrooms();
      setModalTitle("Success");
      setModalMessage("Classroom deleted successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error deleting classroom:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while deleting the classroom.");
      toggleErrorModal();
    }
  };

  return (
    <Container fluid="sm" style={{ maxWidth: "800px" }}>
      <AlertModal isOpen={isSuccessModalOpen} toggle={toggleSuccessModal} title={modalTitle} message={modalMessage} isSuccess={true} />
      <AlertModal isOpen={isErrorModalOpen} toggle={toggleErrorModal} title={modalTitle} message={modalMessage} isSuccess={false} />
      <h2>Classrooms</h2>
      <Card className="mb-4">
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="newClassroom">Add New Classroom</Label> {newClassroomError && <span className="text-danger">{newClassroomError}</span>}
              <Input
                type="text"
                id="newClassroom"
                value={newClassroom}
                onChange={(e) => {
                  setNewClassroom(e.target.value);
                  setNewClassroomError("");
                }}
              />
            </FormGroup>
            <div className="d-grid gap-2 col-6 mx-auto">
              <Button color="primary" onClick={handleAddClassroom}>
                Add Classroom
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
                <th>Classroom ID</th>
                <th>Classroom Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom.classroomId}>
                  <td>{classroom.classroomId}</td>
                  <td>
                    {editClassroomId === classroom.classroomId ? (
                      <Input type="text" value={newClassroom} onChange={(e) => setNewClassroom(e.target.value)} />
                    ) : (
                      classroom.classroomName
                    )}
                    {newClassroomError && <span className="text-danger">{newClassroomError}</span>}
                  </td>

                  <td>
                    {editClassroomId === classroom.classroomId ? (
                      <div className="d-grid gap-2">
                        <Button color="success" onClick={() => handleEditClassroom(classroom)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Row xs="2">
                          <Col>
                            <div className="d-grid gap-2">
                              <Button color="warning" onClick={() => setEditClassroomId(classroom.classroomId)}>
                                Edit
                              </Button>
                            </div>
                          </Col>
                          <Col>
                            <div className="d-grid gap-2">
                              <Button color="danger" onClick={() => handleDeleteClassroom(classroom.classroomId)}>
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

export default Classrooms;
