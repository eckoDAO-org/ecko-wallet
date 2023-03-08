import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: ${(props) => props.weight}px solid ${(props) => props.color};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.background};
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
`;

const Spinner = ({ size = 50, color = 'rgba(255, 255, 255, 0.3)', weight = 3, ...props }: any) => (
  <SpinnerWrapper size={size} color={color} weight={weight} {...props} />
);

export default Spinner;
