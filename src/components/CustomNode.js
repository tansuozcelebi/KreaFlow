import React from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { format } from 'date-fns';

const NodeContainer = styled.div`
  background: ${props => {
    switch(props.status) {
      case 'completed': return 'linear-gradient(135deg, #28a745, #20c997)';
      case 'pending': return 'linear-gradient(135deg, #ffc107, #fd7e14)';
      case 'rejected': return 'linear-gradient(135deg, #dc3545, #e83e8c)';
      case 'active': return 'linear-gradient(135deg, #007bff, #6610f2)';
      default: return 'linear-gradient(135deg, #6c757d, #495057)';
    }
  }};
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: 500;
  min-width: 200px;
  max-width: 250px;
  position: relative;
  border: 3px solid ${props => props.isActive ? '#fff' : 'transparent'};
  animation: ${props => props.isActive ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
    50% { box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4); }
    100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
  }
`;

const NodeLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const NodeDescription = styled.div`
  font-size: 0.8rem;
  margin-bottom: 8px;
  opacity: 0.9;
  line-height: 1.3;
`;

const NodeEmail = styled.div`
  font-size: 0.7rem;
  opacity: 0.8;
  font-style: italic;
  margin-bottom: 8px;
`;

const NodeTimestamp = styled.div`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-bottom: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.approve {
    background: rgba(255, 255, 255, 0.9);
    color: #28a745;
    
    &:hover {
      background: #fff;
      transform: translateY(-1px);
    }
  }
  
  &.reject {
    background: rgba(255, 255, 255, 0.9);
    color: #dc3545;
    
    &:hover {
      background: #fff;
      transform: translateY(-1px);
    }
  }
`;

const StatusIcon = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

function CustomNode({ data }) {
  const getStatusIcon = () => {
    switch(data.status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'active': return '🔄';
      case 'waiting': return '⏸️';
      default: return '⚪';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return '';
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#fff',
          border: '2px solid #667eea',
          width: 10,
          height: 10,
        }}
      />
      
      <NodeContainer status={data.status} isActive={data.isActive}>
        <StatusIcon>{getStatusIcon()}</StatusIcon>
        
        <NodeLabel>{data.label}</NodeLabel>
        
        <NodeDescription>{data.description}</NodeDescription>
        
        {data.email && (
          <NodeEmail>📧 {data.email}</NodeEmail>
        )}
        
        {data.timestamp && (
          <NodeTimestamp>
            🕒 {formatTimestamp(data.timestamp)}
          </NodeTimestamp>
        )}
        
        {data.isActive && data.onApprove && data.onReject && (
          <ButtonContainer>
            <ActionButton 
              className="approve" 
              onClick={data.onApprove}
              title="Onayla"
            >
              ✅ Onayla
            </ActionButton>
            <ActionButton 
              className="reject" 
              onClick={data.onReject}
              title="Reddet"
            >
              ❌ Reddet
            </ActionButton>
          </ButtonContainer>
        )}
      </NodeContainer>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#fff',
          border: '2px solid #667eea',
          width: 10,
          height: 10,
        }}
      />
    </>
  );
}

export default CustomNode;