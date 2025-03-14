# PDF Export Service

This Flask-based microservice handles the generation of PDF exports from labeled P&IDs in the PNID.app application. The service takes labeled diagram data and generates professionally formatted PDF documents for sharing and printing.

## Features

- Convert labeled P&ID diagrams to PDF format
- Generate tables of equipment with metadata
- Apply high-quality formatting for professional output
- Properly handle different page sizes and orientations

## Local Development

### Using Docker

```bash
docker build --no-cache -t pdf-export .
docker run -e USE_HTTPS=false -p 6123:5000 pdf-export # to run on local port 6123
```

### Running directly with Python

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the service:
   ```bash
   python main.py
   ```

The service will start on port 5000, but will be accessible via port 6123 as mapped in the Docker configuration.

## API Endpoints

### `POST /export-pdf`

Generates a PDF from labeled diagram data.

**Request Body**:
```json
{
  "file_data": "base64_encoded_image_or_pdf",
  "nodes": [
    {
      "id": "node1",
      "position": { "x": 100, "y": 200 },
      "data": { "label": "Pump-101", "type": "pump", "metadata": {} }
    }
  ],
  "filename": "export.pdf"
}
```

**Response**:
Binary PDF file with appropriate headers for download.

## Integration with PNID.app

This service is called from the main PNID.app application when a user requests to export a diagram to PDF. It should be accessible at the URL specified in the main application's environment variable `NEXT_PUBLIC_EXPORT_SERVER_ADDR`.