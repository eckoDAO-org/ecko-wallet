import React from 'react';
import { CommonLabel, DivFlex } from '..';
import Button from '../Buttons';

interface ConfirmModalProps {
  text: React.ReactNode;
  onClose: any;
  onConfirm: any;
}

export const ConfirmModal = ({ text, onClose, onConfirm }: ConfirmModalProps) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ padding: '30px 0' }}>
      <CommonLabel fontSize={14}>{text}</CommonLabel>
    </div>
    <DivFlex padding="20px" justifyContent="space-between" gap="5px">
      <Button onClick={onClose} label="Cancel" size="full" variant="secondary" />
      <Button onClick={onConfirm} label="Confirm" size="full" />
    </DivFlex>
  </div>
);
