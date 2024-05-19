// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import studentService from "../../../services/student.service";
// import { useAuth } from "../../../context/AuthContext";
// import companyService from "../../../services/company.service";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Header from "../Header/Header";
// import { NavLink } from "react-router-dom";
// import placementService from "../../../services/placement.service";

// const CriteriaStyle = styled.div`
//   background-color: var(--color-grey-200);
//   min-height: 100vh;
//   padding: 10px;
// `;

// const Form = styled.form`
//   background-color: var(--color-grey-0);
//   border-radius: 10px;
//   box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
//   padding: 30px;
//   width: 100%;
//   max-width: 800px;
//   margin: 80px auto;
// `;

// const FormTitle = styled.h2`
//   text-align: center;
//   margin-bottom: 30px;
//   font-size: 24px;
//   box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
//   padding: 7px;
//   font-weight: 550;
//   border-radius: 5px;
// `;

// const FormGroup = styled.div`
//   margin-bottom: 30px;
// `;

// const Label = styled.label`
//   font-weight: bold;
//   margin-bottom: 7px;
//   display: block;
// `;

// const SelectStyled = styled.select`
//   padding: 5px;
//   border: 1px solid ${({ invalid }) => (invalid ? "red" : "#ccc")};
//   border-radius: 5px;
//   font-size: 16px;
//   width: 100%;
// `;

// const Input = styled.input`
//   padding: 8px;
//   width: 100%;
//   border-radius: 5px;
//   border: 1px solid #ccc;
// `;

// const Button = styled.button`
//   padding: 10px 30px;
//   background-color: #12a37f;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   font-size: 18px;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #16a37f;
//   }
// `;

// const ErrorText = styled.span`
//   color: red;
//   font-size: 14px;
//   margin-top: 5px;
//   display: block;
// `;

// const StyledNavLink = styled(NavLink)`
//   text-decoration: none;
// `;

// const OptionStyled = styled.option`
//   &.selected {
//     color: red;
//     background-color: #f0f0f0;
//   }
// `;

// const UpdateForm = () => {
//   const [studentData, setStudentData] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [studentPreferences, setStudentPreferences] = useState([]);
//   const [isDisabled, setIsDisabled] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [gender, setGender] = useState("");
//   const [errors, setErrors] = useState({
//     isDisabled: false,
//     gender: false,
//     preferences: [],
//   });
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { userId } = useAuth();
//   const [placementResults, setPlacementResults] = useState([]);

//   useEffect(() => {
//     const fetchPlacementResults = async () => {
//       try {
//         const results = await placementService.getPlacementResult(userId);
//         setPlacementResults(results);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching placement results:", error);
//       }
//     };

//     fetchPlacementResults();
//   }, [userId]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await studentService.getApplyStudentById(userId);
//         if (response.status) {
//           const student = response.applyStudents[0];
//           setStudentData(student);
//           const preferences = student.preferences.split(",").map(Number);
//           setStudentPreferences(preferences);
//           setIsDisabled(student.disability ? "true" : "false");
//           setGender(student.gender);
//         } else {
//           console.error("Failed to fetch student data:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response =
//           await companyService.getAllCompaniesWithoutPagination();
//         if (response.ok) {
//           const data = await response.json();
//           if (data && data.companies) {
//             setCompanies(data.companies);
//           } else {
//             console.error("Failed to fetch companies:", data);
//           }
//         } else {
//           console.error("Failed to fetch companies:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   const handlePreferenceChange = (e, preferenceIndex) => {
//     const selectedCompanyId = parseInt(e.target.value);
//     const updatedStudentPreferences = [...studentPreferences];
//     updatedStudentPreferences[preferenceIndex] = selectedCompanyId;
//     setStudentPreferences(updatedStudentPreferences);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const isGenderSelected = gender !== "";
//     const isDisabilitySelected = isDisabled !== "";
//     const areAllPreferencesSelected = studentPreferences.every(
//       (preference) => preference !== ""
//     );

//     setErrors({
//       isDisabled: !isDisabilitySelected,
//       gender: !isGenderSelected,
//       preferences: studentPreferences.map((preference) => !preference),
//     });

//     if (isGenderSelected && isDisabilitySelected && areAllPreferencesSelected) {
//       setIsSubmitted(true);

//       const formData = {
//         name: studentData.student_name,
//         disability: isDisabled === "true" ? 1 : 0,
//         gender,
//         preferences: studentPreferences,
//       };

//       try {
//         await studentService.updateStudentApplyForm(userId, formData);
//         setErrors({
//           isDisabled: false,
//           gender: false,
//           preferences: [],
//         });
//         setIsSubmitted(false);
//         toast.success("Form updated successfully!", { autoClose: 1000 });
//       } catch (error) {
//         console.error("Error updating student form:", error);
//       }
//     }
//   };

//   if (loading || !studentData || companies.length === 0) {
//     return <div>Loading...</div>;
//   }

//   const { student_id, student_name } = studentData;

//   return (
//     <CriteriaStyle>
//       <Header />
//       {placementResults[0]?.placement_id !== null ? (
//         <h2
//           style={{
//             marginTop: "70px",
//             background: "var(--color-grey-300)",
//             textAlign: "center",
//             padding: "15px",
//             alignItems: "center",
//           }}
//         >
//           Congratulations! Your placement has already been generated.
//           <Button
//             type="submit"
//             className="mt-3"
//             style={{ background: "#7DC400", marginLeft: "30px" }}
//             disabled={isSubmitted}
//           >
//             <StyledNavLink to="/student/placement-results">
//               See your placement result
//             </StyledNavLink>
//           </Button>
//         </h2>
//       ) : (
//         <Form onSubmit={handleSubmit}>
//           <FormTitle>May Be Update Your Application Form 👇</FormTitle>
//           <FormGroup
//             style={{
//               display: "flex",
//               gap: "2rem",
//               border: "none",
//               alignItems: "center",
//             }}
//           >
//             <Label htmlFor="studentId">Student ID:</Label>
//             <Input
//               style={{
//                 width: "20%",
//                 border: "none",
//                 marginTop: "-6px",
//                 fontWeight: "700",
//               }}
//               type="text"
//               id="studentId"
//               value={student_id}
//               onChange={(e) =>
//                 setStudentData({ ...studentData, student_id: e.target.value })
//               }
//               readOnly
//             />

//             <Label htmlFor="studentName">Name:</Label>
//             <Input
//               style={{
//                 width: "20%",
//                 border: "none",
//                 marginTop: "-5px",
//                 fontWeight: "700",
//               }}
//               type="text"
//               id="studentName"
//               value={student_name}
//               onChange={(e) =>
//                 setStudentData({ ...studentData, student_name: e.target.value })
//               }
//               readOnly
//             />
//           </FormGroup>
//           <FormGroup>
//             <Label>Gender:</Label>
//             <div>
//               <label>
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="M"
//                   checked={gender === "M"}
//                   onChange={(e) => setGender(e.target.value)}
//                 />
//                 Male
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="F"
//                   checked={gender === "F"}
//                   onChange={(e) => setGender(e.target.value)}
//                 />
//                 Female
//               </label>
//               {errors.gender && (
//                 <ErrorText>Please specify your gender</ErrorText>
//               )}
//             </div>
//           </FormGroup>
//           <FormGroup>
//             <Label>Disability:</Label>
//             <div>
//               <label>
//                 <input
//                   type="radio"
//                   name="disability"
//                   value="true"
//                   checked={isDisabled === "true"}
//                   onChange={(e) => setIsDisabled(e.target.value)}
//                 />
//                 Yes
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="disability"
//                   value="false"
//                   checked={isDisabled === "false"}
//                   onChange={(e) => setIsDisabled(e.target.value)}
//                 />
//                 No
//               </label>
//               {errors.isDisabled && (
//                 <ErrorText>Please specify if you have a disability</ErrorText>
//               )}
//             </div>
//           </FormGroup>
//           <FormGroup>
//             <Label htmlFor="preference1">Company Preference 1:</Label>
//             <SelectStyled
//               id="preference1"
//               value={studentPreferences[0] || ""}
//               onChange={(e) => handlePreferenceChange(e, 0)}
//               invalid={errors.preferences[0]}
//             >
//               <option value="">Select a company</option>
//               {companies.map((company) => (
//                 <OptionStyled
//                   key={company.company_id}
//                   value={company.company_id}
//                   className={
//                     studentPreferences.includes(company.company_id)
//                       ? "selected"
//                       : ""
//                   }
//                 >
//                   {company.company_name}
//                 </OptionStyled>
//               ))}
//             </SelectStyled>
//             {errors.preferences[0] && (
//               <ErrorText>Please select your 1st preference</ErrorText>
//             )}
//           </FormGroup>
//           <FormGroup>
//             <Label htmlFor="preference2">Company Preference 2:</Label>
//             <SelectStyled
//               id="preference2"
//               value={studentPreferences[1] || ""}
//               onChange={(e) => handlePreferenceChange(e, 1)}
//               invalid={errors.preferences[1]}
//             >
//               <option value="">Select a company</option>
//               {companies.map((company) => (
//                 <OptionStyled
//                   key={company.company_id}
//                   value={company.company_id}
//                   // className={
//                   //   studentPreferences.includes(company.company_id)
//                   //     ? "selected"
//                   //     : ""
//                   // }
//                 >
//                   {company.company_name}
//                 </OptionStyled>
//               ))}
//             </SelectStyled>
//             {errors.preferences[1] && (
//               <ErrorText>Please select your 2nd preference</ErrorText>
//             )}
//           </FormGroup>
//           <FormGroup>
//             <Label htmlFor="preference3">Company Preference 3:</Label>
//             <SelectStyled
//               id="preference3"
//               value={studentPreferences[2] || ""}
//               onChange={(e) => handlePreferenceChange(e, 2)}
//               invalid={errors.preferences[2]}
//             >
//               <option value="">Select a company</option>
//               {companies.map((company) => (
//                 <option
//                   key={company.company_id}
//                   value={company.company_id}
//                   style={
//                     studentPreferences.includes(company.company_id)
//                       ? { color: "red" }
//                       : {}
//                   }
//                 >
//                   {company.company_name}
//                 </option>
//               ))}
//             </SelectStyled>
//             {errors.preferences[2] && (
//               <ErrorText>Please select your 3rd preference</ErrorText>
//             )}
//           </FormGroup>
//           <Button type="submit" disabled={isSubmitted}>
//             Update
//           </Button>
//           <ToastContainer />
//         </Form>
//       )}
//     </CriteriaStyle>
//   );
// };

// export default UpdateForm;
