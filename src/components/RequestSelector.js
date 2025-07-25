import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const SelectorContainer = styled.div`
  margin-bottom: 15px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  option {
    padding: 8px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
`;

function RequestSelector({ requests, selectedRequestId, onSelectRequest }) {
  const formatDateRange = (startDate, endDate) => {
    try {
      const start = format(new Date(startDate), 'dd/MM/yyyy');
      const end = format(new Date(endDate), 'dd/MM/yyyy');
      return `${start} - ${end}`;
    } catch (error) {
      return `${startDate} - ${endDate}`;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Beklemede';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  };

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '⚪';
    }
  };

  return (
    <SelectorContainer>
      <Label htmlFor="request-selector">İzin Talebini Seçin:</Label>
      <Select
        id="request-selector"
        value={selectedRequestId || ''}
        onChange={(e) => onSelectRequest(e.target.value)}
      >
        {requests.length === 0 ? (
          <option value="">Henüz izin talebi bulunmuyor</option>
        ) : (
          requests.map(request => (
            <option key={request.id} value={request.id}>
              {getStatusEmoji(request.status)} {request.employeeName} - {formatDateRange(request.startDate, request.endDate)} ({getStatusText(request.status)})
            </option>
          ))
        )}
      </Select>
    </SelectorContainer>
  );
}

export default RequestSelector;