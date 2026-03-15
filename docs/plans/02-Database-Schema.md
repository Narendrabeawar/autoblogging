# Step 2: Database Schema

## Core Tables

### articles

| Field           | Type           | Description       |
| --------------- | -------------- | ----------------- |
| id              | uuid           | Primary key       |
| title           | text           | Article title     |
| slug            | text           | URL slug (unique) |
| content         | text           | Full article body |
| excerpt         | text           | Short summary     |
| category        | text/reference | Category ID       |
| tags            | text[]         | Array of tags     |
| featured_image  | text           | Image URL         |
| seo_title       | text           | Meta title        |
| seo_description | text           | Meta description  |
| created_at      | timestamp      | Creation time     |
| published_at    | timestamp      | Publish time      |
| status          | enum           | draft, published  |

### categories (extended)

| Field      | Type | Description       |
| ---------- | ---- | ----------------- |
| id         | uuid | Primary key       |
| name       | text | Category name     |
| slug       | text | URL slug          |
| parent_id  | uuid | For subcategories |
| icon       | text | Icon name         |
| color      | text | Theme color       |
| sort_order | int  | Display order     |

### tags

| Field         | Type | Description  |
| ------------- | ---- | ------------ |
| id            | uuid | Primary key  |
| name          | text | Tag name     |
| slug          | text | URL slug     |
| article_count | int  | Cached count |

## Extended Tables (Phase 2+)

### newsletter_subscribers

| Field         | Type      |
| ------------- | --------- |
| id            | uuid      |
| email         | text      |
| subscribed_at | timestamp |
| preferences   | jsonb     |

### article_analytics

| Field       | Type |
| ----------- | ---- |
| article_id  | uuid |
| date        | date |
| views       | int  |
| shares      | int  |
| helpful_yes | int  |
| helpful_no  | int  |

### automation_logs

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| type       | text      |
| status     | text      |
| details    | jsonb     |
| created_at | timestamp |

### ai_usage

| Field       | Type      |
| ----------- | --------- |
| id          | uuid      |
| provider    | text      |
| tokens_used | int       |
| cost        | decimal   |
| created_at  | timestamp |

## Main Categories

- Loneliness
- Breakup
- Relationships
- Friendship
- Self Improvement
- Mental Strength
- Motivation
- Life Advice

---

**Next:** [03-Content-Types.md](03-Content-Types.md)
