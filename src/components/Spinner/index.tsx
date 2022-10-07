import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: ${(props) => props.weight}px solid ${(props) => props.color};
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
`;

const Spinner = ({ size = 50, color = 'rgba(255, 255, 255, 0.3)', weight = 3 }: SpinnerProps) => (
  <SpinnerWrapper size={size} color={color} weight={weight} />
);

interface SpinnerProps {
  size?: number;
  color?: string;
  weight?: number;
}

export default Spinner;
