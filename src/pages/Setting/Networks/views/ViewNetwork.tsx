import { BaseTextInput } from 'src/baseComponent';
import { Content } from '../../style';
import { DivBodyNetwork } from './style';

type Props = {
  network: any;
};

const ViewNetwork = (props: Props) => {
  const { network } = props;

  return (
    <Content>
      <DivBodyNetwork>
        <BaseTextInput
          inputProps={{
            value: network.name,
            readOnly: true,
          }}
          title="Network Name"
          height="auto"
        />
      </DivBodyNetwork>
      <DivBodyNetwork>
        <BaseTextInput
          inputProps={{
            readOnly: true,
            value: network.url,
          }}
          title="New RPC URL"
          height="auto"
        />
      </DivBodyNetwork>
      <DivBodyNetwork>
        <BaseTextInput
          inputProps={{
            readOnly: true,
            value: network.explorer,
          }}
          title="Block Explorer URL"
          height="auto"
        />
      </DivBodyNetwork>
      <DivBodyNetwork>
        <BaseTextInput
          inputProps={{
            readOnly: true,
            value: network.networkId,
          }}
          title="Network ID"
          height="auto"
        />
      </DivBodyNetwork>
    </Content>
  );
};

export default ViewNetwork;
