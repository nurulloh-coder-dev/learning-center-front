import qrcode from 'qrcode-generator'

/**
 * Havolaning QR-kodi (rasm `data:` URL). Kutubxona bog'liqliksiz va kichik —
 * kod brauzerda yasaladi, havola hech qanday tashqi xizmatga yuborilmaydi.
 * Oq fonda qora: chop etilganda ham, telefon kamerasida ham o'qiladi.
 */
export function qrDataUrl(text: string, cellSize = 6): string {
    const qr = qrcode(0, 'M')
    qr.addData(text)
    qr.make()
    return qr.createDataURL(cellSize, 4)
}
