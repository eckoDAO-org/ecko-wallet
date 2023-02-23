import { memo } from 'react';
import { DropdownRadioModal } from 'src/components/DropdownRadioModal';
import { SLabel } from './BaseTextInput';

interface BaseModalSelectProps {
  value: any;
  title: any;
  options?: object[];
  onChange: any;
}

const BaseModalSelect = memo(({ title, options = [], value, onChange }: BaseModalSelectProps) => (
  <div>
    <SLabel>{title}</SLabel>
    <DropdownRadioModal
      value={value}
      modalTitle={title}
      options={options as any}
      onChange={onChange}
      titleStyle={{
        padding: '5px 10px',
        fontSize: '16px',
        fontWeight: 500,
      }}
      containerStyle={{
        background: '#F6F6FA',
        borderRadius: 10,
        height: 40,
        border: 'none',
      }}
    />
  </div>
));
export default BaseModalSelect;
