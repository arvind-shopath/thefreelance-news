# thefreelance.in — API Contracts + CMS Workflow (`api_contracts_and_cms_workflow.md`)

## Purpose

यह document frontend और backend teams के बीच **clear contract define करता है** ताकि दोनों parallel development कर सकें.

---

# PART 1 — API CONTRACTS

## Base URL

```text
/api/v1
```

---

## 1) Articles APIs

### Get Latest Articles

```http
GET /articles
```

Query:

```text
?page=1&limit=10&category=tech
```

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "headline": "...",
      "slug": "...",
      "summary": "...",
      "image": "...",
      "category": "tech",
      "publishedAt": "timestamp"
    }
  ]
}
```

---

### Get Article Detail

```http
GET /articles/:slug
```

Response:

```json
{
  "headline": "...",
  "content": "...",
  "image": "...",
  "category": "...",
  "seo": {
    "title": "...",
    "description": "..."
  }
}
```

---

### Get Related Articles

```http
GET /articles/:id/related
```

---

## 2) Stories APIs

### Get Stories List

```http
GET /stories
```

---

### Get Story Slides

```http
GET /stories/:slug
```

Response:

```json
{
  "slides": [
    {
      "type": "text/image/embed",
      "content": "...",
      "image": "..."
    }
  ]
}
```

---

## 3) Categories API

```http
GET /categories
```

---

## 4) Search API

```http
GET /search?q=keyword
```

---

## 5) Analytics Event API

```http
POST /analytics/event
```

Payload:

```json
{
  "type": "article_view",
  "id": "uuid"
}
```

---

# PART 2 — CMS WORKFLOW

## 1) Article Lifecycle

```text
RSS → Draft → Processed → Verified → Published
```

---

## 2) CMS Roles

### Admin

* full control

### Editor

* edit articles
* approve publish

### Viewer

* read only

---

## 3) Article Creation Flow

### Step 1: Auto Draft

* RSS से article draft बनता है

### Step 2: Processing

* rewrite
* translate
* image attach
* category assign

### Step 3: SEO Auto Fill

* meta title
* meta description
* keywords

### Step 4: Verification

System checks:

* duplicate
* missing data
* SEO completeness

---

### Step 5: Publish

* auto publish
* visible on homepage

---

## 4) Story Creation Flow

From article:

```text
article → slides generate → story publish
```

---

## 5) Feed Management

CMS screen:

* add RSS
* edit RSS
* enable/disable source

---

## 6) Ad Management

CMS controls:

* ad slots
* placement rules
* enable/disable

---

## 7) SEO Manager

CMS fields:

* meta title
* description
* slug
* keywords

---

## 8) Error Handling

If any step fails:

```text
retry → log → alert admin
```

---

## 9) Final Rule

System must:

```text
run automated + allow manual override via CMS
```
