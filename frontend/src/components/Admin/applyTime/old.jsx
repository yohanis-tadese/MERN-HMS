import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import timeService from "../../../services/time.service";
import { fetchRemainingTime } from "../../../utils/timeUtils";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -15px;
`;

const ApplyTimeForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 600px;
  gap: 2rem;
  padding: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ApplyTime = () => {
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
  });

  console.log("Formdata", formData);

  useEffect(() => {
    console.log("Fetching time data...");
    const fetchTime = async () => {
      try {
        const timeId = 1;
        const response = await timeService.getTimeById(timeId);

        // Format the fetched time values using Africa/Nairobi time zone
        const formattedStartTime = new Date(response.start_time)
          .toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
          .replace(", ", "T"); // Adjusting format for datetime-local input
        const formattedEndTime = new Date(response.end_time)
          .toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
          .replace(", ", "T"); // Adjusting format for datetime-local input

        setFormData({
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        });
      } catch (error) {
        console.error("Error fetching time:", error);
        toast.error("Error fetching time", { autoClose: 2000 });
      }
    };

    fetchTime();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await timeService.updateTime(1, formData);

      toast.success("Time updated successfully", { autoClose: 1000 });
    } catch (error) {
      console.error("Error updating time:", error);
      toast.error("Error updating time", { autoClose: 1500 });
    }
  };

  return (
    <Container>
      <ApplyTimeForm onSubmit={handleSubmit}>
        <Input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={formData.start_time || ""}
          onChange={handleChange}
          required
        />
        <Input
          type="datetime-local"
          id="end_time"
          name="end_time"
          value={formData.end_time || ""}
          onChange={handleChange}
          required
        />
        <Button
          style={{
            padding: "10px 25px",
            background: "#7DC400",
            fontWeight: "600",
          }}
          type="submit"
        >
          Update
        </Button>
      </ApplyTimeForm>
      <ToastContainer />
    </Container>
  );
};

export default ApplyTime;
