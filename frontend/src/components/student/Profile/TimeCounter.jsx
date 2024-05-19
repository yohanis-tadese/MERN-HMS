import React from "react";
import styled from "styled-components";

const TimeCounterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 7px;
  font-size: 20px;
  position: absolute;
  bottom: 60px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--color-grey-200);
  text-align: center;
`;

const TimeMessage = styled.div`
  font-weight: 550;
  font-size: 16px;
`;

const TimeUnit = styled.div`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 3px;
  border-radius: 7px;
  font-size: 18px;
`;

const TimeDescription = styled.div`
  font-size: 14px;
`;

const TimeCounter = ({ remainingTime }) => {
  const formatTime = (time) => {
    const days = Math.floor(time / (3600 * 24));
    const hours = Math.floor((time % (3600 * 24)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${days.toString().padStart(2, "0")} ${hours
      .toString()
      .padStart(2, "0")} ${minutes.toString().padStart(2, "0")} ${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <TimeCounterContainer>
      {remainingTime === 0 ? (
        <TimeMessage>
          The time for submitting your application has expired.
        </TimeMessage>
      ) : (
        <>
          <TimeMessage style={{ marginBottom: "15px" }}>
            Time Remaining to Submit Your Application:
          </TimeMessage>
          <div>
            <TimeUnit>{formatTime(remainingTime).split(" ")[0]}</TimeUnit>
            <TimeDescription>Days</TimeDescription>
          </div>
          <div>
            <TimeUnit>{formatTime(remainingTime).split(" ")[1]}</TimeUnit>
            <TimeDescription>Hours</TimeDescription>
          </div>
          <div>
            <TimeUnit>{formatTime(remainingTime).split(" ")[2]}</TimeUnit>
            <TimeDescription>Minutes</TimeDescription>
          </div>
          <div>
            <TimeUnit>{formatTime(remainingTime).split(" ")[3]}</TimeUnit>
            <TimeDescription>Seconds</TimeDescription>
          </div>
        </>
      )}
    </TimeCounterContainer>
  );
};

export default TimeCounter;
