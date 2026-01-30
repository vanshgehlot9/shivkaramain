/**
 * Enterprise-Grade Certificate Verification System
 * QR Code Generation for Shivkara Digital & Tech Lab
 * 
 * Features:
 * - Server-side QR generation
 * - Deterministic output for same certificate
 * - High error correction for print reliability
 * - Returns base64 data URL for embedding
 */

import QRCode from 'qrcode';
import { getVerificationUrl } from './certificate-crypto';

// ============================================================================
// QR CODE CONFIGURATION
// ============================================================================

const QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H' // Highest error correction (30% recovery)
};

// ============================================================================
// QR CODE GENERATION
// ============================================================================

/**
 * Generates a QR code for a certificate verification URL.
 * 
 * The QR code encodes ONLY the verification URL, not certificate data.
 * This ensures:
 * 1. No sensitive data is exposed in the QR
 * 2. The QR remains valid even if certificate details change
 * 3. Revocation is checked at scan time
 * 
 * @param certificateId - The unique certificate identifier
 * @returns Base64 data URL of the QR code image
 */
export async function generateCertificateQR(certificateId: string): Promise<string> {
    const verificationUrl = getVerificationUrl(certificateId);

    try {
        const qrDataUrl = await QRCode.toDataURL(verificationUrl, QR_OPTIONS);
        return qrDataUrl;
    } catch (error) {
        console.error('QR code generation failed:', error);
        throw new Error('Failed to generate certificate QR code');
    }
}

/**
 * Generates a QR code as a Buffer for file saving or streaming.
 * 
 * @param certificateId - The unique certificate identifier
 * @returns PNG image buffer
 */
export async function generateCertificateQRBuffer(certificateId: string): Promise<Buffer> {
    const verificationUrl = getVerificationUrl(certificateId);

    try {
        const buffer = await QRCode.toBuffer(verificationUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
        });
        return buffer;
    } catch (error) {
        console.error('QR code buffer generation failed:', error);
        throw new Error('Failed to generate certificate QR code buffer');
    }
}

/**
 * Generates a QR code as SVG string for vector graphics.
 * 
 * @param certificateId - The unique certificate identifier
 * @returns SVG string
 */
export async function generateCertificateQRSVG(certificateId: string): Promise<string> {
    const verificationUrl = getVerificationUrl(certificateId);

    try {
        const svg = await QRCode.toString(verificationUrl, {
            type: 'svg',
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
        });
        return svg;
    } catch (error) {
        console.error('QR code SVG generation failed:', error);
        throw new Error('Failed to generate certificate QR code SVG');
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates that a data URL is a valid QR code image.
 */
export function isValidQRDataUrl(dataUrl: string): boolean {
    return dataUrl.startsWith('data:image/png;base64,');
}

/**
 * Extracts the base64 data from a data URL.
 */
export function extractBase64FromDataUrl(dataUrl: string): string {
    const matches = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
    return matches ? matches[1] : '';
}
