---
title: Getting started with Ethereum Wallet
date: 2017-10-16T05:14:22-08:00
authors: shawntabrizi
layout: post
slug: /ethereum/getting-started-ethereum-wallet/
categories:
  - Ethereum
tags:
  - blockchain
  - ethereum
---

Well, Cryptocurrencies have consumed my attention for the past 5 months. I first learned about Ethereum back in May when I was attending a Bachelor party. Since then, I have been a relatively hands off investor, but it is time to actually start contributing and learning about the development platform.

To start, we need to install the Ethereum Wallet, which also downloads the entire Ethereum chain, which as of this post is over 4.3 million blocks long. The unfortunate part of this process is that it takes a lot of disk space, and if you are like me, you have a SSD for your OS and installed programs, and an HDD for storage. 4.3 million blocks is supposed to be around 70+ GB of files, which I certainly do not want on my SSD.

Ethereum Wallet does not currently let you choose where to store these files, so by default they go to:

```
C:\Users\<username>\AppData\Roaming\Ethereum
```

So how can we move these files to our HDD?

Using [Symbolic Links](https://en.wikipedia.org/wiki/Symbolic_link) (Symlinks)!

# Let's do it!

I want to store all these files on my HDD at this folder path:

```
D:\Cryptocoins\Ethereum
```

Before I install [Ethereum Wallet](https://github.com/ethereum/mist/releases), I should set up the symlink as so:

> Run CMD as an Administrator

```bash
mklink /j "C:\Users\<username>\AppData\Roaming\Ethereum" "D:\Cryptocoins\Ethereum"
```

If successful, you will get the following message:

```
Junction created for C:\Users\<username>\AppData\Roaming\Ethereum <<===>> D:\Cryptocoins\Ethereum
```

This will create a [Directory Junction](https://en.wikipedia.org/wiki/NTFS_junction_point) which basically makes the first folder path point to the second folder path. Then when I install and run Ethereum Wallet, it will start to download all of the blocks into this alternate directory!

![](/assets/images/img_59e43dd34c878.png)

And in my HDD:

![](/assets/images/img_59e43defb599e.png)

# What if I migrate an existing installation?

Let's say you already installed and downloaded the Ethereum Chain but you want to do this. Well that is also pretty easy. First copy all the contents from

```
C:\Users\<username>\AppData\Roaming\Ethereum
```

to your new location. It should be pretty large, so it may take a while. Be extra careful to make a backup of your `keystore` folder. Once the files have been copied over, you must delete the entire original Ethereum directory, including the `Ethereum` folder. Then you can run the same `mklink` in CMD as an Administrator.

```bash
mklink /j "C:\Users\<username>\AppData\Roaming\Ethereum" "D:\Cryptocoins\Ethereum"
```

If you forgot to delete the `Ethereum` folder, you will get this error:

```
Cannot create a file when that file already exists.
```

I hope this helps someone! It certainly helped me as I was getting started.
