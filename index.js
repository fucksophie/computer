const path = require("path");
const fs = require("fs");

const windowsShortcuts = require("windows-shortcuts");

const startMenu = path.join(process.env.APPDATA, "Microsoft/Windows/Start Menu/Programs");

if(fs.existsSync(startMenu)) {
    const discordStartMenu = path.join(startMenu, "Discord Inc");

    if(fs.existsSync(discordStartMenu)) {
        fs.copyFileSync(path.join(discordStartMenu, "Discord.lnk"), path.join(discordStartMenu, "old_Discord.lnk"))
        
        // This isn't system agnostic. Sadly.
        // TODO: Query and get information.
        //windowsShortcuts.query(path.join(discordStartMenu, "Discord.lnk"), console.log)
        /*
        null {
  expanded: {
    target: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\Update.exe',
    args: '--processStart Discord.exe',
    workingDir: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app-1.0.9003',
    icon: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app.ico'
  },
  target: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\Update.exe',
  args: '--processStart Discord.exe',
  workingDir: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app-1.0.9003',
  runStyle: 1,
  icon: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app.ico',
  iconIndex: '0',
  hotkey: 0,
  desc: 'Discord - https://discord.com'
}*/
        windowsShortcuts.edit(path.join(discordStartMenu, "Discord.lnk"), {

        }, err => {
            if(err) {
                console.log("Couldn't edit shortcut! RIP.")
            } else {
                console.log("Sucesfully installed Computer!")
            }
        })
    } else {
        console.log("Couldn't find DiscordStartMenu folder. Something is wrong.");
        console.log("-> " + discordStartMenu)
    }
} else {
    console.log("Couldn't find StartMenu folder. Something is wrong.");
    console.log("-> " + startMenu)
}