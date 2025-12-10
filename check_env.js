if (process.env.NEXTAUTH_SECRET) {
    console.log('NEXTAUTH_SECRET is set.')
} else {
    console.log('NEXTAUTH_SECRET is MISSING.')
}

if (process.env.NEXTAUTH_URL) {
    console.log('NEXTAUTH_URL is set:', process.env.NEXTAUTH_URL)
} else {
    console.log('NEXTAUTH_URL is MISSING.')
}
