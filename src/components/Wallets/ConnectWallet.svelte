<script>
  import { Tezos } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { ThanosWallet } from "@thanos-wallet/dapp";
  import store from "../../store.js";
  import tezbridgeIcon from "../../../public/images/tezbridge-icon.png";
  import beaconIcon from "../../../public/images/beacon-icon.png";
  import thanosIcon from "../../../public/images/thanos-icon.png";

  const initTezBridgeWallet = async () => {
    // connect with tezbridge
    try {
      if (!$store.network) throw "No selected network";

      const signer = new TezBridgeSigner();
      Tezos.setSignerProvider(new TezBridgeSigner());
      const userAddress = await signer.publicKeyHash();
      // updates user address
      status.updateUserAddress(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  const initBeaconWallet = async () => {
    // connect with beacon
    try {
      if (!$store.network) throw "No selected network";

      const options = {
        name: "Contract Originator",
        eventHandlers: {
          PERMISSION_REQUEST_SUCCESS: {
            handler: async data => {}
          },
          OPERATION_REQUEST_SENT: {
            handler: async data => {}
          },
          OPERATION_REQUEST_SUCCESSFUL: {
            handler: async data => {}
          }
        }
      };
      const wallet = new BeaconWallet(options);
      await wallet.requestPermissions({
        network: {
          type:
            $store.network === "mainnet" || $store.network === "carthagenet"
              ? $store.network
              : "custom"
        }
      });
      Tezos.setWalletProvider(wallet);
      const userAddress = wallet.permissions.address;
      store.updateUserAddress(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  const initThanosWallet = async () => {
    // connect with thanos
    try {
      if (!$store.network) throw "No selected network";

      const available = await ThanosWallet.isAvailable();
      if (!available) {
        throw new Error("Thanos Wallet not installed");
      }

      const wallet = new ThanosWallet("Contract Originator");
      await wallet.connect(
        $store.network === "mainnet" || $store.network === "carthagenet"
          ? $store.network
          : "sandbox"
      );
      Tezos.setWalletProvider(wallet);

      store.updateUserAddress(wallet.pkh);
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style>
  .wallet-icon {
    height: 20px;
    width: 20px;
    vertical-align: middle;
    margin-right: 20px;
  }

  a {
    text-decoration: none;
  }
</style>

<div class="dropdown is-hoverable">
  <div class="dropdown-trigger">
    <button
      class="button is-primary"
      aria-haspopup="true"
      aria-controls="dropdown-connect-wallet"
      disabled={!$store.network}>
      <span class="icon">
        <i class="fas fa-wallet" />
      </span>
      <span>Connect your wallet</span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-connect-wallet" role="menu">
    <div class="dropdown-content">
      <a
        href="/"
        class="dropdown-item has-text-left"
        on:click|preventDefault={initTezBridgeWallet}>
        <img src={tezbridgeIcon} alt="tezbridge" class="wallet-icon" />
        <strong>TezBridge</strong>
      </a>
      <a
        href="/"
        class="dropdown-item has-text-left"
        on:click|preventDefault={initBeaconWallet}>
        <img src={beaconIcon} alt="beacon" class="wallet-icon" />
        <strong>Beacon</strong>
      </a>
      <a
        href="/"
        class="dropdown-item has-text-left"
        on:click|preventDefault={initThanosWallet}>
        <img src={thanosIcon} alt="thanos" class="wallet-icon" />
        <strong>Thanos</strong>
      </a>
    </div>
  </div>
</div>
