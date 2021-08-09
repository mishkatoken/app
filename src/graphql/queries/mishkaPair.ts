import { gql } from '@apollo/client'
const mishkaPair = gql`
  {
    pair (
			id: "0x68ca62c3c0cc90c6501181d625e94b4f0fdc869c"
		) {
			reserveUSD
		}
  }
`

export default mishkaPair
