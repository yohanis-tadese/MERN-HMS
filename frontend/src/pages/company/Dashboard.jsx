import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import placementService from "../../services/placement.service";
import { useAuth } from "../../context/AuthContext";
import ReactApexChart from "react-apexcharts";
import Boxs from "../../ui/Boxes";
import Box from "../../ui/Box";
import DashboardContainer from "../../ui/DashboardContainer";
// import { fetchRemainingTime } from "../../utils/timeUtils";

const IconContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const StyledLink = styled(Link)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #0984e3;
  text-decoration: none;
  font-weight: bold;
`;

const PieChartContainer = styled.div``;

function Dashboard() {
  const [numStudents, setNumStudents] = useState(0);
  const [numCompletedStudents, setNumCompletedStudents] = useState(0);
  const [studentData, setStudentData] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const { userId } = useAuth();

  const [remainingTime, setRemainingTime] = useState(null);

  // useEffect(() => {
  //   fetchRemainingTime(1).then((remainingTime) => {
  //     setRemainingTime(remainingTime);
  //   });
  // }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const studentResponse =
          await placementService.getAllPlacementResultsByCompanyId(userId);

        setStudentData(studentResponse);

        const completedStudents = studentResponse.filter(
          (student) => student.student_status === "Completed"
        );

        setNumStudents(studentResponse.length);
        setNumCompletedStudents(completedStudents.length);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
      setLoadingStudents(false);
    }

    fetchData();
  }, [userId]);

  const calculateDepartmentDistribution = () => {
    const departmentCounts = {};
    studentData.forEach((student) => {
      if (departmentCounts.hasOwnProperty(student.department_name)) {
        departmentCounts[student.department_name]++;
      } else {
        departmentCounts[student.department_name] = 1;
      }
    });

    return departmentCounts;
  };

  const departmentDistributionData = {
    labels: Object.keys(calculateDepartmentDistribution()),
    series: Object.values(calculateDepartmentDistribution()),
  };

  const pieOptions = {
    labels: departmentDistributionData.labels,
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#66ff33", "#ff33cc", "#9966ff"],
    legend: {
      position: "right",
    },
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Company Dashboard</Heading>
      </Row>

      <DashboardContainer>
        <Boxs>
          <Box>
            <Heading as="h2">Number of Accepted Students</Heading>
            {loadingStudents ? (
              <Spinner />
            ) : (
              <>
                <h3>{numStudents}</h3>
                <IconContainer>
                  <FaUserGraduate size={24} color="#0984e3" />
                </IconContainer>
                <StyledLink to="/company/student"> See Detail</StyledLink>
              </>
            )}
          </Box>
          <br />

          <Box>
            <Heading as="h2">Number of Internship Students</Heading>
            {loadingStudents ? (
              <Spinner />
            ) : (
              <>
                <h3>{numCompletedStudents}</h3>
                <IconContainer>
                  <FaUserGraduate size={24} color="#0984e3" />
                </IconContainer>
                <StyledLink to="/company/student"> See Detail</StyledLink>
              </>
            )}
          </Box>
        </Boxs>
        {remainingTime <= 0 ? (
          <Box>
            <Heading as="h2">Accepted Students Per Departments</Heading>
            <IconContainer>
              <FaUserGraduate size={24} color="#0984e3" />
            </IconContainer>
            {loadingStudents ? (
              <Spinner />
            ) : (
              <PieChartContainer>
                <ReactApexChart
                  options={pieOptions}
                  series={departmentDistributionData.series}
                  type="pie"
                  width="380"
                />
              </PieChartContainer>
            )}

            <StyledLink to="/company/student"> See Detail</StyledLink>
          </Box>
        ) : (
          ""
        )}
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
