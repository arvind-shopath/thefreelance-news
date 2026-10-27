# thefreelance.com — Auto Content Rewrite Engine (`auto_content_rewrite_engine.md`)

## Purpose

यह document define करता है कि system automatically **RSS content को original Hindi news article में कैसे convert करेगा** — बिना full AI dependency के.

Goal:

> Low-cost + scalable + readable + SEO-friendly content generation

---

# 1) Core Principle (MANDATORY)

```text
DO NOT COPY
DO NOT DIRECT TRANSLATE
ALWAYS RESTRUCTURE
```

System should:

* content समझे
* structure बदले
* नया flow बनाए

---

# 2) Input (From RSS)

```text
title
description
content
source
publish time
```

---

# 3) Full Rewrite Pipeline

```text
Clean → Break → Translate → Normalize → Rebuild → Enhance → Output
```

---

# 4) Step-by-Step Logic

## Step 1: Cleaning

Remove:

* HTML tags
* links
* ads
* scripts

Keep only:

* pure text

---

## Step 2: Sentence Breaking

```text
Long paragraph → multiple small sentences
```

Example:

Input:

```text
Apple has announced that it will reduce the price globally due to market pressure.
```

Output:

```text
Apple ने कीमत कम करने का फैसला किया है।
यह फैसला global market pressure के कारण लिया गया है।
```

---

## Step 3: Translation (Controlled)

Use:

* translation API / model

Then apply:

### Dictionary Replacement

```text
price → कीमत
launch → लॉन्च
announced → घोषणा की
report → रिपोर्ट
```

---

## Step 4: Normalization Rules

Fix:

* grammar
* sentence order
* repeated words

Example:

```text
है है → है
```

---

## Step 5: Content Rebuild (MOST IMPORTANT)

Rebuild article using structure:

```text
Headline
Summary
Main Update
Details
Background
Impact
```

---

## Step 6: Summary Generation (Rule-based)

Take:

* first 2 important sentences

Convert into:

```text
2–3 line summary
```

---

## Step 7: Detail Expansion

Break content into:

* 3–5 paragraphs

Each paragraph:

* 2–3 lines max

---

## Step 8: Impact Section

Add template-based line:

```text
इसका असर आम लोगों पर पड़ सकता है।
```

or

```text
यह बदलाव बाजार को प्रभावित कर सकता है।
```

---

## Step 9: Source Attribution

Always add:

```text
मीडिया रिपोर्ट्स के अनुसार
```

---

# 5) AI Usage (LIMITED)

Use AI ONLY for:

* grammar correction
* readability improvement

NOT for full article generation.

---

# 6) Duplicate Avoidance

System must:

* compare with existing articles
* avoid similar sentence patterns
* shuffle sentence order

---

# 7) SEO Integration

Auto insert:

* keyword in headline
* keyword in first paragraph
* keyword in subheading

---

# 8) Output Format

Final article:

```text
[Headline]

[Summary]

[Main Update]

[Details]

[Background]

[Impact]

[Source Attribution]
```

---

# 9) Example

## Input:

```text
iPhone 15 price reduced globally due to demand issues
```

## Output:

```text
iPhone 15 की कीमत में कटौती, जानिए नया रेट

Apple ने iPhone 15 की कीमत कम कर दी है।
यह फैसला demand को बढ़ाने के लिए लिया गया है।

कंपनी ने global market में यह बदलाव लागू किया है।

इसका असर ग्राहकों पर पड़ेगा और बिक्री बढ़ सकती है।

मीडिया रिपोर्ट्स के अनुसार
```

---

# 10) Developer Implementation Notes

* use regex for cleaning
* use sentence tokenizer
* use dictionary mapping
* use template engine
* use optional AI cleanup layer

---

# 11) Final Rule

```text
Readable + Structured + Original = Good Content
```
