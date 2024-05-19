import timeService from "../services/time.service";

const fetchRemainingTime = async (setId) => {
  try {
    const timeData = await timeService.getTimeById(setId);

    // Convert end time to Eastern Africa Time (EAT)
    const formattedEndTime = new Date(timeData.end_time).toLocaleString(
      "en-US",
      { timeZone: "Africa/Nairobi" }
    );

    // Calculate remaining seconds based on the converted end time and current time
    const endTime = new Date(formattedEndTime).getTime();
    const currentTime = new Date().getTime();
    const remainingSeconds = Math.max(
      0,
      Math.floor((endTime - currentTime) / 1000)
    );
    return remainingSeconds;
  } catch (error) {
    console.error("Error fetching time data:", error);
    return null;
  }
};

export { fetchRemainingTime };
