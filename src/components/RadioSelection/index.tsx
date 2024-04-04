import { Radio } from 'src/components/Radio';
import { DivFlex } from '..';

export const RadioSelection = ({ options, value, onChange }: RadioSelectionProps) => (
  <DivFlex flexDirection="column">
    {options.map((opt) => (
      <Radio
        key={opt.value}
        isChecked={value === opt.value}
        label={opt.label}
        onClick={() => onChange(opt.value)}
        style={{ margin: '10px 0' }}
      />
    ))}
  </DivFlex>
);

export interface SelectionOption {
  label: string;
  value: string | undefined;
}

interface RadioSelectionProps {
  value: SelectionOption['value'];
  options: SelectionOption[];
  onChange: (value: SelectionOption['value']) => any;
}
