import { useMemo } from 'react';
import { DropdownRadioModal } from 'src/components/DropdownRadioModal';
import { SelectionOption } from 'src/components/RadioSelection';
import { useFungibleTokensList } from 'src/hooks/fungibleTokens';

const TokenFilter = ({
  token,
  onChangeToken,
}: TokenFilterProps) => {
  const tokens = useFungibleTokensList();
  const modalTokens = useMemo(() => {
    const convertedTokens = tokens.map((t) => ({
      label: t.symbol,
      value: t.contractAddress,
    }));

    return [
      {
        label: 'All',
        value: undefined,
      },
      ...convertedTokens,
    ];
  }, [tokens]);

  const selectedToken = modalTokens.find((a) => a.value === token) as SelectionOption;
  const displayValue = `Asset: ${selectedToken?.label}`;

  const handleChangeToken = (option?: SelectionOption) => {
    onChangeToken(option?.value);
  };

  return (
    <DropdownRadioModal
      modalTitle="Token"
      value={selectedToken}
      displayValue={displayValue}
      options={modalTokens}
      onChange={handleChangeToken}
      showFilter
    />
  );
};

export interface TokenFilterProps {
  token?: string;
  onChangeToken: (token: string | undefined) => void;
}

export default TokenFilter;
