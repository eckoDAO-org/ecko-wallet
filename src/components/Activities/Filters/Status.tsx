import { DropdownRadioModal } from 'src/components/DropdownRadioModal';
import { SelectionOption } from 'src/components/RadioSelection';
import { Status, StatusValue, statuses } from './types';

const StatusFilter = ({
  status,
  onChangeStatus,
}: StatusFilterProps) => {
  const selectedStatus = statuses.find((s) => s.value === status) as Status;
  const displayValue = `Status: ${selectedStatus.label}`;

  const handleChangeStatus = (option: SelectionOption) => {
    const newStatus = statuses.find((s) => s.label === option.label);
    if (newStatus) {
      onChangeStatus(newStatus.value);
    }
  };

  return (
    <DropdownRadioModal
      modalTitle="Status"
      value={selectedStatus}
      displayValue={displayValue}
      options={statuses}
      onChange={handleChangeStatus}
    />
  );
};

export interface StatusFilterProps {
  status: StatusValue;
  onChangeStatus: (status: StatusValue) => void;
}

export default StatusFilter;
