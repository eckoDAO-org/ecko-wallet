import { Radio } from 'src/components/Radio';
import { DivFlex } from '..';

export const RadioSelection = ({ options, value, onChange }: RadioSelectionProps) => (
  <DivFlex flexDirection="column">
    {options.map((opt: any) => (
      <Radio isChecked={value === opt.value} label={opt.label} onClick={() => onChange(opt.value)} style={{ margin: '10px 0' }} />
    ))}
  </DivFlex>
);

interface RadioSelectionOption {
  label: string;
  value: any;
}

interface RadioSelectionProps {
  value: any;
  options: RadioSelectionOption[];
  onChange: (value: any) => any;
}
