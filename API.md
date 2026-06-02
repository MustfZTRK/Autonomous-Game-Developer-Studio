# Public System Api References

The platform exposes the following REST JSON and SSE streaming interfaces on Port `3000`.

---

## ⚙️ Control Endpoints

### Start Loop
- **Method**: `POST`
- **Route**: `/api/system/start`
- **Response**: `{"status": "started"}`

### Pause Loop
- **Method**: `POST`
- **Route**: `/api/system/pause`
- **Response**: `{"status": "paused"}`

### Resume Loop
- **Method**: `POST`
- **Route**: `/api/system/resume`
- **Response**: `{"status": "resumed"}`

### Stop Loop
- **Method**: `POST`
- **Route**: `/api/system/stop`
- **Response**: `{"status": "stopped"}`

---

## 📊 Status & Queries

### Realtime State Event Stream (SSE)
- **Method**: `GET`
- **Route**: `/api/stream`
- **Headers**: `Content-Type: text/event-stream`
- **Usage**: Feeds instant live updates on logs streams (`log`) and system variables (`state`) directly to your dashboard.

### State Status summary
- **Method**: `GET`
- **Route**: `/api/status`

### List Iterations database
- **Method**: `GET`
- **Route**: `/api/iterations`

### Query Bugs list
- **Method**: `GET`
- **Route**: `/api/bugs`

---

## 📁 Files & Catalog Workspace

### List Workspace Files
- **Method**: `GET`
- **Route**: `/api/files`

### View File Contents
- **Method**: `GET`
- **Route**: `/api/files/view?path=<file-path>`

### Save Manual Overwrites
- **Method**: `POST`
- **Route**: `/api/files/save`
- **Payload**: `{"path": "entities.py", "content": "..."}`
