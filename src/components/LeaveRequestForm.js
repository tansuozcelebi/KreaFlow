import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FormTitle = styled.h2`
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
`;

function LeaveRequestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeEmail: '',
    startDate: '',
    endDate: '',
    reason: '',
    managerEmail: '',
    directorEmail: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Çalışan adı gereklidir';
    }
    
    if (!formData.employeeEmail.trim()) {
      newErrors.employeeEmail = 'Çalışan email adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.employeeEmail)) {
      newErrors.employeeEmail = 'Geçerli bir email adresi giriniz';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi gereklidir';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi gereklidir';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'İzin sebebi gereklidir';
    }
    
    if (!formData.managerEmail.trim()) {
      newErrors.managerEmail = 'Amir email adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) {
      newErrors.managerEmail = 'Geçerli bir email adresi giriniz';
    }
    
    if (!formData.directorEmail.trim()) {
      newErrors.directorEmail = 'Üst amir email adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.directorEmail)) {
      newErrors.directorEmail = 'Geçerli bir email adresi giriniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Form başarıyla gönderildi
      setFormData({
        employeeName: '',
        employeeEmail: '',
        startDate: '',
        endDate: '',
        reason: '',
        managerEmail: '',
        directorEmail: ''
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('Form gönderim hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        📝 Yeni İzin Talebi
      </FormTitle>
      
      {showSuccess && (
        <SuccessMessage>
          ✅ İzin talebiniz başarıyla gönderildi! Onay süreci başlatıldı.
        </SuccessMessage>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="employeeName">Çalışan Adı</Label>
          <Input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="Adınızı giriniz"
          />
          {errors.employeeName && <ErrorMessage>{errors.employeeName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="employeeEmail">Çalışan Email</Label>
          <Input
            type="email"
            id="employeeEmail"
            name="employeeEmail"
            value={formData.employeeEmail}
            onChange={handleChange}
            placeholder="email@sirket.com"
          />
          {errors.employeeEmail && <ErrorMessage>{errors.employeeEmail}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">Başlangıç Tarihi</Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">Bitiş Tarihi</Label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
          />
          {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="reason">İzin Sebebi</Label>
          <TextArea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="İzin almanızın sebebini açıklayınız..."
          />
          {errors.reason && <ErrorMessage>{errors.reason}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="managerEmail">Amir Email</Label>
          <Input
            type="email"
            id="managerEmail"
            name="managerEmail"
            value={formData.managerEmail}
            onChange={handleChange}
            placeholder="amir@sirket.com"
          />
          {errors.managerEmail && <ErrorMessage>{errors.managerEmail}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="directorEmail">Üst Amir Email</Label>
          <Input
            type="email"
            id="directorEmail"
            name="directorEmail"
            value={formData.directorEmail}
            onChange={handleChange}
            placeholder="ustAmir@sirket.com"
          />
          {errors.directorEmail && <ErrorMessage>{errors.directorEmail}</ErrorMessage>}
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '📤 Gönderiliyor...' : '🚀 İzin Talebini Gönder'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default LeaveRequestForm;