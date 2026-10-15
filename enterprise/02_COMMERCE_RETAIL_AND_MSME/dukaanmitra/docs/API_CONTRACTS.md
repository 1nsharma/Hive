# API Contract Registry (v1.0)

This registry establishes the formal request and response specifications (API contracts), payload parameters, validation rules, and error handling behaviors across DukaanMitra (BazaarSync).

---

## 1. Primary Operational Contracts

### 1.1 State Hydration (`GET /api/db`)
Fetches all tenant-specific records in a single payload. It employs a 60-second in-memory server cache.

- **Authentication**: `requireAuth`
- **Query Parameters**: None
- **Response Contracts**:
  - **`200 OK`**: Returns full synchronized database snapshot.
    ```json
    {
      "customers": [
        { "id": "12", "userId": 4, "name": "Rahul Sharma", "phone": "9876543210", "balance": 1500, "createdAt": "2026-07-25T14:30:00.000Z", "updatedAt": "2026-07-25T21:00:00.000Z" }
      ],
      "products": [
        { "id": "55", "userId": 4, "name": "Tata Salt 1kg", "stock": 42.5, "unit": "kg", "price": 28, "costPrice": 22, "lowStockThreshold": 10, "barcode": "8901058002313", "createdAt": "2026-07-25T14:30:00.000Z" }
      ],
      "transactions": [
        { "id": "109", "userId": 4, "customerId": "12", "amount": 500, "type": "credit", "product": "Tata Salt", "quantity": 10, "notes": "Credit given for wedding party", "date": "2026-07-25T21:00:00.000Z" }
      ]
    }
    ```
  - **`401 Unauthorized`**: If JWT token is missing or expired.
    ```json
    { "error": "Unauthorized" }
    ```

---

### 1.2 Conversational Ledger Parser (`POST /api/munim/parse`)
Processes Hinglish or native text inputs to extract structured actions. Checks MD5 hash of input against `ai_cache` for instant lookup.

- **Authentication**: `optionalAuth`
- **Request Payload Constraints**:
  - `query`: String (Required, non-empty)
  - `customersList`: Array (Optional, fallback mapping context)
  - `productsList`: Array (Optional, fallback mapping context)
  - `businessConfig`: Object (Optional)
- **Request Body Example**:
  ```json
  {
    "query": "अमित को 500 रुपये की चीनी उधार दी",
    "customersList": [{ "id": "12", "name": "Amit Kumar" }],
    "productsList": [{ "id": "55", "name": "Sugar (चीनी)" }]
  }
  ```
- **Response Contracts**:
  - **`200 OK`**: Returns parsed entities and recommended action.
    ```json
    {
      "type": "credit",
      "customer": "Amit Kumar",
      "phone": "9876543210",
      "amount": 500,
      "product": "Sugar (चीनी)",
      "quantity": "12kg",
      "price": 40,
      "isNewProduct": false,
      "hindiExplanation": "अमित के खाते में ₹500 चीनी की उधारी दर्ज की गई।",
      "confidence": 0.98
    }
    ```
  - **`400 Bad Request`**: If `query` parameter is missing.
    ```json
    { "error": "Query is required" }
    ```

---

### 1.3 Optical Invoice Scanner (`POST /api/munim/scan-bill`)
Processes image base64 formats to extract structured billing lists.

- **Authentication**: `optionalAuth`
- **Payload Constraints**:
  - `image`: String (Required, base64 data URL. Payload capacity up to 50MB to support high-res supplier scans).
- **Request Body Example**:
  ```json
  {
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
  }
  ```
- **Response Contracts**:
  - **`200 OK`**: Returns parsed invoice items.
    ```json
    {
      "products": [
        { "name": "Aashirvaad Atta 10kg", "quantity": 5, "price": 420, "unit": "packet", "total": 2100 }
      ],
      "customerName": "Ramesh Grocery Store",
      "totalBillAmount": 2100,
      "hindiSummary": "बिल में 1 आइटम मिला: आशीर्वाद आटा 5 पैकेट। कुल रकम ₹2100 है।"
    }
    ```
  - **`400 Bad Request`**: If image data is omitted.
    ```json
    { "error": "Image data is required" }
    ```

---

### 1.4 Post Ledger Entry (`POST /api/transactions`)
Updates client debts or logs cash sales. Handled securely by the Strangler Gateway.

- **Authentication**: `requireAuth`
- **Payload Constraints**:
  - `customerId`: Number/String (Required)
  - `amount`: Number (Required, non-negative)
  - `type`: String (Required, Must match `sale`, `credit`, or `payment`)
  - `product`: String (Optional)
  - `quantity`: Number (Optional)
  - `notes`: String (Optional)
  - `date`: String (Optional, UTC timestamp ISO format)
- **Request Body Example**:
  ```json
  {
    "customerId": "12",
    "amount": 500,
    "type": "credit",
    "product": "Sugar",
    "quantity": 10,
    "notes": "Delivered to house",
    "date": "2026-07-25T21:00:00.000Z"
  }
  ```
- **Response Contracts**:
  - **`200 OK`**: Dispatched successfully through OS Kernel.
    ```json
    {
      "success": true,
      "message": "Transaction processed via OS Kernel"
    }
    ```
  - **`500 Internal Server Error`**: If processing fails.
    ```json
    { "error": "Failed to add transaction" }
    ```

---

### 1.5 Post Stock Alteration (`POST /api/stock-adjust`)
Updates catalog inventory counts.

- **Authentication**: `requireAuth`
- **Payload Constraints**:
  - `productId`: Number (Required)
  - `quantity`: Number (Required, positive float)
  - `type`: String (Required, Must match `in` or `out`)
  - `notes`: String (Optional)
- **Request Body Example**:
  ```json
  {
    "productId": 55,
    "quantity": 20,
    "type": "in",
    "notes": "Received supplier supply"
  }
  ```
- **Response Contracts**:
  - **`200 OK`**: Returns updated catalog item.
    ```json
    {
      "id": "55",
      "name": "Tata Salt 1kg",
      "stock": 62.5,
      "unit": "kg",
      "price": 28,
      "costPrice": 22
    }
    ```

---

## 2. Shared Error Payload Format
When an API rejects a request or encounters a server issue, it returns a standardized JSON structure with appropriate HTTP status codes:

```json
{
  "error": "Human-readable descriptive failure message"
}
```

### Standard Status Codes
- **`200 OK`**: Standard successful GET/PUT/DELETE action.
- **`201 Created`**: Standard successful POST record initialization.
- **`400 Bad Request`**: Missing required parameters or type mismatches.
- **`401 Unauthorized`**: Auth token is missing, corrupted, or expired.
- **`403 Forbidden`**: Role enforcement failure (e.g. non-admin requesting system telemetry).
- **`404 Not Found`**: Requesting resource that does not exist or belongs to another tenant.
- **`429 Too Many Requests`**: Rate limits or API quota exhaustion.
- **`500 Internal Server Error`**: Server crash, database connection drop, or unhandled loop blocks.
