import { useEffect } from 'react';
import styled from 'styled-components';
import { convertTowCharacters, shortenAddress } from 'src/utils';

const Div = styled.div`
  border: 1px solid #461A57;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};
`;
const Activity = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DivFlex = styled.div`
  display: flex;
`;

const DivChild = styled.div`
  margin-right: ${(props) => props.marginRight};
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  margin-left: ${(props) => props.marginLeft};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  text-align: ${(props) => props.textAlign};
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
`;
const DivCenter = styled.div`
  margin: auto 0;
`;
const Span = styled.span`
  margin-right: ${(props) => props.marginRight};
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  word-break: break-word;
  font-weight: ${(props) => props.fontWeight};
`;
const FinishTransferItem = (props: any) => {
  const {
    src, createdTime, chainId, value, tokenType, receiver, status, domain,
  } = props;
  useEffect(() => {

  }, []);
  const newTime = new Date(createdTime);
  const year = newTime.getFullYear();
  const month = convertTowCharacters(newTime.getMonth() + 1);
  const day = convertTowCharacters(newTime.getDate());
  const hours = convertTowCharacters(newTime.getHours());
  const minutes = convertTowCharacters(newTime.getMinutes());
  const seconds = convertTowCharacters(newTime.getSeconds());
  const dateString = `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
  return (
    <Div marginLeft="20px" marginRight="20px">
      <Activity>
        <DivFlex>
          <DivCenter><Image size="24px" width="24px" src={src} alt="logo" /></DivCenter>
          <DivChild marginLeft="20px">
            <DivChild marginBottom="5px">
              <Span color="#461A57" fontSize="14px" marginRight="5px">
                {dateString}
              </Span>
            </DivChild>
            <DivChild>
              {domain ? (
                <Span fontSize="13px" color="#461A57" fontWeight="700">{`${domain}${status !== 'success' ? ' - ' : ''}`}</Span>
              ) : (
                <>
                  <Span fontSize="13px" color="#461A57" fontWeight="700">
                    {`${shortenAddress(receiver)} - `}
                  </Span>
                  <Span fontSize="13px" color="#461A57" fontWeight="700">{`Chain ${chainId}${status !== 'success' ? ' - ' : ''}`}</Span>
                </>
              )}
              {
                status === 'pending' && <Span color="#eca822" fontSize="10px" fontWeight="700">Pending</Span>
              }
              {
                status === 'failure' && <Span color="#f44336" fontSize="10px" fontWeight="700">Failed</Span>
              }
              {
                status === 'finishing' && <Span color="#eca822" fontSize="10px" fontWeight="700">Finishing</Span>
              }
            </DivChild>
          </DivChild>
        </DivFlex>
        <DivChild>
          <DivChild fontSize="14px" color="#461A57" marginBottom="5px">{`-${value}`}</DivChild>
          <DivChild fontSize="14px" color="#461A57" textAlign="right">{tokenType}</DivChild>
        </DivChild>
      </Activity>
    </Div>
  );
};

export default FinishTransferItem;
