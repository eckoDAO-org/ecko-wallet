import React from 'react';
import { DropdownModal } from '../DropdownModal';
import { SelectionOption } from '../RadioSelection';
import ModalContent from './ModalContent';

export const DropdownRadioModal = ({
  value,
  options,
  modalTitle,
  modalFooter,
  onChange,
  containerStyle,
  titleStyle,
  displayValue,
  showFilter,
}: DropdownRadioModalProps) => (
  <DropdownModal
    title={displayValue || (value !== null && options.find((opt) => opt.value === value?.value)?.label)}
    modalTitle={modalTitle}
    containerStyle={containerStyle}
    titleStyle={titleStyle}
    modalContent={<ModalContent value={value} options={options} onChange={onChange} showFilter={showFilter} />}
    modalFooter={modalFooter}
  />
);

interface DropdownRadioModalProps {
  value: SelectionOption;
  options: SelectionOption[];
  modalTitle: React.ReactNode;
  modalFooter?: React.ReactNode;
  containerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  onChange?: (value: SelectionOption) => void;
  displayValue?: string;
  showFilter?: boolean;
}
