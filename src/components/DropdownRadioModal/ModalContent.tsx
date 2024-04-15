import { useState } from 'react';
import { useModalContext } from 'src/contexts/ModalContext';
import { BaseTextInput } from 'src/baseComponent';
import { RadioSelection, SelectionOption } from 'src/components/RadioSelection';
import images from 'src/images';

const ModalContent = ({
  value,
  options,
  onChange,
  showFilter,
}: ModalContentProps) => {
  const [search, setSearch] = useState<string>('');
  const { closeModal } = useModalContext();
  const filteredOptions = showFilter ? options.filter(
    (opt) => (
      opt.label.toLowerCase().includes(search.toLowerCase())
    ),
  ) : options;

  return (
    <div style={{ padding: '1rem' }}>
      { showFilter && (
        <BaseTextInput
          title=""
          height="auto"
          inputProps={{
            placeholder: 'Search',
            value: search,
          }}
          image={{
            width: '20px',
            height: '20px',
            src: images.search,
            callback: () => {},
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          wrapperStyle={{
            marginBottom: '1rem',
          }}
        />
      )}

      <RadioSelection
        value={value.value}
        options={filteredOptions}
        onChange={(newValue) => {
          closeModal();
          const selectedOption = options.find((opt) => opt.value === newValue) as SelectionOption;
          onChange?.(selectedOption);
        }}
      />
    </div>
  );
};

export interface ModalContentProps {
  value: SelectionOption;
  options: SelectionOption[];
  onChange?: (value: SelectionOption) => void;
  showFilter?: boolean;
}

export default ModalContent;
