import { memo } from 'react';
import { DropdownRadioModal } from 'src/components/DropdownRadioModal';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { SLabel } from './BaseTextInput';

interface BaseModalSelectProps {
  value: any;
  title: any;
  options?: object[];
  onChange: any;
}

const BaseModalSelect = memo(({ title, options = [], value, onChange }: BaseModalSelectProps) => {
  const { theme } = useAppThemeContext();
  return (
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
          background: theme.input?.background,
          borderRadius: 10,
          height: 40,
          border: 'none',
        }}
      />
    </div>
  );
});
export default BaseModalSelect;
