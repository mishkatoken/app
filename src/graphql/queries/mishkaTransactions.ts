import { gql } from '@apollo/client'
const mishkaTransactions = gql`
  query Swaps($first: Int!, $skip: Int!) {
    swaps (
			first: $first,
			skip: $skip,
			orderBy: timestamp,
			orderDirection: desc,
			where: {
				pair: "0x68ca62c3c0cc90c6501181d625e94b4f0fdc869c"
			}
		) {
			transaction {
				id
			}
			to
		}
  }
`

export default mishkaTransactions
