export interface SigningRequest {
  code: string;
  data: object;
  caps: [
    {
      role: string;
      description: string;
      cap: {
        args: string[];
        name: string;
      };
    },
  ];
  nonce: string;
  chainId: string;
  gasLimit: number;
  ttl: number;
  sender: string;
  extraSigners: string[];
}

export interface SigningResponse {
  body: {
    cmd: string;
    sigs: [
      {
        sig: string;
      },
    ];
    hash: string;
  };
  chainId: string;
}

interface Signer {
  pubKey: string;
  sig?: string;
}

// type defined in KIP-15
export interface CommandSigData {
  sigs: Signer[];
  cmd: string;
}
