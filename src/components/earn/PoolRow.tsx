import { AVAX, BNB, ChainId, ETHER, JSBI, TokenAmount } from '@zeroexchange/sdk'
import { Break, CardNoise } from './styled'
import { ButtonPrimary, ButtonOutlined } from '../Button'
import { ExternalLink, StyledInternalLink, TYPE } from '../../theme'
import React, { useState } from 'react'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'

import { AutoColumn } from '../Column'
import { BIG_INT_SECONDS_IN_WEEK } from '../../constants'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { StakingInfo } from '../../state/stake/hooks'
import { currencyId } from '../../utils/currencyId'
import styled from 'styled-components'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { usePair } from '../../data/Reserves'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

const Wrapper = styled.tr<{ showBackground: boolean; bgColor: any }>``

const Details = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 34px;
  width: 100;
`
const DetailsBox = styled.div`
  flex: 1;
  flex-direction: column;
  padding: 34px;
  background: rgba(18, 21, 56, 0.24);
  border-radius: 44px;
`
export default function PoolRow({ stakingInfoTop }: { stakingInfoTop: StakingInfo }) {
  const { chainId, account } = useActiveWeb3React()
  const token0 = stakingInfoTop.tokens[0]
  const token1 = stakingInfoTop.tokens[1]

  const currency0 = unwrappedToken(token0, chainId)
  const currency1 = unwrappedToken(token1, chainId)

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyId(currency0)), useCurrency(currencyId(currency1))]

  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  const baseStakingInfo = useStakingInfo(stakingTokenPair)
  const stakingInfo = baseStakingInfo.find(x => x.stakingRewardAddress === stakingInfoTop.stakingRewardAddress)
  const stakingRewardAddress = stakingInfoTop.stakingRewardAddress
  const isStaking = Boolean(stakingInfo?.stakedAmount?.greaterThan('0'))

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const token = currencyA === ETHER || currencyA === AVAX || currencyA === BNB ? tokenB : tokenA
  const WETH = currencyA === ETHER || currencyA === AVAX || currencyA === BNB ? tokenA : tokenB
  const backgroundColor = useColor(token)

  // get WETH value of staked LP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && WETH) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  const symbol = WETH?.symbol

  return (
    <>
      <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
        <td style={{ display: 'inline' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />

            <TYPE.main fontWeight={500} fontSize={15} style={{ display: 'inline', marginLeft: '11px' }}>
              {currency0.symbol}-{currency1.symbol}
            </TYPE.main>
          </div>
        </td>
        <td>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            0
          </TYPE.main>
        </td>
        <td>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            80.1%
          </TYPE.main>
        </td>
        <td>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            $855.069.231
          </TYPE.main>
        </td>
        <td>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            40x
          </TYPE.main>
        </td>
        <td>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'right' }}>
            Details
          </TYPE.main>
        </td>
      </Wrapper>
      <tr>
        <td colSpan={6}>
          <Details>
            <DetailsBox>
              <TYPE.main fontWeight={500} fontSize={15}>
                Earned
              </TYPE.main>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexGrow: 1 }}>
                  <TYPE.white fontWeight={600} fontSize={32}>
                    0.784980
                  </TYPE.white>
                </div>
                <div style={{ display: 'flex', flexGrow: 0 }}>
                <ButtonPrimary padding="8px" borderRadius="8px">
                  Harvest
                </ButtonPrimary>
                </div>

              </div>
            </DetailsBox>
            <DetailsBox>
              <TYPE.white fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
                Start Farming
              </TYPE.white>
              <ButtonOutlined padding="8px" borderRadius="8px">
                Select
              </ButtonOutlined>
            </DetailsBox>
          </Details>
        </td>
      </tr>
    </>
  )
}