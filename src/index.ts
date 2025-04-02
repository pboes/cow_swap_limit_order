import dotenv from "dotenv";
import { ethers } from "ethers";
import {
  TradingSdk,
  OrderKind,
  SupportedChainId,
  SigningScheme,
  LimitTradeParameters,
  OrderPostingResult,
} from "@cowprotocol/cow-sdk";

dotenv.config();

async function createLimitOrder(): Promise<void> {
  try {
    console.log("Starting limit order creation process...");

    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.gnosischain.com",
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    console.log("Wallet address:", await wallet.getAddress());

    const SAFE_ADDRESS = "0xb2ACc5943a2F72d994E5156544249E023889B953";
    console.log("Safe address:", SAFE_ADDRESS);

    const sdk = new TradingSdk({
      chainId: SupportedChainId.GNOSIS_CHAIN,
      signer: wallet,
      appCode: "limit_order_testing",
    });

    const parameters: LimitTradeParameters = {
      kind: OrderKind.BUY,
      sellToken: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
      sellTokenDecimals: 18,
      buyToken: "0xa34cc6726456a4e7be92b6575f6e0f3d2aa97155",
      buyTokenDecimals: 18,
      sellAmount: ethers.utils.parseUnits("0.1", 18).toString(),
      buyAmount: ethers.utils.parseUnits("700", 18).toString(),
      owner: SAFE_ADDRESS,
    };

    console.log("Creating order...");
    const result: OrderPostingResult = await sdk.postLimitOrder(parameters, {
      additionalParams: { signingScheme: SigningScheme.PRESIGN },
    });
    const orderId = result.orderId;
    console.log("Order ID received:", orderId);
  } catch (error) {
    console.error("Error encountered:", error);
    if ((error as any).body) {
      console.error("Error body:", (error as any).body);
    }
    throw error;
  }
}

createLimitOrder()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
