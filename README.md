<br />
<p align="center">
  <a href="https://wahd.app">
    <img src="assets/images/banner.jpg" style="border-radius: 10px" alt="banner">
  </a>

  <h1 align="center">Wahdapp</h1>

  <p align="center">
    Official source code of Wahdapp's mobile application
    <br />
    <br />
    <a aria-label="made with expo" href="https://github.com/expo" target="_blank">
    <img src="https://img.shields.io/badge/MADE%20WITH%20EXPO-000.svg?logo=expo&labelColor=4630eb">
  </a>
    <a href="https://discord.gg/Zn4698v8pM" target="_blank"><img alt="Discord Chat" src="https://img.shields.io/discord/787953609471688734.svg?logo=discord&color=%236DC7B0"></a>
    <a href="https://opensource.org/licenses/MIT" target="_blank"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
    <br />
    <br />
    <a href="">Google Play</a>
    ·
    <a href="">App Store</a>
    <br />
    <br />
  </p>
</p>

The application is written using React Native + Expo SDK and runs on both Android and iOS platforms.

## App Screenshots

| ![](.github/images/wahdapp-mockup.png) | ![](.github/images/wahdapp-mockup-2.png) | ![](.github/images/wahdapp-mockup-3.png) | ![](.github/images/wahdapp-mockup-4.png) |
| :------------------------------------: | :--------------------------------------: | :--------------------------------------: | :--------------------------------------: |

## Project Setup

Clone the repository from Github:

```
git clone https://github.com/wahdapp/Wahdapp.git
```

Install dependencies using yarn:

```
yarn
```

Since the application is going to read values from `.env`, you will need to create one first. `.env-sample` contains the necessary credentials to connect to a testing Firebase account. You may copy `.env-sample` and name it as `.env`:

```
cp .env-sample .env
```

To run the app on expo, simply run:

```
yarn start
```

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md).
