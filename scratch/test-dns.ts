import dns from 'dns';

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('DNS servers set to:', dns.getServers());
    dns.resolveSrv('_mongodb._tcp.campusconnect.u2hkzru.mongodb.net', (err, addresses) => {
        if (err) {
            console.error('SRV lookup failed:', err);
        } else {
            console.log('SRV lookup succeeded:', addresses);
        }
    });
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}
