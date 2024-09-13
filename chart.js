import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ActivityChart = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDetails, setActivityDetails] = useState([]);

  useEffect(() => {
    // 샘플 데이터를 불러오는 부분 (API 대신 하드코딩된 데이터 사용)
    fetchData();
  }, [startDate, endDate]);

  // 샘플 데이터 생성
  const sampleData = [
    { name: "운동", value: 5 },
    { name: "독서", value: 3 },
    { name: "공부", value: 8 },
    { name: "휴식", value: 2 },
    { name: "요리", value: 1 },
  ];

  const sampleDetails = {
    "운동": [
      { time: "2024-09-10 08:00", description: "달리기", duration: 1 },
      { time: "2024-09-10 18:00", description: "헬스", duration: 2 },
      { time: "2024-09-11 07:30", description: "자전거", duration: 2 },
    ],
    "독서": [
      { time: "2024-09-10 14:00", description: "소설 읽기", duration: 1.5 },
      { time: "2024-09-11 15:30", description: "역사책 읽기", duration: 1.5 },
    ],
    "공부": [
      { time: "2024-09-10 09:00", description: "리액트 공부", duration: 4 },
      { time: "2024-09-11 10:00", description: "알고리즘 공부", duration: 4 },
    ],
    "휴식": [
      { time: "2024-09-10 12:00", description: "낮잠", duration: 1 },
      { time: "2024-09-11 12:30", description: "산책", duration: 1 },
    ],
    "요리": [
      { time: "2024-09-10 18:30", description: "저녁 준비", duration: 1 },
    ],
  };

  const fetchData = async () => {
    // 샘플 데이터를 설정 (실제 API 호출 대신)
    setData(sampleData);
    setSelectedActivity(null);
    setActivityDetails([]);
  };

  const fetchActivityDetails = (activityName) => {
    // 샘플 데이터를 기반으로 세부 데이터를 가져옴
    setActivityDetails(sampleDetails[activityName] || []);
  };

  const handleChartClick = (data) => {
    if (data && data.activeLabel) {
      const activityName = data.activeLabel;
      setSelectedActivity(activityName);
      fetchActivityDetails(activityName);
    }
  };

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} onClick={handleChartClick}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} hours`} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" label={{ position: "top" }}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart onClick={handleChartClick}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              fill="#8884d8"
              label={(entry) => `${entry.name} (${entry.value} hours)`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRandomColor()} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} hours`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderActivityDetails = () => {
    if (selectedActivity && activityDetails.length > 0) {
      return (
        <div style={{ marginTop: "20px" }}>
          <h3>Details for {selectedActivity}</h3>
          <ul>
            {activityDetails.map((detail, index) => (
              <li key={index}>
                {detail.time} - {detail.description} ({detail.duration} hours)
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      {renderChart()}
      {renderActivityDetails()}
    </div>
  );
};

export default ActivityChart;
