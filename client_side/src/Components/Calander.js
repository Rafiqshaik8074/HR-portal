import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from 'react-bootstrap';

const CalendarRange = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (date) => {
    if (startDate === null) {
      setStartDate(setTimeToMidnight(date));
    } else {
      setEndDate(setTimeToMidnight(date));
    }
  };

  const setTimeToMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const highlightWeekend = (date) => {
    const day = date.getDay();
    const classNames = day === 0 || day === 6 ? 'weekend-day text-danger' : null;
    return classNames;
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-auto">
          <Form.Group>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              monthsShown={1}
              inline
              dayClassName={highlightWeekend}
              className="custom-datepicker" // Add custom class for styling
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
};

export default CalendarRange;