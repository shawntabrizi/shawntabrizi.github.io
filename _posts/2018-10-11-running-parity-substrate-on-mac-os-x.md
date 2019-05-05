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

<p>This guide will show you the steps to successfully connect to the Substrate testnet, BBQ Birch using Mac OS X.</p>
<p>All of the instructions on this page are commands which should be copied into your <a
                href="https://support.apple.com/guide/terminal/welcome/mac" target="_blank">Terminal application</a>.
</p>
<h2 id="Prerequisites"><a class="anchor hidden-xs" href="#Prerequisites" title="Prerequisites"><span
                        class="octicon octicon-link"></span></a>Prerequisites</h2>
<p>First we need to install <a href="https://www.rust-lang.org/">Rust</a>. Open the terminal app on your Mac, and run
        the following:</p>
<pre><code>curl https://sh.rustup.rs -sSf | sh
</code></pre>
<p>Follow the instructions that appear to complete the installation.</p>
<blockquote>
        <p>At the end of this installation, you will need to run <code>source $HOME/.cargo/env</code> or log out and
                back into your computer to have your terminal understand <code>rustup</code>/<code>cargo</code>
                commands.</p>
</blockquote>
<p>To enable <a href="https://www.hellorust.com/news/native-wasm-target.html" target="_blank">Rust to compile to
                WebAssembly</a>,
        run the following:</p>
<pre><code>rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
cargo install --git https://github.com/alexcrichton/wasm-gc
</code></pre>
<p>Install the <a href="https://brew.sh/" target="_blank">Homebrew</a> package manager for OS X:</p>
<pre><code>/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
</code></pre>
<p>Follow the instructions that appear to complete the installation.</p>
<p>Finally install some general packages required for running this software:</p>
<pre><code>brew install cmake pkg-config openssl git
</code></pre>
<blockquote>
        <p>Click each package to learn more about it: <a href="https://cmake.org/" target="_blank">cmake</a>, <a
                        href="https://www.freedesktop.org/wiki/Software/pkg-config/" target="_blank">pkg-config</a>, <a
                        href="https://www.openssl.org/" target="_blank">openssl</a>, <a href="https://git-scm.com/"
                        target="_blank">git</a></p>
</blockquote>
<h2 id="Installing-Substrate"><a class="anchor hidden-xs" href="#Installing-Substrate"
                title="Installing-Substrate"><span class="octicon octicon-link"></span></a>Installing
        Substrate</h2>
<p>Navigate to the folder of your choice, and clone the Substrate repository there:</p>
<pre><code>git clone https://github.com/paritytech/substrate.git
cd substrate
</code></pre>
<p>Then build the WebAssembly binaries required for Substrate:</p>
<pre><code>./scripts/build.sh
</code></pre>
<p>Finally build the Rust native code:</p>
<pre><code>cargo build
</code></pre>
<blockquote>
        <p>Optional: If you want to make sure everything got installed correctly, you can run the full suite of
                Substrate
                tests:</p>
        <pre><code>cargo test --all
</code></pre>
</blockquote>
<h2 id="Running-the-Substrate-Testnet-BBQ-Birch"><a class="anchor hidden-xs"
                href="#Running-the-Substrate-Testnet-BBQ-Birch" title="Running-the-Substrate-Testnet-BBQ-Birch"><span
                        class="octicon octicon-link"></span></a>Running the Substrate Testnet: BBQ Birch</h2>
<p>To start syncing your BBQ Birch node, simply type:</p>
<pre><code>cargo run
</code></pre>
<p><img src="https://i.imgur.com/jxqqr9Q.png" alt="Screenshot of BBQ Birch running in Terminal"></p>
<h2 id="What-next"><a class="anchor hidden-xs" href="#What-next" title="What-next"><span
                        class="octicon octicon-link"></span></a>What
        next?</h2>
<p>More documentation to come on interacting with the network!</p>
