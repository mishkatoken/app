import { gql } from '@apollo/client'
const transactions = gql`
  query Transactions($ids: [String!]) {
    transactions(orderBy: timestamp, orderDirection: desc, where: { id_in: $ids }) {
      mints(orderBy: timestamp, orderDirection: desc, where: { pair_in: ["0x68ca62c3c0cc90c6501181d625e94b4f0fdc869c"] }) {
        transaction {
          id
          timestamp
          __typename
        }
        pair {
          token0 {
            id
            symbol
            __typename
          }
          token1 {
            id
            symbol
            __typename
          }
          __typename
        }
        to
        liquidity
        amount0
        amount1
        amountUSD
        __typename
      }
      burns(orderBy: timestamp, orderDirection: desc, where: { pair_in: ["0x68ca62c3c0cc90c6501181d625e94b4f0fdc869c"] }) {
        transaction {
          id
          timestamp
          __typename
        }
        pair {
          token0 {
            id
            symbol
            __typename
          }
          token1 {
            id
            symbol
            __typename
          }
          __typename
        }
        sender
        liquidity
        amount0
        amount1
        amountUSD
        __typename
      }
      swaps(orderBy: timestamp, orderDirection: desc, where: { pair_in: ["0x68ca62c3c0cc90c6501181d625e94b4f0fdc869c"] }) {
        transaction {
          id
          timestamp
          __typename
        }
        pair {
          token0 {
            id
            symbol
            __typename
          }
          token1 {
            id
            symbol
            __typename
          }
          __typename
        }
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUSD
        to
        __typename
      }
      __typename
    }
  }
`

export default transactions
