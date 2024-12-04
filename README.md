# Mini Search Engine for Articles

## Overview

The **Mini Search Engine for Articles** is a backend application developed using **Node.js** and **Express**. This simple search engine allows users to **add**, **search**, and **retrieve articles** based on keywords and tags. The articles are indexed in-memory for efficient searching and relevance-based sorting.

## Features

- **Add Articles**:  
  Add articles with a title, content, and tags.
  
- **Search Articles**:  
  Search for articles by keywords in the title or content. Search results can be sorted by relevance or publication date.

- **Get Article by ID**:  
  Retrieve the full article details using the article's unique ID.

## Endpoints

### 1. Add Article (POST /articles)

**Description**: Adds a new article with a title, content, and tags.

**Request Body**:
```json
{
  "title": "Article Title",
  "content": "Article content goes here.",
  "tags": ["tag1", "tag2"]
}
