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
```shell
jnc 2jpg
jnc 2jpg -r #including sub folders
jnc 2jpg -q 60
jnc 2jpg -qr 60
```

- Recursive: subfolders are exported to subfolders.
- Removes white space from name.
- Skip file if the current exported file is newer than the source.

## Notes
CLI flags are parsed according to this [post (cli-flags-explained)](https://oclif.io/blog/2019/02/20/cli-flags-explained).
