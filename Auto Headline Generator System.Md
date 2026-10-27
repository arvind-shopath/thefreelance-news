
## Purpose

यह document define करता है कि system automatically **high-CTR Hindi headlines कैसे generate करेगा** बिना heavy AI cost के.

Goal:

> Fast + SEO-friendly + clickable headlines (rule-based + light AI optional)

---

# 1) Core Logic

```text
Keyword + Context + Template = Headline
```

System को 3 चीजें चाहिए:

1. Keyword (main topic)
2. Context (क्या हुआ)
3. Template (headline format)

---

# 2) Input Data (From RSS)

System को मिलेगा:

```text
title
description
content
```

---

# 3) Keyword Extraction (Rule-based)

Extract:

* main noun (iPhone, Modi, Stock Market)
* action (price cut, launch, win, announcement)

Example:

```text
iPhone 15 price cut → keyword = iPhone 15
context = price cut
```

---

# 4) Topic Classification

```text
price cut → pricing
launch → product
win → sports
statement → politics
```

---

# 5) Template Mapping Engine

System category के हिसाब से template select करेगा:

## Example Mapping

### Pricing News

```text
[Keyword] हुआ सस्ता, अब इतने में मिलेगा
```

### Breaking News

```text
[Keyword] पर बड़ा अपडेट, जानिए पूरी बात
```

### Explainer

```text
[Keyword] क्या है? आसान भाषा में समझिए
```

### Tech Launch

```text
[Keyword] लॉन्च, जानिए फीचर्स और कीमत
```

---

# 6) Headline Generation Flow

```text
Extract keyword → detect context → pick template → fill → clean → output
```

---

# 7) Language Cleanup Rules

* English words replace करें (price → कीमत)
* छोटे वाक्य रखें
* max length: 60–80 characters

---

# 8) AI Optional Layer (LIMITED USE)

Use AI only for:

* polishing headline
* removing awkward phrasing

NOT for full generation.

---

# 9) Multiple Headline Generation (IMPORTANT)

System 3 variants बनाए:

```text
headline_1 (SEO)
headline_2 (CTR)
headline_3 (balanced)
```

Best one auto-select या CMS से choose.

---

# 10) CTR Optimization Rules

Headline में होना चाहिए:

* number (अगर possible)
* impact (बड़ा, भारी, नया)
* curiosity (क्या, क्यों, कैसे)

---

# 11) Forbidden Rules

System MUST NOT:

* fake information डालना
* clickbait without content
* unrelated words add करना

---

# 12) Example

## Input:

```text
iPhone 15 price reduced globally
```

## Output:

```text
iPhone 15 हुआ सस्ता, अब इतने में मिलेगा
```

---

# 13) Developer Implementation Notes

* keyword extraction → regex + NLP lite
* template selection → rule-based map
* Hindi conversion → dictionary mapping
* output → validated string

---

# 14) Final Rule

```text
Simple + Clear + Clickable = Perfect Headline