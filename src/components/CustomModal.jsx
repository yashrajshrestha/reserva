import React, { useState } from 'react';
import { Button, Modal, Typography } from 'antd';
// import ReactHtmlParser from 'react-html-parser';
const {Title} = Typography;

const CustomModals = ({ visible, onCancel, item }) => {

  return (
    <Modal
      title={`You selected date: ${item?.date?.format('YYYY-MM-DD')}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      {item?.events?.map((value, index)=>{
        return value.content;
      })}
    </Modal>
  );
};

export default CustomModals;