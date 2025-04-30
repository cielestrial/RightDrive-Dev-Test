# RightDrive Dev Test

## Specifications

- I was unable to install Material UI 4, so Material UI 5 was used instead.
- There is no official Enzyme Adapter for React 18 and because I am using Vite instead of CRA, I opted to use Vitest and RTL instead of Jest and Enzyme.
- My crypto api of choice has been switched to CoinGecko from Coinpaprika.
- Due to the CORS, I decided to create a backend with Express and Redis to communicate with the CoinGecko api. Due to github pages lack of support for any backend applications, I decided to host the project on Netlify.

#### _Author: cielestrial_
