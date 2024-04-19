import styled from 'styled-components';

interface DivFlexProps {
  alignItems?: string;
  justifyContent?: string;
  flexDirection?: 'row' | 'column';
  padding?: string;
  paddingTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  margin?: string;
  marginTop?: string;
  gap?: string;
}

export const DivFlex = styled.div<DivFlexProps>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  flex-flow: ${(props) => props.flexFlow};
  padding: ${(props) => props.padding};
  padding-top: ${(props) => props.paddingTop};
  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
  align-items: ${(props) => props.alignItems};
  margin: ${(props) => props.margin};
  margin-top: ${(props) => props.marginTop};
  gap: ${(props) => props.gap};
`;

export const CommonLabel = styled.span<LabelProps>`
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  text-align: ${(props) => props.textCenter ? 'center' : props.textAlign};
  color: ${($props) => $props.color || $props.theme?.text?.primary || '#000000'};
  font-weight: ${($props) => $props.fontWeight};
  font-size: ${($props) => $props.fontSize}px;
  line-height: ${($props) => $props.lineHeight};
  word-break: ${($props) => $props.wordBreak};
`;

export const LabelWithLink = styled(CommonLabel)`
  a {
    color: inherit;
  }
`;

interface LabelProps {
  textCenter?: boolean;
  uppercase?: boolean;
  fontWeight?: string;
  fontSize?: number;
  lineHeight?: string;
  wordBreak?: string;
  textAlign?: string;
}

export const PrimaryLabel = styled.span<LabelProps>`
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  text-align: ${(props) => props.textCenter && 'center'};
  color: ${($props) => $props.color || $props.theme?.text?.primary || '#000000'};
  font-weight: ${($props) => $props.fontWeight || '500'};
  font-size: ${($props) => $props.fontSize || '45'}px;
  margin: ${($props) => $props.margin};
  line-height: 63px;
`;

export const SecondaryLabel = styled.span<LabelProps>`
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  text-align: ${(props) => props.textCenter && 'center'};
  color: ${($props) => $props.color || $props.theme?.text?.secondary || '#787b8e'};
  font-weight: ${($props) => $props.fontWeight || '600'};
  font-size: ${($props) => $props.fontSize || '12'}px;
  margin: ${($props) => $props.margin};
  line-height: 20px;
`;

export const StickyFooter = styled(DivFlex)`
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px 0px;
  width: 100%;
  background: ${(props) => props.theme?.background || 'white'};
  justify-content: center;
`;

export const PaddedBodyStickyFooter = styled.div<{ paddingBottom?: number }>`
  padding-bottom: ${(props) => `${props.paddingBottom}px` || '50px'};
`;

export const DivBottomShadow = styled(DivFlex)`
  ${({ theme }) => theme.boxShadow};
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding-bottom: 24px;
`;

export const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const ActionFooter = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
  @media screen and (max-width: 480px) {
    margin-top: 25px;
  }
`;
export const PageWrapper = styled.div`
  padding: 0 20px;
`;
export const PageBody = styled.div`
  height: auto;
  font-size: 16px;
`;
