# Knowledge Graph JSON Structure Specification

## Required JSON Format for Backend Team

The knowledge graph component expects a JSON object with the following structure:

```json
{
  "nodes": [
    {
      "id": "unique_category_id",
      "label": "Display Name for Category",
      "type": "category",
      "children": [
        {
          "id": "unique_subcategory_id",
          "label": "Display Name for Subcategory/Study",
          "type": "sub-category",
          "pdf_url": "https://example.com/path/to/document.pdf"
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "category_id_1",
      "target": "category_id_2",
      "relation": "relationship_description"
    }
  ]
}
```

## Detailed Field Specifications

### Node Object (Category Level)

- **`id`** (string, required): Unique identifier for the category
- **`label`** (string, required): Display name shown in the graph
- **`type`** (string, required): Must be `"category"` for top-level nodes
- **`children`** (array, optional): Array of subcategory/study objects

### Children Object (Subcategory/Study Level)

- **`id`** (string, required): Unique identifier for the subcategory/study
- **`label`** (string, required): Display name shown in the graph
- **`type`** (string, required): Must be `"sub-category"` for child nodes
- **`pdf_url`** (string, optional): URL to PDF document that opens when clicked

### Edge Object (Relationships between Categories)

- **`source`** (string, required): ID of the source category node
- **`target`** (string, required): ID of the target category node
- **`relation`** (string, optional): Description of the relationship (e.g., "related_topic", "complementary_research")

## Example Implementation

```json
{
  "nodes": [
    {
      "id": "muscle_physiology",
      "label": "Muscle Physiology",
      "type": "category",
      "children": [
        {
          "id": "muscle_study_001",
          "label": "ISS Muscle Atrophy Study 2020",
          "type": "sub-category",
          "pdf_url": "https://osdr.nasa.gov/studies/muscle_study_001.pdf"
        },
        {
          "id": "muscle_study_002",
          "label": "Microgravity Muscle Response 2021",
          "type": "sub-category",
          "pdf_url": "https://osdr.nasa.gov/studies/muscle_study_002.pdf"
        }
      ]
    },
    {
      "id": "plant_biology",
      "label": "Plant Biology",
      "type": "category",
      "children": [
        {
          "id": "plant_study_001",
          "label": "Zero-G Plant Growth Experiment",
          "type": "sub-category",
          "pdf_url": "https://osdr.nasa.gov/studies/plant_study_001.pdf"
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "muscle_physiology",
      "target": "plant_biology",
      "relation": "biological_systems_research"
    }
  ]
}
```

## Behavior Notes

1. **Category Nodes**: Clicking expands/collapses child nodes in a circular pattern around the parent
2. **Study Nodes**: Clicking opens the PDF URL in a new tab
3. **Edge Relationships**: Visual connections between related categories with hover labels
4. **Color Coding**: Categories get automatic color coding based on their ID for visual distinction

## Validation Rules

- All `id` fields must be unique across the entire dataset
- Category `id` values referenced in edges `source`/`target` must exist in the nodes array
- `pdf_url` should be a valid HTTP/HTTPS URL
- Maximum recommended: 10 categories, 5 studies per category for optimal performance

## API Endpoint Suggestion

```
GET /api/knowledge-graph
Response: JSON object matching the structure above
```
