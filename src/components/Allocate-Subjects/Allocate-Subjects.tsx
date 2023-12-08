import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label, Table } from "reactstrap";

interface Subject {
  subjectId: number;
  subjectName: string;
}
interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  emailAddress: string;
}
interface Allocation {
  allocationId: number;
  teacherId: number;
  subjectId: number;
  subject: any;
  teacher: any;
}

const AllocateSubjects = () => {
  const [Teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [allocationData, setAllocationData] = useState({
    teacherId: 0,
    subjectId: 0,
    teachers: [], // Array of teacher objects
    subjects: [], // Array of subject objects
  });

  useEffect(() => {
    // Fetch Teacher and subjects when the component mounts
    fetchTeachers();
    fetchSubjects();
    fetchAllocations();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("https://localhost:7016/api/Teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("https://localhost:7016/api/Subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  const fetchAllocations = async () => {
    try {
      const response = await axios.get("https://localhost:7016/api/AllocateSubjects");
      const allocationDetails = await Promise.all(
        response.data.map(async (allocation: any) => {
          const teacherResponse = await axios.get(`https://localhost:7016/api/Teachers/${allocation.teacherId}`);
          const subjectResponse = await axios.get(`https://localhost:7016/api/Subjects/${allocation.subjectId}`);

          return {
            allocationId: allocation.allocationId,
            teacher: teacherResponse.data,
            subject: subjectResponse.data,
          };
        })
      );

      setAllocations(allocationDetails);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };
  const handleAllocationChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    setAllocationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAllocationSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Post allocation data
      await axios.post("https://localhost:7016/api/AllocateSubjects", allocationData);
      console.log("Subject allocation successful!");
      // You may want to add some feedback or update the UI here
    } catch (error) {
      console.error("Error submitting subject allocation:", error);
      // Handle error, show a message, etc.
    }
  };

  const handleDeallocation = async (allocationId: number) => {
    try {
      // Delete allocation
      await axios.delete(`https://localhost:7016/api/AllocateSubjects/${allocationId}`);
      console.log("Subject deallocation successful!");
      // Refresh allocations after successful deallocation
      fetchAllocations();
    } catch (error) {
      console.error("Error during deallocation:", error);
      // Handle error, show a message, etc.
    }
  };
  return (
    <div>
      <h1>Allocate Subjects</h1>

      <form onSubmit={handleAllocationSubmit}>
        <FormGroup>
          <Label for="studentId">Select Teacher:</Label>
          <Input type="select" name="teacherId" id="teacherId" onChange={handleAllocationChange}>
            <option value="">Select Student</option>
            {Teachers.map((Teacher) => (
              <option key={Teacher.teacherId} value={Teacher.teacherId}>
                {Teacher.firstName} {Teacher.lastName}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="subjectId">Select Subject:</Label>
          <Input type="select" name="subjectId" id="subjectId" onChange={handleAllocationChange}>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </Input>
        </FormGroup>

        <Button color="primary" type="submit">
          Allocate Subject
        </Button>
      </form>
      <Table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation) => (
            <tr key={allocation.allocationId}>
              <td>{`${allocation.teacher.firstName} ${allocation.teacher.lastName}`}</td>
              <td>{allocation.subject.subjectName}</td>
              <td>
                <Button color="danger" onClick={() => handleDeallocation(allocation.allocationId)}>
                  Deallocate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllocateSubjects;
