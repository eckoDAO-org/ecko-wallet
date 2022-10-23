import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Body } from '../SendTransactions/styles';
import { ButtonCancel, ButtonImport, Footer } from '../Setting/Contact/views/style';

const ConfirmDelete = styled.div`
  width: 398px;
  height: 270px;
  background: #f9f9f9;
  border-radius: 12px;
  z-index: 999;
  padding: 40px 0;
`;
const TitileConfirm = styled.h1`
  font-weight: bold;
  font-size: 25px;
  line-height: 29px;

  text-align: center;
`;
const DesConfirm = styled.h1`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
`;

const PopupConfirmDelete = () => {
  const history = useHistory();
  const goCancel = () => {
    history.push('/networks');
  };
  const cancel = 'Cancel';
  const remove = 'Remove';
  return (
    <ConfirmDelete>
      <Body>
        <TitileConfirm>Remove network?</TitileConfirm>
        <DesConfirm>Are you sure you want to remove?</DesConfirm>
        <Footer>
          <ButtonCancel onClick={goCancel}>{cancel}</ButtonCancel>
          <ButtonImport>{remove}</ButtonImport>
        </Footer>
      </Body>
    </ConfirmDelete>
  );
};
export default PopupConfirmDelete;
