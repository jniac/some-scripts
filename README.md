# some-scripts

some-scripts is a toolbox for some needs i have.

## install
With "jnc" as command name:
```shell
sudo node install.mjs jnc
# Installed the following file /usr/local/bin/jnc
# You can use the command "jnc".
```

## 2jpg
Export all the file from the current folder to a subfolder `jpg` with a copy of 
all the current images converted to jpg:
```
jnc 2jpg
```

- Recursive: subfolders are exported to subfolders.
- Removes white space from name.
- Skip file if the current exported file is newer than the source.
