# SHOPLINK TANZANIA — Unified Project (2026)

This single VS Code project combines the bilingual storefront, product catalogue, checkout, location entry/GPS, order tracking, Admin order dashboard, rewards/profit estimates, payment-method selection, images, Java/C examples and MySQL schema draft.

## Start on Windows
1. Extract this ZIP and open the `ShopLink_Tanzania` folder in VS Code.
2. Open Terminal in that folder and run:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   python -m pip install -r backend/requirements.txt
   python backend/app.py
   ```
   If PowerShell activation is blocked, use Command Prompt with `.venv\Scripts\activate.bat`, or run the install command without activation.
3. Storefront: http://127.0.0.1:5000
4. Admin: http://127.0.0.1:5000/admin

## Demo Admin
Email: `admin@shoplink.co.tz`
Password: `ShopLink@2026`
Change demo credentials and configure a strong persistent secret before public deployment.

## Included
- English and Kiswahili UI
- Product catalogue, cart and checkout
- Delivery address and optional browser GPS coordinates
- Order status tracking by order code
- Admin order list, order status, rider name/phone, notes and order history
- Payment method selection: Cash on Delivery, M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, Yas, Selcom, NMB, CRDB, Stanbic and Visa
- Admin payment method, payment status and optional payment reference display
- Rewards & Profit Guard estimates; SQLite demo database; MySQL schema draft
- WhatsApp support number: 0611129510 (link uses Tanzania international format +255611129510)
- Images under `frontend/assets/`; Java and C examples under `examples/`

## Payment and location limitations
Payment method and optional reference are stored with each order and shown in Admin. This demo does not charge money or verify payment automatically. To receive real payments, integrate an official provider/gateway and verified server-side callbacks. Do not store card PIN, CVV, passwords or mobile-money PINs.

GPS coordinates are captured only if the customer grants browser permission; the customer should also enter clear street/ward details. Live rider GPS tracking is not implemented.

Rewards and profit numbers are planning estimates, not guaranteed profit. Before public launch, test authentication/roles, payment webhooks, refunds, reward verification, privacy, HTTPS, rate limiting, backups and security.


## Location and customer support (updated)
Checkout now offers two delivery-location methods: (1) type the address manually, or (2) use browser GPS and open Google Maps at the captured coordinates. GPS permission and HTTPS/localhost are required by modern browsers. The map link is a Google Maps query; no Google Maps API key is required for opening the map.

Customer support has three options: regular WhatsApp at 0611129510 (international link +255611129510), in-app chat messages saved to SQLite and visible to signed-in Admin, and browser voice typing/text-to-speech where supported. Voice mode is not a live telephone call; browser microphone permission and compatible speech APIs are required. Admin can refresh the support inbox and reply in the dashboard.

Code is organised into shorter, vertically flowing sections to make it easier to follow step by step.


## Location and customer support (updated)
Checkout now offers two delivery-location methods: (1) type the address manually, or (2) use browser GPS and open Google Maps at the captured coordinates. GPS permission and HTTPS/localhost are required by modern browsers. The map link is a Google Maps query; no Google Maps API key is required for opening the map.

Customer support has three options: regular WhatsApp at 0611129510 (international link +255611129510), in-app chat messages saved to SQLite and visible to signed-in Admin, and browser voice typing/text-to-speech where supported. Voice mode is not a live telephone call; browser microphone permission and compatible speech APIs are required. Admin can refresh the support inbox and reply in the dashboard.

Code is organised into shorter, vertically flowing sections to make it easier to follow step by step.
