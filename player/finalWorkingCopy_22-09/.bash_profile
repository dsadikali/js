# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

export PATH
unset USERNAME
export CVSROOT=/usr/local/cvsroot
export PHP-CONFIG=/opt/lampp/bin/php-config
export PS1='$USER|PHP DEVELOPMENT TEAM :'
export CVSEDITOR='pico'
echo 'Welcome, '$USER'!'
echo "Please take care that you do checkout CVS everyday before you start And commit all your changes as soon as you are done"
echo " PLEASE DO NOT FORGET TO  UPDATE SCRIPT before you start working on it."
ehho " All activity on this prompt is logged, please do not access folders on which you are not authorized"
echo "by System Administrator"


