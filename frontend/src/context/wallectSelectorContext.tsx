import type { AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import type { ReactNode } from "react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { distinctUntilChanged, map } from "rxjs";
import { Loading } from "@/components/walletModal/loading";

const CONTRACT_ID = "guest-book.testnet";
declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: "testnet",
      debug: true,
      modules: [
        setupMyNearWallet(),
        // setupLedger(),
        // setupNearWallet(),
        // setupSender(),
        // setupMathWallet(),
        // setupNightly(),
        // setupMeteorWallet(),
        // setupNearSnap(),
        // setupNarwallets(),
        // setupWelldoneWallet(),
        // setupHereWallet(),
        // setupCoin98Wallet(),
        // setupNearFi(),
        // setupNeth({
        //   gas: "300000000000000",
        //   bundle: false,
        // }),
        // setupOptoWallet(),
        // setupFinerWallet(),
        // setupXDEFI(),
        // setupWalletConnect({
        //   projectId: "c8cb6204543639c31aef44ea4837a554",
        //   metadata: {
        //     name: "NEAR Wallet Selector",
        //     description: "Example dApp used by NEAR Wallet Selector",
        //     url: "https://github.com/near/wallet-selector",
        //     icons: ["https://avatars.githubusercontent.com/u/37784886"],
        //   },
        // }),
        // setupNightlyConnect({
        //   url: "wss://relay.nightly.app/app",
        //   appMetadata: {
        //     additionalInfo: "",
        //     application: "NEAR Wallet Selector",
        //     description: "Example dApp used by NEAR Wallet Selector",
        //     icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
        //   },
        // }),
      ],
    });
    const _modal = setupModal(_selector, {
      contractId: CONTRACT_ID,
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts);

        setAccounts(nextAccounts);
      });

    const onHideSubscription = modal!.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`);
    });

    return () => {
      subscription.unsubscribe();
      onHideSubscription.remove();
    };
  }, [selector]);

  if (!selector || !modal) {
    return <Loading />;
  }

  const accountId =
    accounts.find((account) => account.active)?.accountId || null;

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}