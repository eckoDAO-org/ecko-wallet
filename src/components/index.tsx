import styled from 'styled-components';

export const DivFlex = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  padding: ${(props) => props.padding};
  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
  align-items: ${(props) => props.alignItems};
  margin: ${(props) => props.margin};
  margin-top: ${(props) => props.marginTop};
  gap: ${(props) => props.gap}; ;
`;

export const CommonLabel = styled.span`
  text-transform: uppercase;
  color: ${($props) => $props.color || '#000000'};
  font-weight: ${($props) => $props.fontWeight};
  font-size: ${($props) => $props.fontSize};
  line-height: ${($props) => $props.lineHeight};
`;

export const PrimaryLabel = styled.span`
  text-transform: uppercase;
  color: ${($props) => $props.color || '#000000'};
  font-weight: ${($props) => $props.fontWeight || '500'};
  font-size: ${($props) => $props.fontSize || '52'}px;
  line-height: 63px;
`;

export const SecondaryLabel = styled.span`
  text-transform: uppercase;
  color: ${($props) => $props.color || '#787b8e'};
  font-weight: 600;
  font-size: ${($props) => $props.fontSize || '12'}px;
  line-height: 20px;
`;
