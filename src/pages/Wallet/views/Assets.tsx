import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import images from 'src/images';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ESTIMATE_KDA_TO_USD_API } from 'src/utils/config';
import { BigNumberConverter } from 'src/utils';

const WrapAssets = styled.div``;

const Transaction = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(68, 68, 68, 0.4);
`;
const DivChild = styled.div`
  margin-top: ${(props) => props.marginTop};
  margin-right: ${(props) => props.marginRight};
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};

`;
const Tokens = styled.div`
  margin-bottom: 60px;
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
`;
const ImageBorder = styled(Image)`
  /* border: 1px solid #c4c4c4; */
  border-radius: 50%;
  /* padding: 1px; */
`;

const DivFlex = styled.div`
  display: flex;
`;
const DivCenter = styled.div`
  margin: auto 0;
`;
const AddMoreToken = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;
const DivText = styled.div`
  display: inline-block;
  border-radius: 18px;
  border: 1px solid #461A57;
  color: #461A57;
  font-size: 12px;
  padding: 11px 24px;
  cursor: pointer;
`;
const TokenChild = (props: any) => {
  const {
    value, src, valueUSD, tokenType,
  } = props;
  return (
    <DivChild>
      <Transaction>
        <DivFlex>
          <DivChild marginRight="17px">
            <ImageBorder size="44px" src={src} alt="logo" />
          </DivChild>
          <DivCenter>
            <DivChild fontSize="16px" color="#461A57">
              {value}
              {' '}
              {tokenType}
            </DivChild>
            <DivChild marginTop="3px" fontSize="12px" color="#7b7b7b">
              $
              {valueUSD}
            </DivChild>
          </DivCenter>
        </DivFlex>
        <DivCenter>
          <Image
            size="20px"
            width="11px"
            src={images.wallet.view}
            alt=""
          />
        </DivCenter>
      </Transaction>
    </DivChild>
  );
};

const Assets = () => {
  const history = useHistory();
  const { balance } = useSelector((state) => state?.wallet);
  const [balanceKDAtoUSD, setbalanceKDAtoUSD] = useState(balance);
  useEffect(() => {
    fetch(ESTIMATE_KDA_TO_USD_API)
      .then((res) => res.json())
      .then(
        (result) => {
          setbalanceKDAtoUSD(BigNumberConverter(Number(balance) * Number(result?.kadena?.usd)));
        },
        () => {},
      );
  }, [balance]);
  return (
    <WrapAssets>
      <Tokens>
        <TokenChild value={balance} tokenType="KDA" valueUSD={balanceKDAtoUSD} src={images.wallet.kdaIcon} />
        <TokenChild value="0" tokenType="Flux" valueUSD="0" src={images.wallet.iconFlux} />
      </Tokens>
      <AddMoreToken>
        <DivText onClick={() => history.push('/import-token')}>
          Add more token
        </DivText>
      </AddMoreToken>
    </WrapAssets>
  );
};

export default Assets;
