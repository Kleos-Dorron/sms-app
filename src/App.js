import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//7 Components
import StudentRegistration from "./components/Student-Registration";
import Teachers from "./components/Teachers/Teachers";
import Subjects from "./components/Subjects/Subjects";
import Classrooms from "./components/Classrooms/Classrooms";

import AllocateClassrooms from "./components/Allocate-Classrooms/Allocate-Classrooms";
import AllocateSubjects from "./components/Allocate-Subjects/Allocate-Subjects";
import StudentDetailReport from "./components/Student-Detail-Report/Student-Detail-Report";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          //Define the Path-Component
          <Route path="/" element={<StudentRegistration />} />
          <Route
            path="/StudentRegistration"
            element={<StudentRegistration />}
          />
          <Route path="/Teachers" element={<Teachers />} />
          <Route path="/Subjects" element={<Subjects />} />
          <Route path="/Classrooms" element={<Classrooms />} />
          <Route path="/AllocateClassrooms" element={<AllocateClassrooms />} />
          <Route path="/AllocateSubjects" element={<AllocateSubjects />} />
          <Route
            path="/StudentDetailReport"
            element={<StudentDetailReport />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
