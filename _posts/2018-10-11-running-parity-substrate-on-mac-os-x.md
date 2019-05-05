---
title: Running Parity Substrate on Mac OS X
date: 2018-10-11T15:06:45-08:00
author: Shawn Tabrizi
layout: post
permalink: /substrate/running-parity-substrate-on-mac-os-x/
categories:
- Substrate
tags:
- bbq birch
- osx
- parity
- polkadot
- substrate
---

This guide will show you the steps to successfully connect to the Substrate testnet, BBQ Birch using Mac OS X.

All of the instructions on this page are commands which should be copied into your [Terminal application](https://support.apple.com/guide/terminal/welcome/mac).

## Prerequisites

First we need to install [Rust](https://www.rust-lang.org/). Open the terminal app on your Mac, and run the following:

```bash
curl https://sh.rustup.rs -sSf | sh
```

Follow the instructions that appear to complete the installation.

> At the end of this installation, you will need to run `source $HOME/.cargo/env` or log out and back into your computer to have your terminal understand `rustup`/`cargo` commands.

To enable [Rust to compile to WebAssembly](https://www.hellorust.com/news/native-wasm-target.html), run the following:

```bash
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
cargo install --git https://github.com/alexcrichton/wasm-gc
```

Install the [Homebrew](https://brew.sh/) package manager for OS X:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Follow the instructions that appear to complete the installation.

Finally install some general packages required for running this software:

```bash
brew install cmake pkg-config openssl git
```

> Click each package to learn more about it: [cmake](https://cmake.org/), [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/), [openssl](https://www.openssl.org/), [git](https://git-scm.com/)

## Installing Substrate

Navigate to the folder of your choice, and clone the Substrate repository there:

```bash
git clone https://github.com/paritytech/substrate.git
cd substrate
```

Then build the WebAssembly binaries required for Substrate:

```bash
./scripts/build.sh
```

Finally build the Rust native code:

```bash
cargo build
```

> Optional: If you want to make sure everything got installed correctly, you can run the full suite of Substrate tests:
> 
> ```bash
> cargo test --all
> ```

## Running the Substrate Testnet: BBQ Birch

To start syncing your BBQ Birch node, simply type:

```bash
cargo run
```

![Screenshot of BBQ Birch running in Terminal](https://i.imgur.com/jxqqr9Q.png)

## What next?

More documentation to come on interacting with the network!
