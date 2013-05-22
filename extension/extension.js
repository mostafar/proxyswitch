
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;

function MyMenu() {
    this._init.apply(this, arguments);
}

MyMenu.prototype = 
{
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function() 
    {
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'preferences-system-network-proxy-symbolic');

        this.actor.add_actor(new St.Label({text: "Test"}));
    
        this.items = [];

    	this.activeSection = new PopupMenu.PopupMenuSection();
	    this.itemsSection = new PopupMenu.PopupMenuSection();
    	this.menu.addMenuItem(this.activeSection);
	    this.separator = new PopupMenu.PopupSeparatorMenuItem();
    	this.menu.addMenuItem(this.separator);
	    this.menu.addMenuItem(this.itemsSection);

        this.activeSection.actor.add_actor(new St.Label({text: "Current proxy:"}));
        this.itemsSection.actor.add_actor(new St.Label({text: "Other choices:"}));
        
        this.actor.menu = this;
        this.actor.connect('button-press-event', function (actor, event)
        {
            actor.menu.redisplay();
        });
        this._createList();
    },

    redisplay: function()
    {
    	this.activeSection.removeAll();
	    this.itemsSection.removeAll();
    	this.items = [];

        this._createList();
    },

    _createList: function()
    {
        let file = Gio.file_new_for_path('/etc/pswitch/active');
        let files_enum = file.enumerate_children("standard::name", null, null);
        while ((child = files_enum.next_file(null)))
        {
            item = child.get_name();
            let active = new PopupMenu.PopupMenuItem(item);
            this.activeSection.addMenuItem(active);
        }

        file = Gio.file_new_for_path('/etc/pswitch/');
        files_enum = file.enumerate_children("standard::name", null, null);
        let i = 0;
        while ((child = files_enum.next_file(null)))
        {
            item = child.get_name();
            if (item == 'active')
                continue;
            this.items[i] = new PopupMenu.PopupMenuItem(item);
            this.items[i].name = item;
            this.itemsSection.addMenuItem(this.items[i]);
            this.items[i].connect('activate', function (actor, event) 
            {
                Util.trySpawnCommandLine('pswitch ' + actor.name);
            });
            i++;
        }
    }
};

function init(metadata) {
}

let _mymenu;

function enable() 
{
    _mymenu = new MyMenu();
    Main.panel.addToStatusArea('ProxySwitch', _mymenu);
}

function disable() {
    _mymenu.destroy();
}

