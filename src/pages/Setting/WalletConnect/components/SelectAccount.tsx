import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useState } from 'react';
import { DivFlex } from 'src/components';
import { useSelector } from 'react-redux';
import { Radio } from 'src/components/Radio';
import { shortenAddress } from 'src/utils';

const CustomButton = styled.div`
  margin-top: 20px;
`;

const SelectAccount = ({ onConfirmAccounts }: { onConfirmAccounts: (accounts: string[]) => any }) => {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const rootState = useSelector((state) => state);
  const { wallets } = rootState?.wallet;

  const toggleAccount = (publicKey) => {
    if (selectedAccounts?.includes(publicKey)) {
      setSelectedAccounts([...selectedAccounts?.filter((a) => a !== publicKey)]);
    } else {
      setSelectedAccounts([...selectedAccounts, publicKey]);
    }
  };

  return (
    <DivFlex flexDirection="column" padding="10px 20px">
      {wallets.map((w) => (
        <Radio
          isChecked={selectedAccounts.includes(w.publicKey)}
          label={shortenAddress(w.account)}
          onClick={() => toggleAccount(w.publicKey)}
          style={{ margin: '10px 0' }}
        />
      ))}
      <CustomButton>
        <Button size="full" variant="primary" onClick={() => onConfirmAccounts(selectedAccounts)} label="Confirm" />
      </CustomButton>
    </DivFlex>
  );
};
export default SelectAccount;
