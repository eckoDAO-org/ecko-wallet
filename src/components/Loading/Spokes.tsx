import styled from 'styled-components';

const LoadingWrapper = styled.div`
  font-size: 80px;
  width: 1em;
  height: 1em;
  position: relative;
  .loader-wheel__spoke {
    display: block;
    position: absolute;
    width: 0.1em;
    height: 0.3em;
    background: #461A57;
    border-radius: 0.05em;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    opacity: 0;
    animation: fade 0.6s linear infinite;
  }
  
  @keyframes fade {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .loader-wheel__spoke:nth-child(1) { transform: rotate(0deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(2) { transform: rotate(30deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(3) { transform: rotate(60deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(4) { transform: rotate(90deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(5) { transform: rotate(120deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(6) { transform: rotate(150deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(7) { transform: rotate(180deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(8) { transform: rotate(210deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(9) { transform: rotate(240deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(10) { transform: rotate(270deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(11) { transform: rotate(300deg) translate(-50%, 70%); }
  .loader-wheel__spoke:nth-child(12) { transform: rotate(330deg) translate(-50%, 70%); }
  
  .loader-wheel__spoke:nth-child(2) { animation-delay: 0.05s; }
  .loader-wheel__spoke:nth-child(3) { animation-delay: 0.1s; }
  .loader-wheel__spoke:nth-child(4) { animation-delay: 0.15s; }
  .loader-wheel__spoke:nth-child(5) { animation-delay: 0.2s; }
  .loader-wheel__spoke:nth-child(6) { animation-delay: 0.25s; }
  .loader-wheel__spoke:nth-child(7) { animation-delay: 0.3s; }
  .loader-wheel__spoke:nth-child(8) { animation-delay: 0.35s; }
  .loader-wheel__spoke:nth-child(9) { animation-delay: 0.4s; }
  .loader-wheel__spoke:nth-child(10) { animation-delay: 0.45s; }
  .loader-wheel__spoke:nth-child(11) { animation-delay: 0.5s; }
  .loader-wheel__spoke:nth-child(12) { animation-delay: 0.55s; }  
`;

const SpokesLoading = () => (
  <LoadingWrapper>
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
    <span className="loader-wheel__spoke" />
  </LoadingWrapper>
);

export default SpokesLoading;
