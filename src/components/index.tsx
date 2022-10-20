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
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  color: ${($props) => $props.color || '#000000'};
  font-weight: ${($props) => $props.fontWeight};
  font-size: ${($props) => $props.fontSize}px;
  line-height: ${($props) => $props.lineHeight};
`;

export const PrimaryLabel = styled.span`
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  color: ${($props) => $props.color || '#000000'};
  font-weight: ${($props) => $props.fontWeight || '500'};
  font-size: ${($props) => $props.fontSize || '45'}px;
  line-height: 63px;
`;

export const SecondaryLabel = styled.span`
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  color: ${($props) => $props.color || '#787b8e'};
  font-weight: 600;
  font-size: ${($props) => $props.fontSize || '12'}px;
  line-height: 20px;
`;

export const StickyFooter = styled(DivFlex)`
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px 0px;
  width: 100%;
  background: white;
  justify-content: center;
`;

export const DivBottomShadow = styled(DivFlex)`
  box-shadow: 0px 167px 67px rgba(36, 8, 43, 0.01), 0px 94px 57px rgba(36, 8, 43, 0.03), 0px 42px 42px rgba(36, 8, 43, 0.06),
    0px 10px 23px rgba(36, 8, 43, 0.06), 0px 0px 0px rgba(36, 8, 43, 0.07);
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding-bottom: 24px;
`;
