#!/usr/bin/python

import os, shutil

GNOME_SHELL_EXTENSIONS_DIR = '/usr/share/gnome-shell/extensions/'
PROXIES_DIR = '/etc/pswitch/'
BIN_DIR = '/usr/bin/'

EXTENSION_ID = 'proxyswitch@rokooie.ir'

if os.path.exists(GNOME_SHELL_EXTENSIONS_DIR):
    extension_dir = os.path.join(GNOME_SHELL_EXTENSIONS_DIR, EXTENSION_ID)
    if not os.path.exists(extension_dir):
        os.mkdir(extension_dir)
    os.system('cp -r extension/* %s' % extension_dir)
else:
    print 'Error: Gnome shell extensions dir not found.'

if not os.path.exists(PROXIES_DIR):
    os.mkdir(PROXIES_DIR)
os.system('cp -r proxies/* %s' % PROXIES_DIR)
os.system('chmod -R +wr %s' % PROXIES_DIR)

os.system('chmod +x pswitch')
os.system('cp pswitch %s' % BIN_DIR)
