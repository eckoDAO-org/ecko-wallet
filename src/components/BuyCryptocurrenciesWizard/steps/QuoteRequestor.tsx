import { QuoteRequestorStepProps } from './types';

const QuoteRequestor = ({ provider, View, Logic, goToNextStep }: QuoteRequestorStepProps) => (
  <Logic View={View} provider={provider} onQuoteRetrieved={goToNextStep} />
);

export default QuoteRequestor;
