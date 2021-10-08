import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { PageHeader } from 'ui/component';
import TokenAmountInput from 'ui/component/TokenAmountInput';
import TagChainSelector from 'ui/component/ChainSelector/tag';
import { useWallet } from 'ui/utils';
import { formatTokenAmount, splitNumberByStep } from 'ui/utils/number';
import { CHAINS_ENUM, CHAINS } from 'consts';
import { TokenItem } from 'background/service/openapi';
import { Account } from 'background/service/preference';
import './style.less';

const Swap = () => {
  const { t } = useTranslation();
  const wallet = useWallet();
  const [chain, setChain] = useState(CHAINS_ENUM.BSC);
  const [fromUSDValue, setFromUSDValue] = useState('0');
  const [fromValue, setFromValue] = useState('');
  const [from, setFrom] = useState<TokenItem>({
    id: 'bsc',
    chain: 'bsc',
    name: 'BNB',
    symbol: 'BNB',
    display_symbol: null,
    optimized_symbol: 'BNB',
    decimals: 18,
    logo_url:
      'https://static.debank.com/image/bsc_token/logo_url/bsc/8bfdeaa46fe9be8f5cd43a53b8d1eea1.png',
    price: 351.4,
    is_verified: true,
    is_core: true,
    is_wallet: true,
    time_at: 0,
    amount: 0,
  });
  const [to, setTo] = useState<TokenItem | null>({
    amount: 0,
    chain: 'eth',
    decimals: 18,
    display_symbol: null,
    id: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    is_core: true,
    is_verified: true,
    is_wallet: true,
    logo_url:
      'https://static.debank.com/image/token/logo_url/0x4fabb145d64652a948d72533023f6e7a623c7c53/f0825e572298822e7689fe81150a195d.png',
    name: 'Binance USD',
    optimized_symbol: 'BUSD',
    price: 1,
    symbol: 'BUSD',
    time_at: 0,
  });
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const handleTokenChange = (token: TokenItem) => {
    setFrom(token);
  };

  const init = async () => {
    setCurrentAccount(await wallet.syncGetCurrentAccount());
  };

  const handleClickFromBalance = () => {
    const value = new BigNumber(from.amount).toFixed();
    setFromValue(value);
  };

  const handleChainChanged = (value: CHAINS_ENUM) => {
    setChain(value);
  };

  useEffect(() => {
    const target = CHAINS[chain];

    setFrom({
      id: target.serverId,
      chain: target.serverId,
      name: target.nativeTokenSymbol,
      symbol: target.nativeTokenSymbol,
      display_symbol: null,
      optimized_symbol: target.nativeTokenSymbol,
      decimals: 18,
      logo_url: '',
      price: 0,
      is_verified: true,
      is_core: true,
      is_wallet: true,
      time_at: 0,
      amount: 0,
    });
  }, [chain]);

  useEffect(() => {
    // TODO
  }, [fromValue]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="swap">
      <PageHeader>{t('Swap')}</PageHeader>
      <TagChainSelector value={chain} onChange={handleChainChanged} />
      <div className="swap-section">
        <div className="from-balance">
          <span className="cursor-pointer" onClick={handleClickFromBalance}>
            {t('Balance')}: {formatTokenAmount(from.amount, 8)}
          </span>
        </div>
        {currentAccount && (
          <TokenAmountInput
            address={currentAccount.address}
            token={from}
            value={fromValue}
            onTokenChange={handleTokenChange}
          />
        )}
      </div>
    </div>
  );
};

export default Swap;