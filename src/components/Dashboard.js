import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const DashboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-height: 600px;
  overflow-y: auto;
`;

const DashboardTitle = styled.h2`
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RequestCard = styled.div`
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
  
  &.expanded {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const EmployeeName = styled.h3`
  color: #333;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
`;

const DateRange = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const Reason = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status) {
      case 'pending':
        return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
      case 'approved':
        return 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
      case 'rejected':
        return 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
      default:
        return 'background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db;';
    }
  }}
`;

const RequestDetails = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e1e5e9;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #555;
`;

const DetailValue = styled.span`
  color: #333;
`;

const FlowHistory = styled.div`
  margin-top: 15px;
`;

const HistoryTitle = styled.h4`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1rem;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryIcon = styled.div`
  font-size: 1.2rem;
`;

const HistoryContent = styled.div`
  flex: 1;
`;

const HistoryStep = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const HistoryTime = styled.div`
  color: #666;
  font-size: 0.8rem;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  
  h3 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

function Dashboard({ requests, onUpdateRequest }) {
  const [expandedRequest, setExpandedRequest] = useState(null);

  const toggleExpand = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return timestamp;
    }
  };

  const formatDateRange = (startDate, endDate) => {
    try {
      const start = format(new Date(startDate), 'dd MMM yyyy');
      const end = format(new Date(endDate), 'dd MMM yyyy');
      return `${start} - ${end}`;
    } catch (error) {
      return `${startDate} - ${endDate}`;
    }
  };

  const calculateDaysDifference = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } catch (error) {
      return 0;
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

  const getHistoryIcon = (step, status) => {
    if (status === 'completed') return '✅';
    if (status === 'rejected') return '❌';
    if (status === 'pending') return '⏳';
    
    switch(step) {
      case 'submitted': return '📝';
      case 'manager': return '👨‍💼';
      case 'director': return '👔';
      default: return '📋';
    }
  };

  const getCurrentStepText = (currentStep) => {
    switch(currentStep) {
      case 'manager': return 'Amir onayında';
      case 'director': return 'Üst amir onayında';
      case 'completed': return 'Tamamlandı';
      case 'rejected': return 'Reddedildi';
      default: return 'Bilinmeyen';
    }
  };

  if (requests.length === 0) {
    return (
      <DashboardContainer>
        <DashboardTitle>
          📋 İzin Talepleri
        </DashboardTitle>
        <EmptyState>
          <div className="icon">📝</div>
          <h3>Henüz izin talebi yok</h3>
          <p>Sol taraftaki formu kullanarak yeni bir izin talebi oluşturabilirsiniz.</p>
        </EmptyState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardTitle>
        📋 İzin Talepleri ({requests.length})
      </DashboardTitle>
      
      {requests.map(request => (
        <RequestCard 
          key={request.id} 
          className={expandedRequest === request.id ? 'expanded' : ''}
        >
          <RequestHeader>
            <RequestInfo>
              <EmployeeName>{request.employeeName}</EmployeeName>
              <DateRange>
                📅 {formatDateRange(request.startDate, request.endDate)} ({calculateDaysDifference(request.startDate, request.endDate)} gün)
              </DateRange>
              <Reason>💭 {request.reason}</Reason>
            </RequestInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StatusBadge status={request.status}>
                {getStatusText(request.status)}
              </StatusBadge>
              <ExpandButton onClick={() => toggleExpand(request.id)}>
                {expandedRequest === request.id ? '▲' : '▼'}
              </ExpandButton>
            </div>
          </RequestHeader>
          
          {expandedRequest === request.id && (
            <RequestDetails>
              <DetailRow>
                <DetailLabel>📧 Çalışan Email:</DetailLabel>
                <DetailValue>{request.employeeEmail}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>👨‍💼 Amir Email:</DetailLabel>
                <DetailValue>{request.managerEmail}</DetailValue>
              </DetailRow>
                             <DetailRow>
                 <DetailLabel>👔 Üst Amir Email:</DetailLabel>
                 <DetailValue>{request.directorEmail}</DetailValue>
               </DetailRow>
              <DetailRow>
                <DetailLabel>📍 Mevcut Aşama:</DetailLabel>
                <DetailValue>{getCurrentStepText(request.currentStep)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>📅 Talep Tarihi:</DetailLabel>
                <DetailValue>{formatDateTime(request.submittedAt)}</DetailValue>
              </DetailRow>
              
              <FlowHistory>
                <HistoryTitle>📜 Süreç Geçmişi</HistoryTitle>
                {request.flowHistory && request.flowHistory.map((historyItem, index) => (
                  <HistoryItem key={index}>
                    <HistoryIcon>
                      {getHistoryIcon(historyItem.step, historyItem.status)}
                    </HistoryIcon>
                    <HistoryContent>
                      <HistoryStep>{historyItem.note}</HistoryStep>
                      <HistoryTime>{formatDateTime(historyItem.timestamp)}</HistoryTime>
                    </HistoryContent>
                  </HistoryItem>
                ))}
              </FlowHistory>
            </RequestDetails>
          )}
        </RequestCard>
      ))}
    </DashboardContainer>
  );
}

export default Dashboard;