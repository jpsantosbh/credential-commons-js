"use strict";var path=require("path"),os=require("os"),fs=require("fs");if("win32"===process.platform)throw new Error("Unsupported platform: "+process.platform);var isNode="undefined"!=typeof global&&"[object global]"==={}.toString.call(global);if(isNode){var CONFIG_FILE="config",CONFIG_PATH={BOX:"/etc/civic",USER:path.join(""+os.homedir(),".civic")},userConfigFile=path.join(CONFIG_PATH.USER,CONFIG_FILE),boxConfigFile=path.join(CONFIG_PATH.BOX,CONFIG_FILE),configFile=fs.existsSync(userConfigFile)?userConfigFile:boxConfigFile;fs.existsSync(userConfigFile)&&require("dotenv").config({path:configFile})}var config={sipSecurityService:process.env.CIVIC_SEC_URL,attestationService:process.env.CIVIC_ATTN_URL,clientConfig:{id:process.env.CIVIC_CLIENT_ID,signingKeys:{hexpub:process.env.CIVIC_CLIENT_XPUB,hexsec:process.env.CIVIC_CLIENT_XPRV}},passphrase:process.env.CIVIC_PASSPHRASE,keychain:{prv:process.env.CIVIC_KEYCHAIN}};module.exports=config;