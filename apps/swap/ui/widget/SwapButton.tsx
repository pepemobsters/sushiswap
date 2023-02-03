'use client'

import { Button } from '@sushiswap/ui13/components/button'
import React, { FC, Fragment, useState } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ApprovalState, ApproveTokenController, Checker } from '@sushiswap/wagmi13'
import { ChainId } from '@sushiswap/chain'
import { useTrade } from '../../lib/useTrade'
import { Native } from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui13/types'
import { getRouteProcessorAddressForChainId } from 'lib/getRouteProcessorAddressForChainId'
import { Popover, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { warningSeverity } from '../../lib/warningSeverity'

export const SwapButton: FC = () => {
  const { appType, amount, network0, value, token0, token1 } = useSwapState()
  const { isFetching, isLoading, data: trade } = useTrade()
  const { setReview } = useSwapActions()
  const [checked, setChecked] = useState(false)

  const isWrap =
    appType === AppType.Swap && token0.isNative && token1.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1.isNative && token0.wrapped.address === Native.onChain(network0).wrapped.address

  return (
    <>
      <ApproveTokenController amount={amount} contract={getRouteProcessorAddressForChainId(ChainId.POLYGON)}>
        {({ approvalState }) => (
          <div className="pt-4">
            {approvalState === ApprovalState.NOT_APPROVED && (
              <Popover className="relative flex justify-center">
                <Popover.Button className="text-center text-xs text-blue cursor-pointer">
                  What is an approval?
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="border border-gray-300 dark:border-slate-700 dark:text-slate-200 absolute flex flex-col gap-3 bottom-7 bg-white dark:bg-slate-800 rounded-lg shadow-md px-4 py-3 text-xs mt-0.5">
                    <span className="text-gray-500 dark:text-slate-400">Token Approval</span>
                    We need your approval to execute this transaction on your behalf; you will only have to approve the{' '}
                    {amount?.currency.symbol} contract once.
                    <a
                      target="_blank"
                      className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center"
                      href="https://www.sushi.com/academy/articles/what-is-token-approval"
                      rel="noreferrer"
                    >
                      Learn more <ChevronRightIcon width={12} height={12} />
                    </a>
                  </Popover.Panel>
                </Transition>
              </Popover>
            )}
            <Checker.Network fullWidth size="xl" chainId={ChainId.POLYGON}>
              <Checker.Amounts fullWidth size="xl" chainId={network0} amounts={[amount]}>
                <Checker.ApproveERC20
                  id="approve-erc20"
                  fullWidth
                  size="xl"
                  amount={amount}
                  contract={getRouteProcessorAddressForChainId(ChainId.POLYGON)}
                >
                  <Button
                    disabled={
                      Boolean(isLoading && +value > 0) ||
                      isFetching ||
                      (!checked && warningSeverity(trade?.priceImpact) >= 3)
                    }
                    color={!checked && warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
                    fullWidth
                    size="xl"
                    onClick={() => setReview(true)}
                  >
                    {!checked && warningSeverity(trade?.priceImpact) >= 3
                      ? 'Price impact too high'
                      : isWrap
                      ? 'Wrap'
                      : isUnwrap
                      ? 'Unwrap'
                      : 'Swap'}
                  </Button>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </div>
        )}
      </ApproveTokenController>
      {warningSeverity(trade?.priceImpact) >= 3 && (
        <div className="rounded-xl px-4 py-3 bg-red/20 mt-4 flex items-start">
          <input
            id="expert-checkbox"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="expert-checkbox" className="ml-2 font-medium text-red-600">
            Price impact is too high. You will lose a big portion of your funds in this trade. Please tick the box if
            you would like to continue.
          </label>
        </div>
      )}
    </>
  )
}
