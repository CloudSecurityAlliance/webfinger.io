#!/bin/bash
# 
# TODO: figure out the best way to system script this, or possibly run on demand?
#
cd /etc/openvpn/client2
ip netns exec ns1 /usr/sbin/openvpn --config /etc/openvpn/client2/config.ovpn --auth-user-pass login.conf --mute-replay-warnings &
