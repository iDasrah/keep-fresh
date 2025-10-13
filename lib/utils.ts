export function getItemStatus(expirationDate: string): 'expired' | 'expiringSoon' | 'fresh' {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'expired';
    } else if (diffDays <= 3) {
        return 'expiringSoon';
    } else {
        return 'fresh';
    }
}