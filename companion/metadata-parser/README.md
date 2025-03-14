# Metadata Parser Service

This Express.js server provides AI-assisted metadata parsing for P&ID components in the PNID.app application. It uses OpenAI's vision capabilities to analyze extracted image sections and generate detailed metadata for P&ID components.

## Features
- Extract regions from P&ID diagrams (PDF or images)
- Use OpenAI's vision capabilities to identify and describe P&ID components
- Generate structured JSON metadata for equipment types
- Handle both PDF and image file formats
- Connect to Supabase for storage and database access

## Local Development Setup

### Direct Development

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   Create a `.env` file in the root directory with:
   ```
   USE_HTTPS=false
   PORT=5000
   SUPABASE_URL=http://your_local_ip:54321
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```
   This will start the server with hot-reloading enabled.

### Using Docker

First populate `.env` file with required variables:
```sh
USE_HTTPS=false
PORT=7123

SUPABASE_URL=http://...     # Required
SUPABASE_SERVICE_KEY=ey...  # Required
OPENAI_API_KEY=sk_...       # Required
```

Then run docker build and docker run:
```bash
docker build --no-cache -t metadata-parser .
docker run -p 7123:7123 metadata-parser 
```

## API Endpoints

### `GET /`
Simple health check endpoint.

### `GET /test-supabase`
Test the Supabase connection.

### `POST /extract-image`
Extract a portion of an image and generate metadata using AI.

**Request Body:**
```json
{
  "file_id": "short_uid_of_file",
  "pos_x": 100,
  "pos_y": 200,
  "width": 150,
  "height": 150,
  "equipment_type": "valve"
}
```

**Response:**
```json
{
  "image": "data:image/png;base64,...",
  "description": "{\"name\":\"Gate Valve\",\"type\":\"isolation valve\",\"flow_direction\":\"horizontal\",\"normally\":\"open\",\"description\":\"Manual gate valve for flow isolation.\"}"
}
```

## Integration with PNID.app

This service is used by the main PNID.app application to provide AI-assisted metadata extraction for P&ID components. The main application communicates with this service via the URL specified in the environment variable `METADATA_PARSER_ADDR`.