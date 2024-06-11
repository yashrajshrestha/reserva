import React, { useState } from 'react';
import { Alert, Badge, Calendar } from 'antd';
import dayjs from 'dayjs';
import CustomModals from './CustomModal';
const getListData = (value) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
      ];
      break;
    case 10:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
        {
          type: 'error',
          content: 'This is error event.',
        },
      ];
      break;
    case 15:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event',
        },
        {
          type: 'success',
          content: 'This is very long usual event......',
        },
        {
          type: 'error',
          content: 'This is error event 1.',
        },
        {
          type: 'error',
          content: 'This is error event 2.',
        },
        {
          type: 'error',
          content: 'This is error event 3.',
        },
        {
          type: 'error',
          content: 'This is error event 4.',
        },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const CustomCalender = () => {
  // const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalContent,  setModalContent] = useState(null);


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
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };



  const onSelect = (newValue, source) => {

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

  

  return(
    <>
        <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
        <Calendar 
          cellRender={cellRender} 
          onSelect={(date, {source}) => {
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