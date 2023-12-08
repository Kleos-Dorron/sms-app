import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Table, Container, Card, CardBody, Row, Col } from "reactstrap";
import axios from "axios";
import AlertModal from "../modal/modal";

interface Subject {
  subjectId: number;
  subjectName: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<Subject>({
    subjectId: 0,
    subjectName: "",
  });
  const [newSubjectError, setNewSubjectError] = useState<string>("");
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);

  //modal (success & error)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const toggleSuccessModal = () => setIsSuccessModalOpen(!isSuccessModalOpen);
  const toggleErrorModal = () => setIsErrorModalOpen(!isErrorModalOpen);

  // Fetch the Subject Data from the Endpoint
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get<Subject[]>("https://localhost:7016/api/Subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.subjectName.trim()) {
      setNewSubjectError("Subject Name is required");
      return;
    }

    try {
      await axios.post("https://localhost:7016/api/Subjects", newSubject);
      setNewSubject({
        subjectId: 0,
        subjectName: "",
      });
      setNewSubjectError("");
      fetchSubjects();
      setModalTitle("Success");
      setModalMessage("Subject added successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error adding subject:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while adding the subject.");
      toggleErrorModal();
    }
  };

  const handleEditSubject = async (subject: Subject) => {
    if (!newSubject.subjectName.trim()) {
      setNewSubjectError("All fields are required");
      return;
    }

    try {
      await axios.put(`https://localhost:7016/api/Subjects/${subject.subjectId}`, newSubject);

      fetchSubjects();
      setModalTitle("Success");
      setModalMessage("Subject edited successfully!");
      setEditSubjectId(null);
      toggleSuccessModal();
    } catch (error) {
      console.error("Error editing subject:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while editing the subject.");
      toggleErrorModal();
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    try {
      await axios.delete(`https://localhost:7016/api/Subjects/${subjectId}`);
      fetchSubjects();
      setModalTitle("Success");
      setModalMessage("Subject deleted successfully!");
      toggleSuccessModal();
    } catch (error) {
      console.error("Error deleting subject:", error);
      setModalTitle("Error");
      setModalMessage("An error occurred while deleting the subject.");
      toggleErrorModal();
    }
  };

  const handleEditButtonClick = (subject: Subject) => {
    setEditSubjectId(subject.subjectId);
    setNewSubject({ ...subject }); // Set the newSubject state with the values of the selected subject
  };

  return (
    <Container fluid="sm" style={{ maxWidth: "900px" }}>
      <AlertModal isOpen={isSuccessModalOpen} toggle={toggleSuccessModal} title={modalTitle} message={modalMessage} isSuccess={true} />
      <AlertModal isOpen={isErrorModalOpen} toggle={toggleErrorModal} title={modalTitle} message={modalMessage} isSuccess={false} />
      <h2>Subjects</h2>
      <Card className="mb-4">
        <CardBody>
          <Form>
            <FormGroup className="d-grid gap-2 col-6 mx-auto">
              <Label for="name">Enter Subject Name</Label>
              <Input
                type="text"
                id="name"
                value={newSubject.subjectName}
                onChange={(e) => {
                  setNewSubjectError("");
                  setNewSubject((prevSubject) => ({ ...prevSubject, subjectName: e.target.value }));
                }}
              />
            </FormGroup>

            {newSubjectError && <span className="text-danger">{newSubjectError}</span>}
            <div className="d-grid gap-2 col-6 mx-auto">
              <Button
                color="primary"
                onClick={editSubjectId === null ? handleAddSubject : () => handleEditSubject(subjects.find((s) => s.subjectId === editSubjectId)!)}>
                {editSubjectId === null ? "Add Subject" : "Edit Subject"}
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
                <th>Subject ID</th>
                <th>Subject Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subjectId}>
                  <td>{subject.subjectId}</td>
                  <td>
                    {editSubjectId === subject.subjectId ? (
                      <Input
                        type="text"
                        value={newSubject.subjectName}
                        onChange={(e) => setNewSubject((prevSubject) => ({ ...prevSubject, subjectName: e.target.value }))}
                      />
                    ) : (
                      subject.subjectName
                    )}
                  </td>
                  <td>
                    {editSubjectId === subject.subjectId ? (
                      <div className="d-grid gap-2">
                        <Button color="success" onClick={() => handleEditSubject(subject)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Row xs="2">
                          <Col>
                            <div className="d-grid gap-4">
                              <Button color="warning" onClick={() => handleEditButtonClick(subject)}>
                                Edit
                              </Button>
                            </div>
                          </Col>
                          <Col>
                            <div className="d-grid gap-2">
                              <Button color="danger" onClick={() => handleDeleteSubject(subject.subjectId)}>
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

export default Subjects;
