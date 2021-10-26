const path = require("path");
const fs = require("fs");

const windowsShortcuts = require("windows-shortcuts");

const startMenu = path.join(process.env.APPDATA, "Microsoft/Windows/Start Menu/Programs");

if(fs.existsSync(startMenu)) {
    const discordStartMenu = path.join(startMenu, "Discord Inc");

    if(fs.existsSync(discordStartMenu)) {
        fs.copyFileSync(path.join(discordStartMenu, "Discord.lnk"), path.join(discordStartMenu, "old_Discord.lnk"))
        
        // This isn't crossplatform.

        console.log("Patching windows shortcut.")
        windowsShortcuts.query(path.join(discordStartMenu, "Discord.lnk"), (err, data) => {
            if(err) throw err;
        
            console.log("Discord directory found at " + data.workingDir);
            console.log(`Previous target: ${data.target} ${data.args}`)
            
            windowsShortcuts.edit(path.join(discordStartMenu, "Discord.lnk"), {
                target: path.join(data.workingDir, "Discord.exe"),
                args: "--remote-debugging-port=2020"
            }, err => {
                if(err) {
                    console.log("Couldn't patch shortcut!")
                } else {
                    console.log("Patched shortcut!")

                }
            })
        })
        /*
       {
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

    } else {
        console.log("Couldn't find DiscordStartMenu folder. Something is wrong.");
        console.log("-> " + discordStartMenu)
    }
} else {
    console.log("Couldn't find StartMenu folder. Something is wrong.");
    console.log("-> " + startMenu)
}
