import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StepContainer = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  margin: 24px;
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Image = styled.img`
  width: auto;
  height: 64px;
`;

type Props = React.PropsWithChildren<{
  providerImage: string;
}>;

const FullPageWithPoweredByLayout = ({
  providerImage,
  children,
}: Props) => (
  <Container>
    <StepContainer>
      {children}
    </StepContainer>
    <Footer>
      Powered by
      <Image src={providerImage} />
    </Footer>
  </Container>
);

export default FullPageWithPoweredByLayout;
