import React, { useContext } from 'react';
import { ModalContext } from 'src/contexts/ModalContext';
import { DropdownModal } from '../DropdownModal';
import { RadioSelection, SelectionOption } from '../RadioSelection';

export const DropdownRadioModal = ({
  value,
  options,
  modalTitle,
  modalFooter,
  onChange,
  containerStyle,
  titleStyle,
  displayValue,
}: DropdownRadioModalProps) => {
  const { closeModal } = useContext(ModalContext);
  return (
    <DropdownModal
      title={displayValue || (value !== null && options.find((opt) => opt.value === value?.value)?.label)}
      modalTitle={modalTitle}
      containerStyle={containerStyle}
      titleStyle={titleStyle}
      modalContent={
        <div style={{ padding: '1rem' }}>
          <RadioSelection
            value={value?.value}
            options={options}
            onChange={(newValue) => {
              closeModal();
              onChange(options.find((opt) => opt.value === newValue));
            }}
          />
        </div>
      }
      modalFooter={modalFooter}
    />
  );
};

interface DropdownRadioModalProps {
  value: any;
  options: SelectionOption[];
  modalTitle: React.ReactNode;
  modalFooter?: React.ReactNode;
  containerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  onChange?: any;
  displayValue?: string;
}
