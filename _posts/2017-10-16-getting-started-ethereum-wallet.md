---
id: 199
title: Getting started with Ethereum Wallet
date: 2017-10-16T05:14:22-08:00
author: Shawn Tabrizi
layout: post
guid: http://shawntabrizi.com/?p=199
permalink: /ethereum/getting-started-ethereum-wallet/
categories:
  - Ethereum
tags:
  - blockchain
  - ethereum
---
<p>Well, Cryptocurrencies have consumed my attention for the past 5 months. I first learned about Etherum back in May when I was attending a Bachelor party. Since then, I have been a relatively hands off investor, but it is time to actually start contributing and learning about the development platform.</p>

<p>To start, we need to install the Etherum Wallet, which also downloads the entire Etherum chain, which as of this post is over 4.3 million blocks long. The unfortunate part of this process is that it takes a lot of disk space, and if you are like me, you have a SSD for your OS and installed programs, and an HDD for storage. 4.3 million blocks is supposed to be around 70+ GB of files, which I certainly do not want on my SSD.</p>

<p>Etherum Wallet does not currently let you choose where to store these files, so by default they go to:</p>
<pre>C:\Users\<username>\AppData\Roaming\Ethereum</pre>
<p>So how can we move these files to our HDD?</p>

<p>Using <a href="https://en.wikipedia.org/wiki/Symbolic_link">Symbolic Links</a> (Symlinks)!</p>

<h1>Let's do it!</h1>
<p>I want to store all these files on my HDD at this folder path:</p>
<pre>D:\Cryptocoins\Ethereum</pre>

<p>Before I install <a href="https://github.com/ethereum/mist/releases">Etherum Wallet</a>, I should set up the symlink as so:</p>

<p>> Run CMD as an Administrator</p>
<pre>mklink /j "C:\Users\<username>\AppData\Roaming\Ethereum" "D:\Cryptocoins\Ethereum"</pre>

<p>If successful, you will get the following message:</p>
<pre>Junction created for C:\Users\<username>\AppData\Roaming\Ethereum <<===>> D:\Cryptocoins\Ethereum</pre>

<p>This will create a <a href="https://en.wikipedia.org/wiki/NTFS_junction_point">Directory Junction</a> which basically makes the first folder path point to the second folder path. Then when I install and run Etherum Wallet, it will start to download all of the blocks into this alternate directory!</p>

<p id="PLErbfw"><img class="alignnone size-full wp-image-201 " src="/assets/images/img_59e43dd34c878.png" alt="" /></p>

<p>And in my HDD:</p>
<p id="qMLIFXf"><img class="alignnone size-full wp-image-202 " src="/assets/images/img_59e43defb599e.png" alt="" /></p>

<h1>What if I migrate an existing installation?</h1>
<p>Let's say you already installed and downloaded the Ethereum Chain but you want to do this. Well that is also pretty easy. First copy all the contents from</p>

<pre>C:\Users\<username>\AppData\Roaming\Ethereum</pre>

<p>to your new location. It should be pretty large, so it may take a while. Be extra careful to make a backup of your <code>keystore</code> folder. Once the files have been copied over, you must delete the entire original Ethereum directory, including the <code>Ethereum</code> folder. Then you can run the same <code>mklink</code> in CMD as an Administrator.</p>

<pre>mklink /j "C:\Users\<username>\AppData\Roaming\Ethereum" "D:\Cryptocoins\Ethereum"</pre>

<p>If you forgot to delete the <code>Ethereum</code> folder, you will get this error:</p>

<pre>Cannot create a file when that file already exists.</pre>

<p>I hope this helps someone! It certainly helped me as I was getting started.</p>