import React, { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Calendar, Divider, Flex, Select, Space } from 'antd';
import dayjs from 'dayjs';
import CustomModals from './CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, getHolidays, fetchCountries } from '../reducers/eventsSlice';
import { initializeSocket } from '../reducers/socketSlice';

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const CustomCalender = () => {
  // const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [month, setMonth] = useState(selectedValue.month());
  const [year, setYear] = useState(selectedValue.year());
  const [country, setCountry] = useState('NP');

  const dispatch = useDispatch();
  const events = useSelector(state => state.events.events);
  const holidays = useSelector(state => state.events.holidays);
  const eventStatus = useSelector(state => state.events.status);
  const error = useSelector(state => state.events.error);
  const notifications = useSelector(state => state.socket.notification);
  const countries = useSelector(state => state.events.countries);
  const hasMounted = useRef(false);

  console.log("holidays", holidays);
  useEffect(() => {
    if(!hasMounted.current){

      dispatch(initializeSocket());
      dispatch(fetchCountries());
      hasMounted.current = true;
    }
  }, [dispatch]);

  const getListData = (value) => {
    if (!events || events.length === 0) {
      return [];
    }

    const formattedDate = value.date().toString().padStart(2, '0'); // Ensure two-digit format
    const formattedMonth = (value.month() + 1).toString().padStart(2, '0'); // Ensure two-digit format

    const filteredEvents = events.filter(event => {
      const eventDayOfMonth = event?.start_date?.split('-')[1];
      const eventDayofDate = event?.start_date?.split('-')[2];
      return eventDayOfMonth === formattedMonth && eventDayofDate === formattedDate;
    });

    return filteredEvents.map((event) => ({
      type: 'success',
      content: event.title,
      ...event
    }));
  };

  const listHolidays = (value) => {
    if (!holidays || holidays.length == 0) {
      return [];
    }

    const formattedDate = value.date().toString().padStart(2, '0'); // Ensure two-digit format
    const formattedMonth = (value.month() + 1).toString().padStart(2, '0'); // Ensure two-digit format


    const filteredholidays = holidays.filter(holiday => {
      const eventDayOfMonth = holiday?.month
      const eventDayofDate = holiday?.day
      return eventDayOfMonth === formattedMonth && eventDayofDate === formattedDate;
    });

    return filteredholidays.map((holiday) => ({
      type: 'success',
      content: holiday.name,
    }));
  }

  useEffect(() => {
    dispatch(fetchEvents({ month: month + 1, year }));
  }, [month, year]);

  useEffect(() => {
    dispatch(getHolidays({ 'country': country, year: year == 2024 ? '2023' : year.toString() }));
  }, [country, year]);

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    const countryHolidays = listHolidays(value);
    return (
      <>
        <Flex gap="middle" vertical>
          {countryHolidays.map((item, index) => (
            <Badge key={index} style={{
              backgroundColor: '#52c41a',
            }} count={item.content} />
          ))}

          {listData.map((item, index) => (
            <Badge key={index} status={item.type} text={item.content} />
          ))}
        </Flex>
      </>
    );
  };
  const cellRender = (current, info) => {

    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  const handleChange = (value) => {
    // dispatch()
    setCountry(value);
  };

  const listCountries = () =>{
    return countries[0]?.map((country) => ({
        value: country.code,
        label: country.name
    }));
  }

  const onSelect = (newValue, source) => {

    setMonth(newValue.month());
    setYear(newValue.year());

    if (source === 'date') {

      setShowModal(true);
      let eventValue = {
        "date": newValue,
        "events": getListData(newValue)
      }
      setModalContent(eventValue);
    }


    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue) => {
    // setValue(newValue);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalContent(null);
  };



  return (
    <>
      {notifications?.map((notification, index) => (
        <Alert
          key={index}
          message="Event Notification"
          description={notification.message}
          type="info"
          showIcon
        />
      ))}
      <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
      <Divider />
      <Space wrap>
        <Select
          defaultValue="NP"
          style={{
            width: 120,
          }}
          onChange={handleChange}
          options={listCountries()}
        />
      </Space>
      <Calendar
        cellRender={cellRender}
        onSelect={(date, { source }) => {
          // Call onSelect function only when a cell is clicked
          onSelect(date, source);
        }}
      />

      <CustomModals
        visible={showModal}
        onCancel={handleModalClose}
        item={modalContent}
      />
    </>
  );
};

export default CustomCalender;