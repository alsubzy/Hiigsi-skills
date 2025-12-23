require('dotenv').config();
const url = process.env.DATABASE_URL;
if (url) {
    const masked = url.replace(/:([^:@]+)@/, ':****@');
    console.log('DATABASE_URL (masked):', masked);
    try {
        const u = new URL(url);
        console.log('Host:', u.hostname);
        console.log('Port:', u.port);
    } catch (e) {
        console.log('Invalid URL');
    }
} else {
    console.log('DATABASE_URL is not set');
}
